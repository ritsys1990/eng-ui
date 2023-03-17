import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Text,
  TextTypes,
  StateView,
  Spinner,
  Table,
  Flex,
  Button,
  ButtonTypes,
  IconTypes,
  Popover,
  PopoverOrigin,
  ContextMenu,
} from 'cortex-look-book';
import { useHistory } from 'react-router-dom';
import useTranslation from '../../../../../hooks/useTranslation';
import useWarningModal from '../../../../../hooks/useWarningModal';
import { getDMFieldMenuOptions } from '../../utils/DataModelsHelper';
import { commonDatamodelSelectors } from '../../../../../store/contentLibrary/commonDataModels/selectors';
import {
  deleteCommonDataModel,
  getAllCommonDataModels,
  getMappedDMsofCDM,
} from '../../../../../store/contentLibrary/commonDataModels/actions';
import AddCommondataModelModal from './AddCommonDataModelModal/AddCommonDataModelModal';
import DataModelsVersionHistoryModal from '../DataModelsVersionHistoryModal/DataModelsVersionHistoryModal';
import { ContextMenuOptions } from '../../constants/constants';

const PAGE_NAME = 'CL_COMMON_DATAMODELS_LIST';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CommonDataModels = ({ isAddCDMModalShown, closeAddEditModal, searchText }) => {
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCDM, setSelectedCDM] = useState(null);
  const [selectedDM, setSelectedDM] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(null);
  const [cdmsList, setCDMsList] = useState([]);
  const [isAddCDMModalOpen, setIsAddCDMModalOpen] = useState(false);
  const [isEditCDMModalOpen, setIsEditCDMModalOpen] = useState(false);
  const isFetchingCDMs = useSelector(commonDatamodelSelectors.isFetchingCDMs);
  const isDeletingCDM = useSelector(commonDatamodelSelectors.isDeletingCDM);
  const isFetchingMappedDMs = useSelector(commonDatamodelSelectors.isFetchingMappedDMs);
  const commonDatamodels = useSelector(commonDatamodelSelectors.commonDatamodels);
  const mappedDMs = useSelector(commonDatamodelSelectors.mappedDMs);
  const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');
  const DEFAULT_STATUS = 'Draft';
  const options = getDMFieldMenuOptions(t);

  useEffect(() => {
    if (isAddCDMModalShown) {
      setIsAddCDMModalOpen(true);
    }
  }, [isAddCDMModalShown]);

  useEffect(() => {
    const dmList = commonDatamodels;
    setCDMsList(
      (dmList || []).filter(
        x =>
          (x.name || '')
            .trim()
            .toLowerCase()
            .indexOf((searchText || '').trim().toLowerCase()) > -1
      )
    );
  }, [commonDatamodels, searchText]);

  const emptyStateText =
    (searchText || '').length > 0
      ? t('Pages_Content_Library_CommonDataModels_NoSearchResults')
      : t('Pages_Content_Library_CommonDataModels_EmptyText');

  const handleContextButton = (e, item) => {
    setSelectedCDM(item);
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setIsMenuOpen(true);
  };

  const opendataModelsHistoryModal = datamodel => {
    setSelectedDM(datamodel);
    setIsHistoryOpen(true);
  };

  const navigateToDMDetail = row => {
    history.push(`/library/datamodels/${row.id}/data`);
  };

  const headers = [
    {
      title: '',
      key: 'isExpandableRow',
      width: '5%',
      iconHeight: 30,
      iconWidth: 30,
      collapseRow: true,
    },
    {
      title: t('Pages_Content_Library_CommonDataModels_Headers_DataModel'),
      key: 'name',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-CommonDatamodel-${row.id}`}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={20}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-CommonDatamodel-${row.id}-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_CommonDataModels_Headers_Description'),
      key: 'description',
      render: (description, row) => (
        <Box
          cursor='pointer'
          minHeight={16}
          width='100%'
          dataInstance={`${PAGE_NAME}-CommonDatamodel-${row.id}-description`}
        >
          <Text charLimit={30}>{description}</Text>
        </Box>
      ),
    },
    {
      key: 'context',
      render: (value, row) => (
        <Flex
          justifyContent='flex-end'
          cursor='pointer'
          dataInstance={`${PAGE_NAME}-CommonDataModel-${row.id}-moreMenu`}
        >
          <Button
            p={2}
            type={ButtonTypes.FLAT}
            icon={IconTypes.ELLIPSIS_Y}
            iconWidth={18}
            dataInstance={`${PAGE_NAME}-Context`}
            onClick={e => handleContextButton(e, row)}
          />
        </Flex>
      ),
    },
  ];

  const dmHeaders = [
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_DataModel'),
      key: 'nameTech',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-CDM-MappedDM-${row.id}`}
          onClick={() => navigateToDMDetail(row)}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={30}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-CDM-MappedDM-${row.id}-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_Description'),
      key: 'description',
      render: (description, row) => (
        <Box
          cursor='pointer'
          minHeight={16}
          width='100%'
          dataInstance={`${PAGE_NAME}-CDM-MappedDM-${row.id}-description`}
        >
          <Text charLimit={30}>{description}</Text>
        </Box>
      ),
    },

    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_Status'),
      key: 'currentState',
      render: (value, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-CDM-MappedDM-${row.id}-status`}>
          <Text charLimit={40}>{splitByCapital(value.publishState || DEFAULT_STATUS)}</Text>
        </Box>
      ),
    },

    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_Versions'),
      key: 'currentState',
      render: (currentState, row) => (
        <Box
          cursor='pointer'
          minHeight={16}
          width='65px'
          onClick={() => opendataModelsHistoryModal(row)}
          dataInstance={`${PAGE_NAME}-CDM-MappedDM-${row.id}-status`}
        >
          <Text cursor='pointer' color='blue' pt={1} fontWeight='l'>
            {`Version ${currentState.displayVersion}`}
          </Text>
        </Box>
      ),
    },
  ];

  const confirmDeleteCDM = () => {
    if (selectedCDM.mappedDMs?.length > 0) {
      showWarningModal(t('Pages_Content_Library_CommonDataModels_DeleteError'), null, true);
    } else {
      dispatch(deleteCommonDataModel(selectedCDM.id)).then(resp => {
        if (resp) {
          dispatch(getAllCommonDataModels());
        }
      });
    }
  };

  const handleOptionClick = option => {
    setIsMenuOpen(false);
    switch (option.id) {
      case ContextMenuOptions.EDIT:
        setIsEditCDMModalOpen(true);
        break;

      case ContextMenuOptions.DELETE:
        showWarningModal(t('Pages_Content_Library_CommonDataModels_DeleteWarning'), confirmDeleteCDM, false);
        break;

      default:
        break;
    }
  };

  const renderContextMenu = () => {
    return (
      <ContextMenu
        options={options}
        onOptionClicked={handleOptionClick}
        dataInstance={`${PAGE_NAME}-ContextMenu`}
        cursor='pointer'
      />
    );
  };

  const handleClose = () => {
    setSelectedCDM(null);
    setIsEditCDMModalOpen(false);
    setIsAddCDMModalOpen(false);
    closeAddEditModal();
  };

  const onRowClick = (index, rows) => {
    dispatch(getMappedDMsofCDM(rows[index].id));
  };

  const renderInnerDMs = () => {
    return (
      <Spinner spinning={isFetchingMappedDMs}>
        {mappedDMs.length > 0 ? (
          <Table rows={mappedDMs} headers={dmHeaders} dataInstance={`${PAGE_NAME}-FromCDMs-MappedDMs-Table`} />
        ) : (
          <StateView
            message={t('Pages_Content_Library_CommonDataModels_NoMappedDMs')}
            dataInstance={`${PAGE_NAME}-FromCDMs-MappedDMs-NoRecords`}
            iconWidth={100}
          />
        )}
      </Spinner>
    );
  };

  return (
    <Box pt={12} dataInstance={PAGE_NAME}>
      <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray'>
        {t('Pages_Content_Library_Common_Datamodels')}
      </Text>
      <Box dataInstance={`${PAGE_NAME}-CommonDataModels-Table-Container`} backgroundColor='white' mt={8}>
        <Spinner
          spinning={isFetchingCDMs || isDeletingCDM}
          dataInstance={`${PAGE_NAME}-CommonDataModels-Table_Spinner`}
          label={isFetchingCDMs ? t('Pages_WorkpaperProcess_Step1_Loading') : t('Pages_Clients_DeleteClientSpinner')}
        >
          {cdmsList?.length > 0 && (
            <Table
              headers={headers}
              rows={cdmsList}
              dataInstance={`${PAGE_NAME}-CommonDataModels-Table`}
              isRowExpandable={() => {
                return true;
              }}
              onExpandItemClick={onRowClick}
              renderInnerTemplate={() => {
                return renderInnerDMs();
              }}
              isMultiRowOpen={false}
            />
          )}
          {cdmsList?.length === 0 && (
            <StateView title={emptyStateText} dataInstance={`${PAGE_NAME}-CommonDataModels-NoRecords`} />
          )}
        </Spinner>
      </Box>
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
      <AddCommondataModelModal
        isOpen={isEditCDMModalOpen || isAddCDMModalOpen}
        handleClose={handleClose}
        isAddCDM={isAddCDMModalOpen}
        selectedCDM={selectedCDM}
        dataInstance={`${PAGE_NAME}-AddCommonDM`}
      />
      {isHistoryOpen && (
        <DataModelsVersionHistoryModal
          datamodel={selectedDM}
          onClose={() => setIsHistoryOpen(false)}
          dataInstance={`${PAGE_NAME}-Version-History-Modal`}
        />
      )}
      {renderWarningModal()}
    </Box>
  );
};

export default CommonDataModels;
