import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  Flex,
  Box,
  Table,
  StateView,
  Icon,
  IconTypes,
  Container,
  Popover,
  PopoverOrigin,
  ContextMenu,
  Button,
  ButtonTypes,
  TextTypes,
  Modal,
  ModalSizes,
} from 'cortex-look-book';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import useCheckAuth from '../../../../../../hooks/useCheckAuth';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { deleteDMField, updateDMField } from '../../../../../../store/contentLibrary/datamodels/actions';
import { getDMFieldMenuOptions, runFieldAliasValidation } from '../../../utils/DataModelsHelper';
import { checkPermissions } from '../../../../../../utils/permissionsHelper';
import {
  dmFieldDetailsInnerHeaderCheckBox,
  dmFieldDetailsTopHeaderCheckBox,
  dmFieldDetailsInnerHeader,
  dmFieldDetailsTopHeader,
  dmFieldCheckboxDisable,
  dmFieldTopCheckboxName,
  DM_FIELD_INITIAL_STATE,
  DM_FIELD_FORM_STATE,
  ContextMenuOptions,
  aliasesUtilities,
  DATA_MODEL_STATES,
} from '../../../constants/constants';
import AddDMFieldModal from '../AddDMFieldModal/AddDMFieldModal';
import DMFieldTableAliasColumn from './DMFieldTableAliasColumn';
import { DMFieldTableWrapper } from '../styledComponents';

const PAGE_NAME = 'CL_DATAMODEL_FIELDS_LIST';

