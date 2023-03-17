import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  Flex,
  Box,
  Button,
  ButtonTypes,
  IconTypes,
  Table,
  TextTypes,
  Spinner,
  Tag,
  Icon,
  PopoverOrigin,
  Popover,
  ContextMenu,
  StateView,
  Modal,
  ModalSizes,
  Tabs,
  Tooltip,
  TooltipPosition,
  Link,
} from 'cortex-look-book';
import {
  switchDMToDraft,
  postAddGuidance,
  submitDMForReview,
  deleteDM,
  redirectToDMValidations,
  exportDataModels,
} from '../../../../../store/contentLibrary/datamodels/actions';
import { contentLibraryDMSelectors } from '../../../../../store/contentLibrary/datamodels/selectors';
import { bundlesSelectors } from '../../../../../store/bundles/selectors';
import { commonDatamodelSelectors } from '../../../../../store/contentLibrary/commonDataModels/selectors';
import { flatMap } from 'lodash';
import env from 'env';
import useTranslation from '../../../../../hooks/useTranslation';
import { getContextMenuOptions, getEditorTabs, defaultPlaceholders } from '../../utils/DataModelsHelper';
import { checkPermissions } from '../../../../../utils/permissionsHelper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled, { withTheme } from 'styled-components';
import {
  ContextMenuOptions,
  DATA_MODEL_STATES,
  TEXT_EXAMPLE_OPTION,
  QUILL_EDITOR_MODULES,
  QUILL_EDITOR_FORMATS,
  DIC_STATUS,
  DIC_COLORS,
  SHOW_DIC_STATUS,
} from '../../constants/constants';
import useCheckAuth from '../../../../../hooks/useCheckAuth';
import useWarningModal from '../../../../../hooks/useWarningModal';
import { useHistory } from 'react-router-dom';
import SubmitForReviewModal from '../SubmitForReviewModal/SubmitForReviewModal';
import UploadFile from './UploadFile/UploadFile';
import DataModelsVersionHistoryModal from '../DataModelsVersionHistoryModal/DataModelsVersionHistoryModal';
import { StyledPill, StyledLink } from './StyledDMList';

const PAGE_NAME = 'CL_DATAMODELS_LIST';

const StyledEditor = withTheme(styled(Box)`
  margin: 10px 0px !important;
  .ql-container {
    height: 60vh !important;
  }
`);

