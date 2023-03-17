import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalSizes,
  Intent,
  StatusAlert,
  Box,
  Flex,
  Input,
  Text,
  RadioGroup,
  TextTypes,
  Spinner,
  useInterval,
  Icon,
  IconTypes,
  Tree,
  Search,
  FilePreview,
  FilePreviewTypes,
} from 'cortex-look-book';
import styled from 'styled-components';

import { PreviewSettings } from 'src/components/InputUploaderModal/components/UploadedFilePreview/PreviewSettings';
import { ModalOptions, COMPONENT_NAME, OUTPUT_JE_TYPES, PREVIEW_INDICATOR_TYPE } from './output.consts';
import { useSelector, useDispatch } from 'react-redux';
import { getOutputSaveToJeMenuOptions } from './output.utils';
import {
  saveTrifactaOutputToJE,
  downloadOutputAsCSV,
  saveToDL,
  validateFileExtension,
  addDMToOutput,
  getConnectedDMInfo,
  clearConnectedDMInfo,
} from '../../../../store/workpaperProcess/step3/actions';
import { getDatamodelList, getDatamodelFields } from '../../../../store/dialogs/attachFiles/actions';
import { wpStep3Selectors } from '../../../../store/workpaperProcess/step3/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { attachDialogSelectors } from '../../../../store/dialogs/attachFiles/selectors';
import useTranslation from 'src/hooks/useTranslation';
import useWarningModal from 'src/hooks/useWarningModal';
import { useFileSystem } from 'src/hooks/useFileSystem';
import { checkFileSharingRequestStatusById } from '../../../../store/dataExchange/actions';
import { dataExchangeSelectors } from '../../../../store/dataExchange/selectors';
import { sendWPOutputStatusTypes } from '../../../../pages/WorkPaperOutput/constants/WorkPaperOutput.constants';
import { WORKPAPER_CANVAS_TYPES, WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';

const REFRESH_INTERVAL = 5 * 1000;

const TreeMenu = styled(Flex)`
  min-height: 300px;
  height: 65vh;
  overflow: auto;
  margin-top: 1vh !important;
`;

const Preview = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  margin-top: 1vh !important;
`;

const OutputOptionsModal = ({
  options,
  isModalOpen,
  setIsModalOpen,
  setIsMappingScreenOpen,
  setIsTableauTailoringOpen,
  setIsSendToOmniaModal,
  output,
  workpaperId,
  rename,
  resetOmniaDescription,
  isConnectedToOmnia,
  eftINTEngagementLink,
  canvasType,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { downloadWorkpaperOutputs } = useFileSystem('', REFRESH_INTERVAL);

  const [warningContext, setWarningContext] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [outputJeType, setOutputJeType] = useState(OUTPUT_JE_TYPES.JE);
  const [outputRename, setOutputRename] = useState('');
  const [headerMessage, setHeaderMessage] = useState({});
  const [stopPolling, setStopPolling] = useState(true);
  const [connectToDmActive, setConnectToDm] = useState(false);
  const [datamodelTree, setDatamodelTree] = useState({});
  const [path, setPath] = useState('');
  const [previewName, setPreviewName] = useState('');
  const [jsonPreview, setJsonPreview] = useState(null);
  const [fetchDM, setFetchDM] = useState(false);
  const [isModalOpenmodal, setIsModalOpenmodal] = useState(false);

  const dispatch = useDispatch();

  const datamodelTreeData = useSelector(attachDialogSelectors.datamodelTreeData);
  const treeIsLoading = useSelector(attachDialogSelectors.isLoading);
  const preview = useSelector(attachDialogSelectors.preview);
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const sendWPOutputStatus = useSelector(dataExchangeSelectors.sendWPOutputStatus);
  const isFetchingWPOutputStatus = useSelector(dataExchangeSelectors.isFetchingWPOutputStatus);
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);

  const isOutputDownloading = useSelector(
    workpaper?.workpaperSource !== WORKPAPER_TYPES.NOTEBOOK
      ? wpStep3Selectors.isOutputDownloading
      : wpProcessSelectors.isOutputDownloading
  );

  const isSavingToJe = useSelector(wpStep3Selectors.selectIsSavingToJE);
  const isSavingToDL = useSelector(wpStep3Selectors.selectIsSavingToDL);
  const addDMToOutputLoader = useSelector(wpStep3Selectors.addDMToOutputLoader);

  const validatingDMState = useSelector(wpStep3Selectors.validatingDMState);
  const validatingDMInfo = useSelector(wpStep3Selectors.validatingDMInfo);

  const { t } = useTranslation();
  const omniaOption = options.find(option => option.value === ModalOptions.SEND_TO_OMNIA);

  const updateStatus = value => {
    const finalOptions = options.map(option => {
      if (option.value === ModalOptions.SEND_TO_OMNIA) {
        return { ...option, ...value };
      }

      return option;
    });
    resetOmniaDescription(finalOptions);
  };

  const getOutputConnectedDMInfo = () => {
    dispatch(getConnectedDMInfo(output.datamodelId));
  };

  if (!isConnectedToOmnia && omniaOption && !omniaOption.isDisabled) {
    updateStatus({ isDisabled: true });
  }

  useEffect(() => {
    setOutputRename(output?.name || '');
    setSelectedOption(options?.[0]?.value);
    if (output?.omniaEngagementFileId) {
      dispatch(checkFileSharingRequestStatusById(output?.omniaEngagementFileId));
    }
  }, [output, isModalOpen]);

  useInterval(
    () => {
      if (!isFetchingWPOutputStatus && output?.omniaEngagementFileId) {
        dispatch(checkFileSharingRequestStatusById(output?.omniaEngagementFileId));
      }
    },
    !stopPolling ? REFRESH_INTERVAL : null
  );

  useEffect(() => {
    if (sendWPOutputStatus?.outputId === output.id) {
      switch (sendWPOutputStatus?.status) {
        case sendWPOutputStatusTypes.IN_PROGRESS:
          setStopPolling(false);

          updateStatus({ desc: t('Pages_WorkpaperProcess_Output_SendToOmnia_InProgress'), isDisabled: true });
          break;
        case sendWPOutputStatusTypes.FAILED:
          setStopPolling(true);

          updateStatus({ desc: t('Pages_WorkpaperProcess_Output_SendToOmniaFail'), isDisabled: false });
          break;
        case sendWPOutputStatusTypes.SUCCESS:
          setStopPolling(true);

          updateStatus({ desc: t('Pages_WorkpaperProcess_Output_SendToOmniaSucess'), isDisabled: false });
          break;
        default:
          break;
      }
    }
  }, [sendWPOutputStatus]);

  useEffect(() => {
    if (connectToDmActive && !fetchDM) {
      dispatch(getDatamodelList()).then(() => {
        setFetchDM(true);
      });
    }
  }, [connectToDmActive]);

  useEffect(() => {
    setDatamodelTree(datamodelTreeData);
    if (Object.keys(datamodelTreeData)?.length > 0 && !validatingDMInfo && output?.datamodelId) {
      getOutputConnectedDMInfo();
    }
  }, [datamodelTreeData]);

  useEffect(() => {
    if (path !== '') {
      dispatch(getDatamodelFields(path));
    }
  }, [path]);

  useEffect(() => {
    if (path && Object.values(preview.data).length > 0) {
      setJsonPreview(preview.data);
    }
  }, [preview]);

  useEffect(() => {
    if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK && selectedOption === ModalOptions.DOWNLOAD_AS_CSV) {
      setIsModalOpen(isOutputDownloading);
    }
  }, [isOutputDownloading]);

  const onPreviewClickHandler = (previewPath, fileName) => {
    setPreviewName(fileName);
    setPath(previewPath);
  };

  const closeModal = () => {
    dispatch(clearConnectedDMInfo());
    setIsModalOpen(false);
    setConnectToDm(false);
    setPath('');
    setPreviewName('');
    setJsonPreview(null);
  };

  const handleSaveToJe = () => {
    dispatch(
      saveTrifactaOutputToJE(
        workpaperId,
        output?.nodePath,
        output?.nodeId,
        outputJeType,
        output?.id,
        output?.engagementId
      )
    ).then(response => {
      if (response) {
        showWarningModal(t('Components_SaveToJE_Warning_Message'), null, true);
      } else {
        setIsModalOpen(false);
      }
    });
    setIsModalOpenmodal(false);
  };

  const handleDownloadAsCsv = () => {
    if (workpaper.engagementId && workpaper.isRestrictFileDownload) {
      showWarningModal(t('Pages_Workpaper_Restrict_Download_Error'), null, true);
    } else if (workpaper.notebook) {
      downloadWorkpaperOutputs(workpaperId, output?.id, output?.name);
    } else {
      dispatch(downloadOutputAsCSV(output?.name, output?.id)).then(() => {
        setIsModalOpen(false);
      });
    }
  };

  const handleSaveToDL = () => {
    dispatch(saveToDL(output?.nodePath, output?.nodeId, output?.id, workpaperId)).then(result => {
      if (!result) {
        setHeaderMessage({
          type: Intent.ERROR,
          showIcon: true,
          body: (
            <Text type={TextTypes.BODY} fontWeight='m' color='black'>
              {t('Components_OutputMappingScreen_OutputFileDLSaveError')}
            </Text>
          ),
        });
      } else {
        setHeaderMessage({
          type: Intent.SUCCESS,
          showIcon: true,
          body: (
            <Text type={TextTypes.BODY} fontWeight='m' color='black'>
              {`${t('Components_OutputMappingScreen_OutputFileDLSaveSuccess')}`}
            </Text>
          ),
        });
      }
    });
  };

  const handleSaveToSql = () => {
    setIsModalOpen(false);
    setIsMappingScreenOpen(true);
  };

  const handleOutputTableau = () => {
    setIsModalOpen(false);
    setIsTableauTailoringOpen(true);
  };

  const handleOutputSendToOmnia = () => {
    setIsModalOpen(false);
    setIsSendToOmniaModal(true);
  };

  const handleConnectToDM = () => {
    setConnectToDm(!connectToDmActive);
  };

  const handleEditConnectToDM = () => {
    setWarningContext(!warningContext);
  };

  const handleTertiaryButtonClick = () => {
    if (connectToDmActive) {
      handleConnectToDM();
    } else if (warningContext) {
      handleEditConnectToDM();
    }
  };

  const getTertiaryButtonHandler = () => {
    return connectToDmActive || warningContext ? handleTertiaryButtonClick : null;
  };

  const getTertiaryButtonText = () => {
    if (renderWarningModal) {
      return (
        <Flex alignItems='center'>
          <Icon type={IconTypes.CHEVRON_LEFT} size={18} mr={2} /> {t('Components_OutputOptionsModal_Tertiary')}
        </Flex>
      );
    }

    return '';
  };

  const handlePrimaryButtonClick = () => {
    if (connectToDmActive) {
      const isBundle = canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS;
      dispatch(addDMToOutput(workpaperId, path, output?.datamodelId, output?.id, isBundle)).then(() => {
        closeModal();
      });
    } else if (warningContext) {
      handleEditConnectToDM();
      setConnectToDm(true);
    } else {
      dispatch(validateFileExtension(output?.nodePath)).then(res => {
        if (res) {
          switch (selectedOption) {
            case ModalOptions.SAVE_TO_JE:
              if (eftINTEngagementLink == null) {
                setIsModalOpenmodal(true);
              } else {
                handleSaveToJe();
              }
              break;
            case ModalOptions.DOWNLOAD_AS_CSV:
              handleDownloadAsCsv();
              break;
            case ModalOptions.SAVE_TO_SQL:
              handleSaveToSql();
              break;
            case ModalOptions.SAVE_TO_DL:
              handleSaveToDL();
              break;
            case ModalOptions.TABLEAU_TAILORING:
              handleOutputTableau();
              break;
            case ModalOptions.CONNECT_TO_DM:
              handleConnectToDM();
              break;
            case ModalOptions.EDIT_CONNECT_TO_DM:
              handleEditConnectToDM();
              break;
            case ModalOptions.SEND_TO_OMNIA:
              handleOutputSendToOmnia();
              break;
            default:
              break;
          }
        } else {
          setIsModalOpen(false);
        }
      });
    }
  };

  const getSpinnerLabel = () => {
    switch (selectedOption) {
      case ModalOptions.SAVE_TO_JE:
        return t('Components_OutputOptionsModal_JELoading');
      case ModalOptions.DOWNLOAD_AS_CSV:
        return t('Pages_WorkpaperProcess_Output_SaveAsCSVProcessing');
      case ModalOptions.SAVE_TO_DL:
        return t('Components_OutputOptionsModal_OutputSavingToDL');
      default:
        return '';
    }
  };

  const getIsSpinning = () => {
    return isSavingToJe || isOutputDownloading || isSavingToDL;
  };

  const getPrimaryButtonDisable = () => {
    if (connectToDmActive) {
      return !jsonPreview;
    }

    return isSavingToDL || !!headerMessage?.type;
  };
  const handleOnchangeSearch = textSearch => {
    const searchText = textSearch;
    if (searchText) {
      const filteredDM = {};
      const searchRegExp = searchText.toLowerCase();

      [...Object.values(datamodelTreeData)].forEach(eachValue => {
        if (eachValue.name?.toLowerCase()?.includes(searchRegExp)) {
          filteredDM[`${eachValue.id}`] = { ...eachValue };
        }
      });
      setDatamodelTree(filteredDM);
    } else {
      setDatamodelTree(datamodelTreeData);
    }
  };

  const getContextMenu = () => {
    if (Object.keys(headerMessage).length !== 0) {
      return (
        <Box my={8}>
          <Flex>
            <StatusAlert type={headerMessage.type} showIcon={headerMessage.showIcon}>
              {headerMessage.body}
            </StatusAlert>
          </Flex>
        </Box>
      );
    }

    return (
      <Box width='100%' dataInstance={`${COMPONENT_NAME}-Context-Menu-Wrapper`}>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' color='black'>
            {t('Components_OutputOptionsModal_Title')}
          </Text>
          <Text type={TextTypes.H2} fontWeight='s' pl={2} color='gray'>
            {t('Components_OutputOptionsModal_Subtitle')}
          </Text>
        </Flex>

        {selectedOption !== ModalOptions.DOWNLOAD_AS_CSV && rename && (
          <Box my={10}>
            <Flex>
              <Input
                label={t('Components_OutputOptionsModal_InputLabel')}
                value={outputRename}
                onChange={event => {
                  setOutputRename(event.target.value);
                }}
              />
            </Flex>
          </Box>
        )}
        <Box mt={8}>
          <Flex>
            <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
              {t('Components_OutputOptionsModal_Description')}
            </Text>
          </Flex>
        </Box>
        <Box my={8}>
          <RadioGroup
            dataInstance={`${COMPONENT_NAME}-Context-Menu-Radio-Buttons`}
            selectedValue={selectedOption}
            onOptionChange={optionId => {
              setSelectedOption(optionId);
            }}
            fontWeight='s'
            name='output_options'
            options={options}
            py={8}
            borderColor='lightGray'
            borderTop={1}
            borderBottom={1}
          />
          {selectedOption === ModalOptions.SAVE_TO_JE && (
            <RadioGroup
              fontWeight='s'
              name='je-type'
              options={getOutputSaveToJeMenuOptions(t)}
              selectedValue={outputJeType}
              onOptionChange={value => setOutputJeType(value)}
              py={8}
              px={8}
              dataInstance={`${COMPONENT_NAME}-Save-To-Je-Radio-Buttons`}
            />
          )}
        </Box>
      </Box>
    );
  };
  const getPreviewSetting = () => {
    const fileName = validatingDMInfo?.nameTech || '';
    const note = validatingDMInfo?.isLatest ? '' : t('Pages_DM_Connection_Status_For_DMTs');

    return (
      <PreviewSettings
        dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Current-connected-Datamodel`}
        showDelimeter={false}
        fileName={fileName}
        warningNote={note}
        isNameCanClose={false}
        onDeleteFile={() => {
          setJsonPreview(null);
        }}
        hideSheetSelect
        isExistingFile
        indicatorType={PREVIEW_INDICATOR_TYPE.CONNECTED_DATAMODEL}
      />
    );
  };
  const getConnectDMContent = () => {
    return (
      <Box width='100%' dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Wrapper`}>
        <Flex dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Wrapper-Header`} flexDirection='column'>
          <Text type={TextTypes.H2} fontWeight='s' color='black' mb={3}>
            {t('Pages_EngagementWorkpapers_AttachSourceModal_Output_Title_datamodel')}
          </Text>
          <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
            {t('Pages_EngagementWorkpapers_AttachSourceModal_Output_Note_datamodel')}
          </Text>
        </Flex>
        <Spinner
          spinning={treeIsLoading || addDMToOutputLoader || validatingDMState}
          label={
            addDMToOutputLoader || validatingDMState
              ? t(`Components_OutputOptionsModal_ConnectDM_AddingDM`)
              : t(`Components_OutputOptionsModal_ConnectDM_Feteching_${path ? 'preview' : 'datamodel'}`)
          }
        >
          <Flex dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Wrapper-Body`} flexDirection='row' margin='2vh 0'>
            <Flex
              dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane`}
              minWidth='30%'
              maxWidth='30%'
              flexDirection='column'
              marginRight='1vw'
            >
              {output?.datamodelId && getPreviewSetting()}
              <Search
                data-instance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree-Search`}
                maxWidth='100%'
                data={[]}
                onChange={handleOnchangeSearch}
                placeholder={t('Components_WORKPAPERPROCESS_DATAMODEL_SEARCH_PLACEHOLDER')}
                manualFiltering
                marginTop='1vh'
              />
              <TreeMenu flexGrow={1} dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree-wrapper`}>
                <Tree
                  nodes={datamodelTree}
                  onPreviewClick={onPreviewClickHandler}
                  data-instance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree`}
                />
              </TreeMenu>
            </Flex>
            <Flex dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Right-Pane`} flexDirection='column'>
              <PreviewSettings
                dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Current-selected-File`}
                showDelimeter={false}
                fileName={previewName}
                isNameCanClose={false}
                onDeleteFile={() => {
                  setJsonPreview(null);
                }}
                hideSheetSelect
                isExistingFile
                indicatorType={PREVIEW_INDICATOR_TYPE.DATAMODEL}
              />
              <Preview dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Right-Pane-Preview`}>
                <FilePreview type={FilePreviewTypes.DEFAULT} json={jsonPreview} setHeaders={null} />
              </Preview>
            </Flex>
          </Flex>
        </Spinner>
      </Box>
    );
  };

  const getWarningModalContent = () => {
    return (
      <Text
        type={TextTypes.BODY}
        my={6}
        sx={{ wordWrap: 'break-word' }}
        color='black'
        dataInstance={`${COMPONENT_NAME}-Warning-Modal-Wrapper`}
      >
        {canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS
          ? t('Components_OutputOptionsModal_Edit_ConnectDM_Warning_Text_Bundle')
          : t('Components_OutputOptionsModal_Edit_ConnectDM_Warning_Text')}
      </Text>
    );
  };

  const getModalContent = () => {
    if (connectToDmActive) {
      return getConnectDMContent();
    } else if (warningContext) {
      return getWarningModalContent();
    }

    return getContextMenu();
  };

  const modalContent = () => (
    <Box>
      <Text type={TextTypes.H2} fontWeight='l' mb={9}>
        {t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Title')}
      </Text>
      <br />
      <Text>{t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Body')}</Text>
      <br />
      <Text>
        <b>{t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Note')} </b>
        {t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Body_Note')}
      </Text>
      <br />
      <br />
      <br />
    </Box>
  );

  return (
    <Box>
      {options.length > 0 && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          primaryButtonText={
            connectToDmActive
              ? t('Components_OutputOptionsModal_ConnectDM_Button_AddDataModel')
              : t('Components_OutputOptionsModal_Primary')
          }
          secondaryButtonText={t('Components_OutputOptionsModal_Secondary')}
          tertiaryButtonText={getTertiaryButtonText()}
          onPrimaryButtonClick={handlePrimaryButtonClick}
          onSecondaryButtonClick={closeModal}
          onTertiaryButtonClick={getTertiaryButtonHandler()}
          size={warningContext ? ModalSizes.SMALL : ModalSizes.LARGE}
          dataInstance={COMPONENT_NAME}
          disablePrimaryButton={getPrimaryButtonDisable()}
        >
          <Spinner spinning={getIsSpinning()} label={getSpinnerLabel()}>
            {getModalContent()}
          </Spinner>
        </Modal>
      )}
      {renderWarningModal()}

      <Modal
        isOpen={isModalOpenmodal}
        onClose={() => {
          setIsModalOpenmodal(false);
        }}
        primaryButtonText={t('Pages_TrifactaWorkpaperProcess_WpOutputSaveToJE_Modal_Ok')}
        onPrimaryButtonClick={() => {
          handleSaveToJe();
        }}
        size={ModalSizes.LARGE}
        dataInstance={COMPONENT_NAME}
      >
        {modalContent()}
      </Modal>
    </Box>
  );
};

export default OutputOptionsModal;