// eslint-disable-next-line sonarjs/cognitive-complexity
const DataModelFieldsList = (
  { searchText, isFieldModalShown, handleClose, showFieldModal, isAddField } // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const isFetchingFieldTypes = useSelector(contentLibraryDMSelectors.isFetchingFieldTypes);
  const isDMFieldUpdating = useSelector(contentLibraryDMSelectors.isDMFieldUpdating);
  const fieldTypes = useSelector(contentLibraryDMSelectors.fieldTypes);
  const datamodel = useSelector(contentLibraryDMSelectors.datamodel);

  const [dmFieldFormState, setDMFieldFormState] = useState(JSON.parse(JSON.stringify(DM_FIELD_FORM_STATE)));
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [dmFieldValue, setDMFieldValue] = useState(JSON.parse(JSON.stringify(DM_FIELD_INITIAL_STATE)));
  const [deleteWarningText, setDeleteWarningText] = useState('');
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [entityDateField, setEntityDateField] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fieldsList, setFieldsList] = useState([]);

  const dmFieldNameRef = useRef();
  const dmFieldAlisesRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { permissions } = useCheckAuth();
  const options = getDMFieldMenuOptions(t);

  useEffect(() => {
    const dmFields = datamodel?.fields || [];
    setFieldsList(dmFields.sort((field1, field2) => Date.parse(field2.lastUpdated) - Date.parse(field1.lastUpdated)));
  }, [datamodel]);

  useEffect(() => {
    const tempEntityDateField = {};
    fieldsList?.forEach(eachFeild => {
      if (eachFeild.isTimeFilter) {
        tempEntityDateField[dmFieldCheckboxDisable[0]] = eachFeild.id;
      } else if (eachFeild.isEntityFilter) {
        tempEntityDateField[dmFieldCheckboxDisable[1]] = eachFeild.id;
      }
    });
    setEntityDateField(tempEntityDateField);
  }, [fieldsList]);

  useEffect(() => {
    setFieldsList(
      [...(datamodel?.fields || [])]
        .filter(
          x =>
            (x.nameTech || '')
              .trim()
              .toLowerCase()
              .indexOf((searchText || '').trim().toLowerCase()) > -1
        )
        .sort((field1, field2) => Date.parse(field2.lastUpdated) - Date.parse(field1.lastUpdated))
    );
  }, [searchText]);

  useEffect(() => {
    if (isAddField) {
      setDMFieldFormState(JSON.parse(JSON.stringify(DM_FIELD_FORM_STATE)));
      setDMFieldValue(JSON.parse(JSON.stringify(DM_FIELD_INITIAL_STATE)));
    }
  }, [isAddField]);

  const handleContextButton = (e, field) => {
    setSelectedField(field);
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setIsMenuOpen(true);
  };

  const handleOptionClick = option => {
    setIsMenuOpen(false);
    switch (option.id) {
      case ContextMenuOptions.DELETE:
        setDeleteWarningText(
          t('Pages_Content_Library_DataModelFields_Delete_warning').replace('{name}', selectedField?.nameTech || '')
        );
        setIsWarningShown(true);
        break;
      case ContextMenuOptions.EDIT:
        const type = (fieldTypes || []).filter(dt => dt?.code?.toLowerCase() === selectedField?.type?.toLowerCase());
        const value = {
          ...selectedField,
          type: type.length > 0 ? type : [{ code: selectedField.type, displayName: selectedField.type }],
          // set CONFLICTED_ALIASES & TEXT_ALIASES to empty while EDIT/ADD modal is opened
          [aliasesUtilities.CONFLICTED_ALIASES]: [],
          [aliasesUtilities.TEXT_ALIASES]: '',
        };
        setDMFieldValue(value);
        setDMFieldFormState({
          value,
          invalid: 'initial',
          submitted: false,
        });
        showFieldModal();
        break;
      default:
        break;
    }
  };

  const renderContextMenu = () => {
    const filteredOptions = options.filter(opt =>
      checkPermissions(permissions, opt.permission.permission, opt.permission.action)
    );

    return (
      <ContextMenu
        options={filteredOptions}
        onOptionClicked={handleOptionClick}
        dataInstance={`${PAGE_NAME}-ContextMenu`}
        cursor='pointer'
      />
    );
  };

  const onCloseWarning = () => {
    setIsWarningShown(false);
  };

  const onConfirmDelte = () => {
    dispatch(deleteDMField(datamodel?.id, selectedField?.id));
    setIsWarningShown(false);
  };

  const handleFieldModalOk = async () => {
    /** Check-1- If the form state is invalid */
    if (dmFieldFormState.invalid) {
      setDMFieldFormState({ ...dmFieldFormState, submitted: true });

      return;
    }

    /** Check-2- Validation of Aliases and DM Fields STARTS */

    /** Only Do for Non-Published DM */
    if (datamodel?.stateHistory?.[0]?.publishState !== DATA_MODEL_STATES.PUBLISHED) {
      const dmAllFiledsDetail = datamodel?.fields || [];
      const result = runFieldAliasValidation(
        t,
        dmAllFiledsDetail,
        { ...dmFieldValue },
        dmFieldAlisesRef,
        dmFieldNameRef
      );
      setDMFieldValue({ ...dmFieldValue, ...result.dmFieldToUpdate });
      setDMFieldFormState({ ...dmFieldFormState, value: { ...dmFieldFormState.value, ...result.dmFieldToUpdate } });

      if (result.isError) {
        result.scrollTo.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });

        return;
      }
    }

    /** Validation of Aliases and DM Fields ENDS */

    /** If Conflict occurs dont proceed with below execution */

    const fieldToBeUpdated = dmFieldFormState.value;
    if (!isAddField && selectedField) {
      fieldToBeUpdated.id = selectedField?.id;
    }
    dispatch(updateDMField(datamodel?.id, fieldToBeUpdated)).then(res => {
      if (res) {
        handleClose();
      }
    });
  };

  const emptyStateText =
    (searchText || '').length > 0
      ? t('Pages_Content_Library_DataModelsFields_NoSearchResults')
      : t('Pages_Content_Library_DataModelsListing_NoFields');

  const renderTableName = (name, row) => (
    <Text
      ellipsisTooltip
      tooltipWrapperWidth='inherit'
      charLimit={15}
      fontWeight='m'
      dataInstance={`${PAGE_NAME}-DMFields-${row.id}-name`}
    >
      {name}
    </Text>
  );

  const renderDMField = (value, rowId, colName) => {
    if (dmFieldDetailsTopHeader[colName] === dmFieldDetailsTopHeader.ALIASES) {
      return value ? (
        <DMFieldTableAliasColumn
          dataInstance={`${PAGE_NAME}-DMFields-${rowId}-${colName}-DMFieldTableAliasColumn`}
          pageName={PAGE_NAME}
          rowId={rowId}
          colName={colName}
          aliases={value}
          key={rowId}
        />
      ) : null;
    } else if (dmFieldDetailsTopHeader[colName] === dmFieldDetailsTopHeader.DESCRIPTION) {
      return <Text charLimit={40}>{value}</Text>;
    } else if ([...dmFieldTopCheckboxName, ...dmFieldCheckboxDisable].includes(colName)) {
      return (
        <Icon
          type={value ? IconTypes.CIRCLE_CHECKMARK : IconTypes.CLOSE_CIRCLE}
          color={value ? 'green' : 'red'}
          size={value ? 25 : 18}
          ml={value ? 0 : 3}
        />
      );
    }

    return value ? (
      <Text charLimit={45}>{value}</Text>
    ) : (
      <Icon size={12} cursor='auto' type={IconTypes.MINUS} dataInstance={`${PAGE_NAME}-DMFields-${rowId}-${colName}`} />
    );
  };

  const topTableFields = { ...dmFieldDetailsTopHeader, ...dmFieldDetailsTopHeaderCheckBox };
  const topHeaders = [
    {
      title: '',
      key: 'isExpandableRow',
      width: '5%',
      iconHeight: 30,
      iconWidth: 30,
      collapseRow: true,
    },
    ...Object.keys(topTableFields).map(eachField => {
      return {
        title: t(`Pages_Content_Library_DataModel_Fields_Headers_${eachField}`),
        key: topTableFields[eachField],
        render: (value, row) => (
          <Box minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-DMFields-${row?.id}-${eachField}`}>
            {eachField.includes('NAME') ? renderTableName(value, row) : renderDMField(value, row?.id, eachField)}
          </Box>
        ),
      };
    }),
    {
      key: 'menu',
      render: (value, row) => (
        <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${PAGE_NAME}-DataModel-${row.id}-moreMenu`}>
          {permissions?.dataModels?.update && (
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              dataInstance={`${PAGE_NAME}-Context`}
              onClick={e => handleContextButton(e, row)}
            />
          )}
        </Flex>
      ),
    },
  ];

  const innerTableFields = { ...dmFieldDetailsInnerHeader, ...dmFieldDetailsInnerHeaderCheckBox };
  const innerHeaders = Object.keys(innerTableFields).map(eachField => {
    return {
      title: t(`Pages_Content_Library_DataModel_Fields_Headers_${eachField}`),
      key: innerTableFields[eachField],
      render: (value, row) => renderDMField(value, row?.id, eachField),
    };
  });

  const renderInnerDMFields = rowDetails => {
    return (
      <Box>
        <Text type={TextTypes.H4} fontWeight='l' mb={5} ml={2}>
          {t('Pages_Content_Library_DataModelsFields_InnerTable_Header')}
        </Text>
        <Table
          headers={innerHeaders}
          rows={[rowDetails]}
          dataInstance={`${PAGE_NAME}-DataModelsFieldsList-Inner-InnerTable`}
        />
      </Box>
    );
  };

  return (
    <Container>
      <Text
        forwardedAs='h2'
        type={TextTypes.H2}
        fontWeight='s'
        color='gray'
        pt={12}
        dataInstance={`${PAGE_NAME}-DataModelName`}
      >
        {datamodel?.nameTech}
      </Text>
      <DMFieldTableWrapper dataInstance={`${PAGE_NAME}-DataModelsFieldsList-Container`}>
        {datamodel?.fields?.length > 0 && (
          <Table
            headers={topHeaders}
            rows={fieldsList}
            dataInstance={`${PAGE_NAME}-DataModelsFieldsList-TopTable`}
            isRowExpandable={() => {
              return true;
            }}
            isMultiRowOpen
            renderInnerTemplate={row => {
              return renderInnerDMFields(row);
            }}
          />
        )}
        {datamodel?.fields?.length <= 0 && (
          <StateView title={emptyStateText} dataInstance={`${PAGE_NAME}-DataModelsFieldsList-NoRecords`} />
        )}
      </DMFieldTableWrapper>
      <Popover
        isOpen={isMenuOpen}
        anchorRef={contextButtonRef}
        anchorOriginX={PopoverOrigin.START}
        anchorOriginY={PopoverOrigin.START}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.START}
        onClose={() => setIsMenuOpen(false)}
        width={200}
        mt={7}
        dataInstance={`${PAGE_NAME}-MenuOpover`}
        cursor='pointer'
      >
        {renderContextMenu()}
      </Popover>
      <Modal
        isOpen={isWarningShown}
        onClose={onCloseWarning}
        onPrimaryButtonClick={onConfirmDelte}
        onSecondaryButtonClick={onCloseWarning}
        primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        size={ModalSizes.SMALL}
        dataInstance={`${PAGE_NAME}-Delete-Warning`}
      >
        <Text pb={5}>{deleteWarningText}</Text>
      </Modal>

      <AddDMFieldModal
        ref={{ dmFieldNameRef, dmFieldAlisesRef }}
        loading={isFetchingFieldTypes || isDMFieldUpdating}
        isModalOpen={isFieldModalShown}
        selectedField={selectedField}
        handleClose={handleClose}
        formValue={dmFieldValue}
        formState={dmFieldFormState}
        handleFormState={(value, invalid) =>
          setDMFieldFormState({
            ...dmFieldFormState,
            invalid,
            value,
          })
        }
        handleChanges={newValue => setDMFieldValue(newValue)}
        handlePrimaryButtonClick={handleFieldModalOk}
        isAddField={isAddField}
        dataInstance={`${PAGE_NAME}-Add-Field_modal`}
        entityDateField={entityDateField}
        dataModelName={datamodel?.name || ''}
      />
    </Container>
  );
};

export default DataModelFieldsList;