// eslint-disable-next-line sonarjs/cognitive-complexity
const DataModelsList = ({ searchText, openEditDMModal }) => {
  const { t } = useTranslation();
  const isDataModelsFetching = useSelector(contentLibraryDMSelectors.isDataModelsFetching);
  const isDMStatusUpdating = useSelector(contentLibraryDMSelectors.isDMStatusUpdating);
  const isDMDeleting = useSelector(contentLibraryDMSelectors.isDMDeleting);
  const datamodels = useSelector(contentLibraryDMSelectors.datamodels);
  const cdmsMap = useSelector(commonDatamodelSelectors.cdmsMap);
  const isGuidanceLoader = useSelector(contentLibraryDMSelectors.guidanceLoader);
  const tags = useSelector(bundlesSelectors.selectTagsPublishedList);
  const [tagsList, setTagsList] = useState([]);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [datamodelsList, setDataModelsList] = useState([]);
  const [showReviewComments, setShowReviewComments] = useState(false);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const DEFAULT_STATUS = 'Draft';
  const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');
  const options = getContextMenuOptions(t);
  const [selectedDM, setSelectedDM] = useState(null);
  const { permissions } = useCheckAuth();
  const history = useHistory();
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const [isOpenGuidance, setIsOpenGuidance] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editorTabs, setEditorTabs] = useState([]);
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [guidanceLoader, setGuidanceLoader] = useState(false);
  const [currentEditorValue, setCurrentEditorValue] = useState({
    dataset_description: '',
    column_description: '',
    general_instruction: '',
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const editorRef = useRef();

  const handleContextButton = (e, datamodel) => {
    setSelectedDM(datamodel);
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setIsMenuOpen(true);
  };
  const emptyStateText =
    (searchText || '').length > 0
      ? t('Pages_Content_Library_DataModelsListing_NoSearchResults')
      : t('Pages_Content_Library_DataModelsListing_NoWorkpapers');

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

  const getTooltipContent = dicStatus => {
    switch (dicStatus) {
      case DIC_STATUS.NOT_STARTED:
        return t('Pages_Content_Library_DataModelsListing_DICStatus_ToolTip_NotStarted');
      case DIC_STATUS.IN_PROGRESS:
        return t('Pages_Content_Library_DataModelsListing_DICStatus_ToolTip_InProgress');
      case DIC_STATUS.COMPLETE:
        return t('Pages_Content_Library_DataModelsListing_DICStatus_ToolTip_Complete');
      case DIC_STATUS.OUTDATED:
        return t('Pages_Content_Library_DataModelsListing_DICStatus_ToolTip_Outdated');
      default:
        return t('Pages_Content_Library_DataModelsListing_DICStatus_ToolTip_NotStarted');
    }
  };

  const checkDICColor = dicStatus => {
    switch (dicStatus) {
      case DIC_STATUS.IN_PROGRESS:
        return DIC_COLORS.BLUE;
      case DIC_STATUS.COMPLETE:
        return DIC_COLORS.GREEN;
      case DIC_STATUS.OUTDATED:
        return DIC_COLORS.RED;
      case DIC_STATUS.NOT_STARTED:
        return DIC_COLORS.BLACK;
      default:
        return DIC_COLORS.BLACK;
    }
  };
  const navigateToAddDIC = dm => {
    window.location.href = `${env.CORTEXUI_URL}/content-library/data-integrity-check/${dm.id}`;
  };

  const getStatusText = dicStatus => {
    if (dicStatus === DIC_STATUS.NOT_STARTED) {
      return t('Pages_Content_Library_DataModelsListing_Add');
    }

    return t('Pages_Content_Library_DataModelsListing_Edit');
  };

  const showDICStatus = dicStatus => {
    switch (dicStatus) {
      case DIC_STATUS.IN_PROGRESS:
        return SHOW_DIC_STATUS.IN_PROGRESS;
      case DIC_STATUS.COMPLETE:
        return SHOW_DIC_STATUS.COMPLETE;
      case DIC_STATUS.OUTDATED:
        return SHOW_DIC_STATUS.OUTDATED;
      case DIC_STATUS.NOT_STARTED:
        return SHOW_DIC_STATUS.NOT_STARTED;
      default:
        return SHOW_DIC_STATUS.NOT_STARTED;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const navigateToDMV = (dmId, dm) => {
    dispatch(redirectToDMValidations({ dataModelId: dmId, nameTech: dm.nameTech })).then(res => {
      if (res) {
        window.location.href = `${env.ANALYTICSUI_URL}/dataModelValidation/${dmId}/${dm.bundleBaseId}/data`;
      }
    });
  };

  const opendataModelsHistoryModal = datamodel => {
    setSelectedDM(datamodel);
    setIsHistoryOpen(true);
    setActiveEditorTab(editorTabs[0]?.id);
  };

  const navigateToDMDetail = dm => {
    history.push(`/library/datamodels/${dm.id}/data`);
  };

  const headers = [
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_DataModel'),
      key: 'nameTech',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-Datamodel-${row.id}`}
          onClick={() => navigateToDMDetail(row)}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={20}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-Datamodel-${row.id}-name`}
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
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-Datamodel-${row.id}-description`}>
          <Text charLimit={30}>{description}</Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_CommonDataModel'),
      key: 'cdmId',
      render: (value, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-Datamodel-${row.id}-cdmInfo`}>
          <Text charLimit={30}>{value && cdmsMap && cdmsMap.get(value) ? cdmsMap.get(value) : ''}</Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_DataModelIntegrityCheck'),
      key: 'add',
      render: (value, row) => (
        <Flex cursor='pointer' dataInstance={`${PAGE_NAME}-DataModel-${row.id}-add`}>
          <Tooltip
            display='inline-block'
            direction={TooltipPosition.TOP}
            showOnHover
            tooltipContent={getTooltipContent(row.dicStatus)}
          >
            <StyledPill
              dataInstance={`${PAGE_NAME}-Datamodel-${row.id}-dicStatus`}
              cursor='pointer'
              pt={1}
              dicColor={checkDICColor(row.dicStatus)}
              marginRight='3px'
            >
              {showDICStatus(row.dicStatus)}
            </StyledPill>
          </Tooltip>
          <Box>
            <StyledLink>
              <Link className='ADD_EDIT_LINK'>
                <Text
                  cursor='pointer'
                  color='blue'
                  pt={1}
                  id={row.id}
                  style={{
                    textDecoration: 'underline',
                  }}
                  onClick={() => navigateToAddDIC(row)}
                >
                  {getStatusText(row.dicStatus)}
                </Text>
              </Link>
            </StyledLink>
          </Box>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_Status'),
      key: 'currentState',
      render: (value, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-Datamodel-${row.id}-status`}>
          <Text charLimit={40}>{splitByCapital(value?.publishState || DEFAULT_STATUS)}</Text>
        </Box>
      ),
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
      title: t('Pages_Content_Library_DataModelsListing_Headers_Versions'),
      key: 'currentState',
      render: (currentState, row) => (
        <Box
          onClick={() => opendataModelsHistoryModal(row)}
          cursor='pointer'
          minHeight={16}
          width='65px'
          dataInstance={`${PAGE_NAME}-Datamodel-${row.id}-status`}
        >
          <Text cursor='pointer' color='blue' pt={1} fontWeight='l'>
            {`Version ${currentState?.displayVersion}`}
          </Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelsListing_Headers_ExampleCSV'),
      key: 'example',
      render: (value, row) =>
        row.sampleDataSetNodeId && (
          <Icon
            type={IconTypes.CHECKMARK}
            width={16}
            dataInstance={`${PAGE_NAME}-DataModel-${row.id}-TextExampleIcon`}
            color='#86bc25'
          />
        ),
    },
    {
      key: 'context',
      render: (value, row) => (
        <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${PAGE_NAME}-DataModel-${row.id}-moreMenu`}>
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

  const switchDMTODraft = () => {
    dispatch(switchDMToDraft(selectedDM?.id)).then(res => {
      if (res?.id) {
        setSelectedDM({ ...selectedDM, id: res.id });
        openEditDMModal({ ...selectedDM, id: res.id });
      }
    });
  };

  const openAddGuidanceModal = () => {
    setIsOpenGuidance(true);

    const tempCurrentEditorValue = { ...currentEditorValue };
    if (selectedDM.generalInstructions) {
      tempCurrentEditorValue.dataset_description = selectedDM.generalInstructions.datasetDescription;
      tempCurrentEditorValue.column_description = selectedDM.generalInstructions.columnDescription;
      tempCurrentEditorValue.general_instruction = selectedDM.generalInstructions.generalData;
      setCurrentEditorValue(tempCurrentEditorValue);
    } else {
      tempCurrentEditorValue.dataset_description = '';
      tempCurrentEditorValue.column_description = '';
      tempCurrentEditorValue.general_instruction = t('Pages_Content_Library_DataModelsListing_UploadYourFiles');
      setCurrentEditorValue(tempCurrentEditorValue);
    }
  };

  const closeAddGuidanceModal = () => {
    setIsOpenGuidance(false);
    setActiveEditorTab(editorTabs[0].id);
  };

  const submitForReview = (reviewComments, releaseType, rationaleComments) => {
    dispatch(submitDMForReview(selectedDM?.id, reviewComments, releaseType, rationaleComments));
    setShowReviewComments(false);
  };

  const deleteDataModel = () => {
    dispatch(deleteDM(selectedDM?.id));
  };

  const exportDataModel = () => {
    dispatch(exportDataModels(selectedDM.id));
  };

  const onSaveUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const openUploadModal = () => {
    if (!selectedDM.sampleDataSetNodeId) {
      setIsUploadModalOpen(true);
    } else {
      showWarningModal(t(`Pages_Content_Library_DataModel_Warning_Existing_Example`), onSaveUploadModal);
    }
  };

  const handleReviewComments = () => {
    setShowReviewComments(true);
  };

  const handleOptionClick = option => {
    setIsMenuOpen(false);
    switch (option.id) {
      case ContextMenuOptions.EDIT:
        if (selectedDM?.currentState?.publishState !== DATA_MODEL_STATES.DRAFT) {
          const warningText = t('Pages_Content_Library_DM_STATE_CHANGE_WARNING').replace(
            'publishState',
            selectedDM?.currentState?.publishState
          );

          showWarningModal(warningText, switchDMTODraft);
        } else {
          openEditDMModal(selectedDM);
        }
        break;
      case ContextMenuOptions.SUBMIT_REVIEW:
        if (selectedDM?.dicStatus === DIC_STATUS.IN_PROGRESS || selectedDM?.dicStatus === DIC_STATUS.OUTDATED) {
          showWarningModal(t('Pages_Content_Library_DM_DIC_STATE_WARNING'), handleReviewComments);
        } else {
          setShowReviewComments(true);
        }
        break;
      case ContextMenuOptions.DELETE:
        showWarningModal(t('Pages_Content_Library_DM_DELETE_WARNING'), deleteDataModel);
        break;
      case ContextMenuOptions.ADD_GUIDANCE:
        openAddGuidanceModal();
        break;
      case ContextMenuOptions.EXPORT:
        exportDataModel();
        break;
      case ContextMenuOptions.UPLOAD_EXAMPLE_CSV:
        openUploadModal();
        break;
      default:
        break;
    }
  };

  const renderContextMenu = () => {
    const dataModelPublishState = selectedDM?.currentState?.publishState;
    const notAllowedActionsByWpStatus = {
      ReadyForReview: [ContextMenuOptions.SUBMIT_REVIEW, ContextMenuOptions.DELETE],
      Published: [ContextMenuOptions.SUBMIT_REVIEW, ContextMenuOptions.DELETE],
      Rejected: [ContextMenuOptions.SUBMIT_REVIEW, ContextMenuOptions.DELETE],
      Deactivated: [ContextMenuOptions.SUBMIT_REVIEW, ContextMenuOptions.DELETE],
      Draft: [],
    };

    const filteredOptions = [];

    options.forEach(opt => {
      if (checkPermissions(permissions, opt.permission.permission, opt.permission.action)) {
        if (opt.id === ContextMenuOptions.UPLOAD_EXAMPLE_CSV && selectedDM?.sampleDataSetNodeId) {
          const modifiedText = opt.text.replace(TEXT_EXAMPLE_OPTION.UPLOAD, TEXT_EXAMPLE_OPTION.REPLACE);
          filteredOptions.push({ ...opt, text: modifiedText });
        } else if (notAllowedActionsByWpStatus[dataModelPublishState]?.indexOf(opt.id) === -1) {
          filteredOptions.push(opt);
        }
      }
    });

    return (
      <ContextMenu
        options={filteredOptions}
        onOptionClicked={handleOptionClick}
        dataInstance={`${PAGE_NAME}-ContextMenu`}
        cursor='pointer'
      />
    );
  };

  const hideReviewComments = () => {
    setShowReviewComments(false);
  };

  useEffect(() => {
    const editTabs = getEditorTabs(t);
    setEditorTabs(editTabs);
    setActiveEditorTab(editTabs[0].id);
  }, [dispatch]);

  useEffect(() => {
    setDataModelsList(
      (datamodels || [])
        .filter(
          x =>
            (x.nameTech || '')
              .trim()
              .toLowerCase()
              .indexOf((searchText || '').trim().toLowerCase()) > -1
        )
        .sort((dm1, dm2) => Date.parse(dm2.lastUpdated) - Date.parse(dm1.lastUpdated))
    );
  }, [datamodels, searchText, cdmsMap]);

  useEffect(() => {
    if (tags?.items) {
      setTagsList(flatMap(tags.items || [], x => x.tags));
    }
  }, [tags]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.root.dataset.placeholder = defaultPlaceholders(activeEditorTab, t);
    }
  }, [activeEditorTab]);

  useEffect(() => {
    setGuidanceLoader(isGuidanceLoader);
  }, [isGuidanceLoader]);

  const handleEditorTabClick = clickedTab => {
    if (editorRef.current) {
      let editedValue = '';
      if (editorRef.current.editor.getText().trim()) {
        editedValue = editorRef.current.state.value;
      }
      setCurrentEditorValue({ ...currentEditorValue, [activeEditorTab]: editedValue });
    }

    setActiveEditorTab(clickedTab);
  };

  const saveAddGuidance = () => {
    const tempCurrentEditorValue = { ...currentEditorValue, [activeEditorTab]: editorRef.current.state.value };
    const data = {
      id: selectedDM.id,
      body: {
        generalData: tempCurrentEditorValue.general_instruction,
        datasetDescription: tempCurrentEditorValue.dataset_description,
        columnDescription: tempCurrentEditorValue.column_description,
      },
    };

    dispatch(postAddGuidance(data)).then(() => {
      closeAddGuidanceModal();
    });
  };

  const getPopoverOriginY = () => {
    if (datamodelsList?.length > 10 && selectedDM) {
      const index = datamodelsList.indexOf(selectedDM);
      const pivotIndex = datamodelsList.length - 5;
      if (index >= pivotIndex) {
        return PopoverOrigin.END;
      }
    }

    return PopoverOrigin.START;
  };

  return (
    <Box pt={12}>
      <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray'>
        {t('Pages_Content_Library_DataModelsListing_Label')}
      </Text>
      <Box dataInstance={`${PAGE_NAME}-DataModelsListing-Table-Container`} backgroundColor='white' mt={8}>
        <Spinner
          spinning={isDataModelsFetching || isDMStatusUpdating || isDMDeleting}
          dataInstance={`${PAGE_NAME}-DataModelsListing-Table_Spinner`}
        >
          {datamodelsList?.length > 0 && (
            <Table headers={headers} rows={datamodelsList} dataInstance={`${PAGE_NAME}-DataModelsListing-Table`} />
          )}
          {datamodelsList?.length <= 0 && (
            <StateView title={emptyStateText} dataInstance={`${PAGE_NAME}-DataModelsListing-NoRecords`} />
          )}
        </Spinner>
      </Box>
      <Popover
        isOpen={isMenuOpen}
        anchorRef={contextButtonRef}
        anchorOriginX={PopoverOrigin.START}
        anchorOriginY={PopoverOrigin.START}
        originX={PopoverOrigin.END}
        originY={getPopoverOriginY()}
        onClose={() => setIsMenuOpen(false)}
        width={200}
        mt={7}
        dataInstance={`${PAGE_NAME}-MenuOpover`}
        cursor='pointer'
      >
        {renderContextMenu()}
      </Popover>
      {renderWarningModal()}

      <SubmitForReviewModal
        showReviewComments={showReviewComments}
        hideReviewComments={hideReviewComments}
        submitForReview={submitForReview}
        dataInstance={`${PAGE_NAME}-SubmitForReview-Container`}
      />

      {isOpenGuidance && (
        <Modal
          dataInstance={`${PAGE_NAME}-ADDGUIDANCE-MODAL`}
          isOpen={isOpenGuidance}
          size={ModalSizes.MEDIUM}
          primaryButtonText={t(`Pages_Content_Library_DataModel_Add_Guidance_Modal_Primary_Button`)}
          onPrimaryButtonClick={() => {
            saveAddGuidance();
          }}
          secondaryButtonText={t(`Pages_Content_Library_DataModel_Add_Guidance_Modal_Secondary_Button`)}
          onSecondaryButtonClick={() => {
            closeAddGuidanceModal();
          }}
          onClose={() => {
            closeAddGuidanceModal();
          }}
        >
          <Spinner spinning={guidanceLoader} dataInstance={`${PAGE_NAME}-Add-Guidance_Spinner`}>
            <Box>
              <Text type={TextTypes.H2} fontWeight='m' dataInstance={`${PAGE_NAME}-Guidance-Modal-Heading`}>
                {t(`Pages_Content_Library_DataModel_Add_Guidance_Modal_Header`)}
              </Text>
              <Box mt={5}>
                <Tabs
                  activeTab={activeEditorTab}
                  tabs={editorTabs}
                  onTabClicked={handleEditorTabClick}
                  dataInstance={`${PAGE_NAME}-Editor-tabs`}
                />
                <StyledEditor>
                  <ReactQuill
                    dataInstance={`${PAGE_NAME}-Guidance-Editor`}
                    ref={editorRef}
                    theme='snow'
                    modules={QUILL_EDITOR_MODULES}
                    formats={QUILL_EDITOR_FORMATS}
                    placeholder={defaultPlaceholders(activeEditorTab, t)}
                    value={currentEditorValue[activeEditorTab]}
                  />
                </StyledEditor>
              </Box>
            </Box>
          </Spinner>
        </Modal>
      )}

      {isUploadModalOpen && (
        <UploadFile
          isUploadModalOpen
          setIsUploadModalOpen={setIsUploadModalOpen}
          currentDatamodel={selectedDM}
          dataInstance={`${PAGE_NAME}-Upload-File-Modal`}
        />
      )}
      {isHistoryOpen && (
        <DataModelsVersionHistoryModal
          datamodel={selectedDM}
          onClose={() => setIsHistoryOpen(false)}
          dataInstance={`${PAGE_NAME}-Version-History-Modal`}
        />
      )}
    </Box>
  );
};

export default DataModelsList;
