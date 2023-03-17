import React, { useState, useEffect } from 'react';
import {
  Text,
  Flex,
  Box,
  Button,
  ButtonTypes,
  IconTypes,
  Table,
  Tag,
  PopoverOrigin,
  Popover,
  ContextMenu,
  Spinner,
  Icon,
  StateView,
  Modal,
  ModalSizes,
  TextTypes,
  AlertHub,
  Tooltip,
  TooltipPosition,
} from 'cortex-look-book';
import styled, { withTheme } from 'styled-components';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import useCheckAuth from '../../../../../../hooks/useCheckAuth';
import {
  createDMT,
  getDMTsFromDM,
  renameDMT,
  addInputForDMT,
  getDatamodelMappings,
  ingestDMT,
  validateDMTName,
} from '../../../../../../store/contentLibrary/datamodels/actions';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { getDMTFromDMOptions, getDMTOptions } from '../../../utils/DataModelsHelper';
import {
  ContextMenuOptions,
  MAPPING_MODAL_TYPE,
  DMT_SOURCE,
  INGEST_DMT,
  INGEST_TYPES,
} from '../../../constants/constants';
import AddNewDMTModal from '../AddNewDMTModal/AddNewDMTModal';
import IngestSelectorModal from '../../../../../../components/IngestSelectorModal/IngestSelectorModal';
import IngestStatusModal from '../IngestStatusModal/IngestStatusModal';
import { useDispatch, useSelector } from 'react-redux';
import env from 'env';
import { useHistory } from 'react-router-dom';
import LocalizedDate from '../../../../../../components/LocalizedDate/LocalizedDate';

const PAGE_NAME = 'CL_FROM_DATAMODELS_LIST';

const StyledMappingDMBody = withTheme(styled(Flex)`
  div {
    width: 100%;
  }
  ul {
    max-height: 80%;
    overflow-y: auto;
    padding-left: 1.4rem;
    list-style: circle;
    li {
      cursor: auto;
    }
  }
`);

const StyledMappingDMTBody = withTheme(styled(Flex)`
  div {
    width: 100%;
  }
`);

// eslint-disable-next-line sonarjs/cognitive-complexity
const FromDataModelsList = ({ datamodelsList, tagsList }) => {
  const { t } = useTranslation();
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mappingModalType, setMappingModalType] = useState('');
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [dmMappingAlerts, setDmMappingAlerts] = useState([]);
  const [showAddDMTModal, setShowAddDMTModal] = useState(false);
  const [isAddDMT, setIsAddDMT] = useState(false);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [showIngestStatusModal, setShowIngestStatusModal] = useState(false);
  const [selectedDM, setSelectedDM] = useState(null);
  const [selectedDMT, setSelectedDMT] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState('');
  const [dmtToIngest, setDmtToIngest] = useState(null);
  const [dmtName, setDMTName] = useState('');
  const [expandedDMRow, setExpandedDMRow] = useState(null);
  const { permissions } = useCheckAuth();
  const isFetchingDMTsFromDM = useSelector(contentLibraryDMSelectors.isFetchingDMTsFromDM);
  const dmtsList = useSelector(contentLibraryDMSelectors.dmtsList);
  const isFetchingDMMap = useSelector(contentLibraryDMSelectors.isFetchingDMMap);
  const dmMapping = useSelector(contentLibraryDMSelectors.dmMapping);
  const dmMappingError = useSelector(contentLibraryDMSelectors.dmMappingError);
  const [showDuplicateDMTWarning, setShowDuplicateDMTWarning] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setDmMappingAlerts(dmMappingError);
  }, [dmMappingError]);

  const onErrorClose = key => {
    const newAlerts = dmMappingAlerts.filter(alert => alert.key !== key);
    setDmMappingAlerts(newAlerts);
  };

  const handleContextButton = (e, datamodel, addDMT) => {
    e?.stopPropagation();
    if (addDMT) {
      setSelectedDM(datamodel);
    } else {
      setSelectedDMT(datamodel);
    }
    setIsAddDMT(addDMT);
    setContextButtonRef({ current: e.target });
    setIsMenuOpen(true);
  };

  const renderTags = tagIds => {
    const tagNames = (tagsList || []).filter(x => (tagIds || []).indexOf(x?.id) > -1).map(x => x?.name);

    return (
      <>
        {tagNames.map((name, index) => (
          <Tag key={index}>{name}</Tag>
        ))}
      </>
    );
  };

  const openMappingModal = (outputs, type) => {
    setMappingModalType(type);
    setIsMappingModalOpen(true);
    if (type === MAPPING_MODAL_TYPE.DMT_MAPPING) {
      dispatch(getDatamodelMappings(type, outputs));
    } else {
      dispatch(getDatamodelMappings(type, [outputs.id], outputs?.nameTech));
    }
  };

  const openDMTIngestStatusModal = row => {
    setSelectedDM(row);
    setShowIngestStatusModal(true);
  };

  const closeIngestStatusModal = () => {
    setShowIngestStatusModal(false);
  };

  const handleCloseMapping = () => {
    setMappingModalType('');
    setDmMappingAlerts([]);
    setIsMappingModalOpen(false);
  };

  const handleDmtConfigure = (dmtId, dmtType, trifactaFlowId) => {
    dispatch(addInputForDMT(dmtId, selectedDM, dmtType, trifactaFlowId)).then(res => {
      if (res) {
        if (dmtType === DMT_SOURCE.TRIFACTA) {
          history.push(`/library/datamodelTransformations/${dmtId}`);
        } else {
          window.location.href = `${env.ANALYTICSUI_URL}/datamodelTransformations/${dmtId}/data`;
        }
      }
    });
  };

  const mappedDMHeaders = [
    {
      title: t('Pages_Content_Library_DataModels_DataModelMapping_Table_Name_Column'),
      key: 'nameTech',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-mapped-DM-${row.id}`}
          onClick={() => {
            history.push(`/library/datamodels/${row.id}/data`);
          }}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-mapped-DM-${row.id}-name`}
            color='blue'
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModels_DataModelMapping_Table_Name_Description'),
      key: 'description',
      render: (description, row) => (
        <Box cursor='auto' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-mapped-DM-${row.id}-description`}>
          <Text charLimit={40}>{description}</Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModels_DataModelMapping_Table_Name_Version'),
      key: 'currentState',
      render: (currentState, row) => (
        <Box cursor='auto' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-mapped-DM-${row.id}-version`}>
          <Text charLimit={40}>
            {`${t('Pages_Content_Library_DataModels_DataModelMapping_Table_Name_Version')} ${currentState.version}`}
          </Text>
        </Box>
      ),
    },
  ];
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
      title: t('Pages_Content_Library_DataModels_Headers_DataModel'),
      key: 'nameTech',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-DMT-NameTech-${row.id}`}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-DMT-NameTech-${row.id}-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModels_Headers_Description'),
      key: 'description',
      render: (description, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-DMT-${row.id}-description`}>
          <Text charLimit={40}>{description}</Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Ingest_DMT_INGEST_Status_Header_Label'),
      key: 'id',
      render: (id, row) => (
        <Box
          cursor='pointer'
          minHeight={16}
          width='100%'
          dataInstance={`${PAGE_NAME}-DMT-${row.id}-description`}
          onClick={() => openDMTIngestStatusModal(row)}
        >
          <Text cursor='pointer' color='blue' pt={1}>
            {t('Pages_Ingest_DMTs_Status_View')}
          </Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModels_Headers_Mappings'),
      key: 'mappings',
      width: '11%',
      render: (id, row) => {
        return (
          <Flex
            pl='8%'
            cursor='pointer'
            position='relative'
            width='100%'
            alignItems='center'
            dataInstance={`${PAGE_NAME}-DMT-${row.id}-DM-Mapping-Wrapper`}
            onClick={() => openMappingModal(row, MAPPING_MODAL_TYPE.DM_MAPPING)}
          >
            <Icon type={IconTypes?.MAPPING_LOGO} height='30px' width='30px' />
          </Flex>
        );
      },
    },
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_Tags'),
      key: 'tagIds',
      render: (value, row) => (
        <Box cursor='pointer' minHeight={30} dataInstance={`${PAGE_NAME}-DataModel-${row.id}-tags`}>
          {renderTags(value)}
        </Box>
      ),
    },
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
              dataInstance={`${PAGE_NAME}-ContextMenu`}
              onClick={e => handleContextButton(e, row, true)}
            />
          )}
        </Flex>
      ),
    },
  ];

  const dmtHeaders = [
    {
      title: '',
      width: '1%',
      key: 'workpaperSource',
      render: workpaperSource => (
        <Flex>
          {workpaperSource === DMT_SOURCE.TRIFACTA && (
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.RIGHT}
              tooltipContent={t('Pages_Content_Library_AddNewDMTModal_DMT_INGEST_TrifactaTrifactaTooltip')}
              showOnHover
            >
              <Icon type={IconTypes.AUTO_CONNECTOR_ON} height={28} width={28} color='black' />
            </Tooltip>
          )}
        </Flex>
      ),
    },
    {
      title: 'DMT',
      key: 'name',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-DMT-${row.id}`}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-DMT-${row.id}-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModels_DataModelMapping_Table_Name_Description'),
      key: 'creationDate',
      render: (creationDate, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-DMT-${row.id}-fromEnv`}>
          <Text charLimit={40}>
            {row?.ingestedFromEnv
              ? `${t('Pages_Ingest_DMT_Ingested_From')} ${row?.ingestedFromEnv} on`
              : t('Pages_Ingest_DMT_Created_On')}{' '}
            &nbsp;
            <LocalizedDate date={creationDate} isTimeStamp />
          </Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModels_Headers_Mappings'),
      key: 'outputs',
      render: (outputs, row) => {
        return (
          <Flex
            pl='4%'
            cursor='pointer'
            position='relative'
            width='100%'
            alignItems='center'
            dataInstance={`${PAGE_NAME}-DMT-${row.id}-Mapping-Wrapper`}
            onClick={() => {
              openMappingModal(row.outputs, MAPPING_MODAL_TYPE.DMT_MAPPING);
            }}
          >
            <Icon type={IconTypes?.MAPPING_LOGO} height='30px' width='30px' />
          </Flex>
        );
      },
    },
    {
      title: '',
      key: 'tagIds',
      render: (value, row) => (
        <Flex
          cursor='pointer'
          minHeight={30}
          dataInstance={`${PAGE_NAME}-DataModel-${row.id}-tags`}
          onClick={() => {
            handleDmtConfigure(row.id, row.workpaperSource, row.trifactaFlowId);
          }}
        >
          <Icon cursor='pointer' type={IconTypes?.PLUS_CIRCLE} size={22} color='blue' />
          <Text cursor='pointer' color='blue' pt={3}>
            {t('Pages_Content_Library_StandardBundleList_Configure')}
          </Text>
        </Flex>
      ),
    },
    {
      key: '',
      render: (value, row) => (
        <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${PAGE_NAME}-DataModel-${row.id}-moreMenu`}>
          {permissions?.dataModels?.update && (
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              dataInstance={`${PAGE_NAME}-ContextMenu`}
              onClick={e => handleContextButton(e, row, false)}
            />
          )}
        </Flex>
      ),
    },
  ];

  const handleOptionClick = option => {
    setIsMenuOpen(false);
    switch (option.id) {
      case ContextMenuOptions.EDIT:
        setDMTName(selectedDMT?.name);
        setShowAddDMTModal(true);
        break;
      case INGEST_DMT:
        setShowIngestModal(true);
        break;
      case ContextMenuOptions.ADD_GUIDANCE:
      case ContextMenuOptions.DELETE:
      case ContextMenuOptions.EXPORT:
      case ContextMenuOptions.SUBMIT_REVIEW:
      case ContextMenuOptions.UPLOAD_EXAMPLE_CSV:
      default:
        setDMTName('');
        setShowAddDMTModal(true);
        setSelectedDMT(null);
        break;
    }
  };

  const renderContextMenu = () => {
    const options = isAddDMT ? getDMTFromDMOptions(t) : getDMTOptions(t);

    return (
      <ContextMenu
        options={options}
        onOptionClicked={handleOptionClick}
        dataInstance={`${PAGE_NAME}-ContextMenu`}
        cursor='pointer'
      />
    );
  };

  const handleSubmit = addDMT => {
    const trimmedName = addDMT.dmtInputName.trim();
    if (isAddDMT) {
      dispatch(
        createDMT(
          selectedDM?.nameTech,
          selectedDM?.id,
          trimmedName,
          addDMT.dmtType === DMT_SOURCE.TRIFACTA,
          expandedDMRow === selectedDM?.id
        )
      );
    } else {
      dispatch(renameDMT(selectedDMT?.id, trimmedName, selectedDM?.id));
    }
    setDMTName(addDMT.dmtInputName);
    setShowAddDMTModal(false);
  };

  const closeIngestModal = () => {
    setShowIngestModal(false);
  };

  const renderDMTsList = () => {
    return (
      <Spinner spinning={isFetchingDMTsFromDM}>
        {dmtsList.length > 0 ? (
          <Table rows={dmtsList} headers={dmtHeaders} dataInstance={`${PAGE_NAME}-FromDataModelsListing-InnerTable`} />
        ) : (
          <StateView
            message={t('Pages_Content_Library_DMTS_NO_DMTS_FOR_DM')}
            dataInstance={`${PAGE_NAME}-FromDataModelsListing-NoRecords`}
            iconWidth={100}
          />
        )}
      </Spinner>
    );
  };

  const onRowClick = (index, rows) => {
    setSelectedDM(rows[index]);
    setExpandedDMRow(rows[index].id);
    dispatch(getDMTsFromDM(rows[index].id));
  };

  const ingestDMTQueue = (environment, dmt) => {
    if (environment && dmt) {
      const ingestRequestObj = {
        pullFromSource: environment,
        dmtName: dmt?.name,
        dmtType: dmt?.workpaperSource === DMT_SOURCE.TRIFACTA ? 1 : 0,
        externalFlowId: dmt?.trifactaFlowId,
        externalDmtId: dmt?.id,
        dataModelName: selectedDM?.nameTech,
      };
      dispatch(ingestDMT(ingestRequestObj)).then(() => {
        closeIngestModal();
      });
    }
  };

  const ingestDMTConfirm = () => {
    ingestDMTQueue(selectedEnv, dmtToIngest);
    setShowDuplicateDMTWarning(false);
  };

  const dmtIngestFromEnv = (environment, dmt) => {
    setSelectedEnv(environment);
    setDmtToIngest(dmt);
    dispatch(validateDMTName(dmt?.name)).then(response => {
      if (response && !response.isError) {
        ingestDMTQueue(environment, dmt);
      } else if (!response) {
        setShowDuplicateDMTWarning(true);
        closeIngestModal();
      } else {
        closeIngestModal();
      }
    });
  };

  return (
    <>
      <Table
        rows={datamodelsList}
        headers={headers}
        dataInstance={`${PAGE_NAME}-Table`}
        isRowExpandable={() => {
          return true;
        }}
        onExpandItemClick={onRowClick}
        renderInnerTemplate={() => {
          return renderDMTsList();
        }}
        isMultiRowOpen={false}
      />
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
      {showAddDMTModal && (
        <AddNewDMTModal
          isOpen={showAddDMTModal}
          dmtName={dmtName}
          dmtSource={selectedDMT?.workpaperSource}
          handleClose={() => {
            setDMTName('');
            setShowAddDMTModal(false);
          }}
          handleSubmit={handleSubmit}
          dataInstance={`${PAGE_NAME}-AddDMTModal`}
        />
      )}

      {isMappingModalOpen && (
        <Modal
          isOpen={isMappingModalOpen}
          onClose={handleCloseMapping}
          size={ModalSizes.MEDIUM}
          dataInstance={`${PAGE_NAME}-MappingModal`}
        >
          <Flex
            width='100%'
            flexDirection='column'
            maxHeight='80vh'
            dataInstance={`${PAGE_NAME}-DMTMappingModalInner-Flex`}
          >
            <AlertHub alerts={dmMappingAlerts} onClose={onErrorClose} dataInstance={`${PAGE_NAME}-DM_Mapping_Alert`} />

            <Text type={TextTypes.H2} fontWeight='s' dataInstance={`${PAGE_NAME}-DMT-Mapping-Header`}>
              {mappingModalType === MAPPING_MODAL_TYPE.DMT_MAPPING
                ? t('Pages_Content_Library_DMTS_MAPPING_MODAL_HEADER')
                : t('Pages_Content_Library_DM_MAPPING_MODAL_HEADER')}
            </Text>
            <Spinner spinning={isFetchingDMMap} dataInstance={`${PAGE_NAME}-Mapping_Body_Spinner`}>
              {mappingModalType === MAPPING_MODAL_TYPE.DM_MAPPING &&
                (dmMapping?.length > 0 ? (
                  <StyledMappingDMBody maxHeight='81vh' dataInstance={`${PAGE_NAME}-DMMappingModalBody-Flex`}>
                    <ContextMenu
                      mt='6'
                      options={dmMapping.map((ele, index) => {
                        return {
                          id: index,
                          text: ele,
                        };
                      })}
                      header={
                        <Text type={TextTypes.H3} fontWeight='s'>
                          {t('Pages_Content_Library_DM_MAPPING_MODALSUBHEADER')}
                        </Text>
                      }
                    />
                  </StyledMappingDMBody>
                ) : (
                  <StateView
                    borderWidth='1px 0px 0px 0px'
                    borderStyle='solid'
                    borderColor='lightGray'
                    mt='6'
                    title={t('Pages_Content_Library_DM_MAPPING_EMPTY_DIALOUGE_FOR_DM')}
                    dataInstance={`${PAGE_NAME}-DMMappingModalBody_NoData`}
                    iconWidth={100}
                  />
                ))}

              {mappingModalType === MAPPING_MODAL_TYPE.DMT_MAPPING &&
                (dmMapping?.length > 0 ? (
                  <StyledMappingDMTBody dataInstance={`${PAGE_NAME}-DMTMappingModalBody-Flex`} maxHeight='79.5vh'>
                    <Table
                      mt='10'
                      rows={dmMapping}
                      headers={mappedDMHeaders}
                      dataInstance={`${PAGE_NAME}-Mapped-DM-Table`}
                    />
                  </StyledMappingDMTBody>
                ) : (
                  <StateView
                    borderWidth='1px 0px 0px 0px'
                    borderStyle='solid'
                    borderColor='lightGray'
                    mt='6'
                    title={t('Pages_Content_Library_DM_MAPPING_EMPTY_DIALOUGE_FOR_DMT')}
                    dataInstance={`${PAGE_NAME}-DMTMappingModalBody_NoData`}
                    iconWidth={100}
                  />
                ))}
            </Spinner>
          </Flex>
        </Modal>
      )}

      <IngestSelectorModal
        isOpen={showIngestModal}
        handleClose={closeIngestModal}
        handleSubmit={dmtIngestFromEnv}
        titleText={t('Pages_Ingest_DMT_Title')}
        selectedItem={selectedDM}
        ingestType={INGEST_TYPES.DMT}
        dataInstance={`${PAGE_NAME}-Ingest_SelectorModal`}
      />

      <IngestStatusModal
        isOpen={showIngestStatusModal}
        handleClose={closeIngestStatusModal}
        selectedDM={selectedDM}
        dataInstance={`${PAGE_NAME}-Ingest_StatusModal`}
      />
      <Modal
        isOpen={showDuplicateDMTWarning}
        onClose={() => {
          setShowDuplicateDMTWarning(false);
        }}
        onPrimaryButtonClick={ingestDMTConfirm}
        onSecondaryButtonClick={() => {
          setShowDuplicateDMTWarning(false);
        }}
        primaryButtonText={t('Upper_OK', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        size={ModalSizes.SMALL}
        dataInstance={`${PAGE_NAME}-dmt-name-warning`}
      >
        <Text type={TextTypes.BODY} my={6} sx={{ wordWrap: 'break-word' }}>
          {t('Pages_Ingest_DMT_Duplicate_Name_Warning').replace('dmtName', dmtToIngest?.name)}
        </Text>
        <Text type={TextTypes.BODY} my={6} sx={{ wordWrap: 'break-word' }}>
          {t('Pages_Ingest_DMT_Duplicate_Name_Warning_Rename')}
        </Text>
      </Modal>
    </>
  );
};

export default FromDataModelsList;
