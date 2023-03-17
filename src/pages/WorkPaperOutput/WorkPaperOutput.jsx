/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import useNavContext from '../../hooks/useNavContext';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkpapersDetails, getWorkpaper } from '../../store/workpaperProcess/actions';
import WpOutputJobProfile from './components/WpOutputJobProfile';
import {
  getAndSyncFlowOutputs,
  getOutput,
  getWorkPaperOutputs,
  setOutputDataSetNames,
} from '../../store/workpaperProcess/step3/actions';
import env from 'env';
import {
  findCurrentOutputInfo,
  findIdNextOutput,
  findIdPreviousOutput,
  getJeStatusIcon,
  getJeStatusColor,
} from './utils/WorkPaperOutput.utils';
import useConfig from '../../components/WorkPaperProcess/hooks/useConfig';
import WpOutputNavigation from './components/WpOutputNavigation';
import { wpStep3Selectors } from '../../store/workpaperProcess/step3/selectors';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonTypes,
  Container,
  Flex,
  IconTypes,
  Spinner,
  Text,
  Link,
  LinkTypes,
  Tooltip,
  TooltipPosition,
  Icon,
  Tag,
  TagTypes,
} from 'cortex-look-book';
import WpOutputSaveToJE from './components/WpOutputSaveToJE';
import WpOutputTrasferToApp from './components/WpOutputTransferToApp';
import WpOutputDelete from './components/WpOutputDelete';
import WpOutputAddLabel from './components/WpOutputAddLabel';
import { pluralize } from '../../utils/translation';
import { jeStatus, PAGE_NAME } from './constants/WorkPaperOutput.constants';
import { WORKPAPER_TYPES } from '../../utils/WorkpaperTypes.const';
import WpOutputSaveTo from './components/WpOutputSaveTo';
import WpOutputDownload from './components/WpOutputDownload';
import WpOutputSendToOmnia from './components/WpOutputSendToOmnia';
import WpOutputTableauTailoring from './components/WpOutputTableauTailoring';
import { OUTPUT_STATUS } from '../../components/WorkPaperProcess/components/WorkpaperOutputs/output.consts';
import useTranslation from '../../hooks/useTranslation';
import useWarningModal from '../../hooks/useWarningModal';
import { engagementSelectors } from '../../store/engagement/selectors';
import WpOutputTable from './components/WpOutputTable';
import { notebookWPStep3Selector } from '../../store/notebookWorkpaperProcess/step3/selectors';
import { getNotebookWPOutputs, getOutputPreview } from '../../store/notebookWorkpaperProcess/step3/actions';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WorkPaperOutput = props => {
  const { match, mainWorkpaperId, workpaperId, outputId, canvasType } = props;
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const [outputInfoLabel, setOutputInfoLabel] = useState({});
  const [currentOutput, setCurrentOutput] = useState();
  const dispatch = useDispatch();
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const wpData = useSelector(wpProcessSelectors.selectWorkPaper);
  const readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const dmt = useSelector(wpProcessSelectors.selectDMT(workpaperId));
  const engagement = useSelector(engagementSelectors.selectEngagement);

  const isOutputDownloading = useSelector(
    wpData?.workpaperSource !== WORKPAPER_TYPES.NOTEBOOK
      ? wpStep3Selectors.isOutputDownloading
      : wpProcessSelectors.isOutputDownloading
  );

  const isLoadingCSV = useSelector(wpStep3Selectors.selectIsSavingCSV);
  const isSavingToJe = useSelector(wpStep3Selectors.selectIsSavingToJE);

  let selector = wpStep3Selectors;
  if (wpData?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
    selector = notebookWPStep3Selector;
  }

  const isLoading = useSelector(selector.selectIsWorkpaperOutputLoading);
  const output = useSelector(selector.selectOutput);
  const outputs = useSelector(selector.selectOutputs(workpaperId));
  const { config } = useConfig(canvasType);

  useEffect(() => {
    if (mainWorkpaperId) {
      dispatch(getWorkpaper(mainWorkpaperId));
      dispatch(getWorkPaperOutputs(workpaperId));
    }
  }, []);

  useEffect(() => {
    setOutputInfoLabel({
      rows: `${(output?.rowCount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${pluralize(
        t('Pages_WorkpaperProcess_Step3_RowLabel'),
        output?.rowCount
      )}`,
      columns: `${
        output?.schema?.filter(header => {
          return header.name !== 'ordering_col_for_spark_internal' && header.name !== 'index_col_for_spark_internal';
        })?.length || 0
      } ${pluralize(t('Pages_WorkpaperProcess_Step3_ColumnLabel'), output?.schema.length - 1)}`,
    });
  }, [output?.rowCount, output?.schema]);

  useEffect(() => {
    if (outputs) {
      setCurrentOutput([...outputs?.dataTable, ...outputs?.dqc].find(item => item.id === outputId));
    }
  }, [outputs, setCurrentOutput]);

  let outputsList = [];
  let outputInfo = null;
  let previousOutputId = null;
  // eslint-disable-next-line no-unused-vars
  let nextOutputId = null;
  let outputIdList = [];

  if (outputs?.dqc) {
    outputsList = [...outputsList, ...outputs?.dqc];
  }

  if (outputs?.dataTable) {
    outputsList = [...outputsList, ...outputs?.dataTable];
  }

  if (outputsList.length) {
    const filteredOutputList = outputsList.filter(outputList => outputList.status !== OUTPUT_STATUS.ERROR);
    outputIdList = filteredOutputList.map(element => element.id);

    outputInfo = findCurrentOutputInfo(filteredOutputList, outputId);

    previousOutputId = findIdPreviousOutput(outputIdList, outputId);
    nextOutputId = findIdNextOutput(outputIdList, outputId);
  }

  const onEditAdvanced = () => {
    window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/data`;
  };

  useEffect(() => {
    dispatch(getWorkpapersDetails(mainWorkpaperId || workpaperId));
    if (wpData?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
      dispatch(getOutputPreview(outputId));
    } else {
      dispatch(getOutput(workpaperId, outputId, canvasType, wpData?.workpaperSource));
    }

    if (wpData.workpaperSource) {
      switch (wpData.workpaperSource) {
        case WORKPAPER_TYPES.CORTEX:
          dispatch(getWorkPaperOutputs(workpaperId));
          break;
        case WORKPAPER_TYPES.NOTEBOOK:
          dispatch(getNotebookWPOutputs(workpaperId));
          break;
        case WORKPAPER_TYPES.TRIFACTA:
        default:
          dispatch(getAndSyncFlowOutputs(dmt?.id || wpData?.id));
      }
    }
  }, [dispatch, workpaperId, outputId]);

  useEffect(() => {
    if (outputInfo?.name) {
      document.title = `${outputInfo?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [outputInfo]);

  const onCloseClick = () => {
    const obj = {};
    obj[outputInfo.id] = null;
    dispatch(setOutputDataSetNames(obj, workpaperId));
  };

  const showDownloadRestrictWarning = () => {
    showWarningModal(t('Pages_Workpaper_Restrict_Download_Error'), null, true);
  };

  const onButtonClick = prevNextOutputId => {
    if (prevNextOutputId) {
      if (wpData?.engagementId) {
        if (mainWorkpaperId) {
          return `/workpapers/${mainWorkpaperId}/${workpaperId}/datamodelOutputs/${prevNextOutputId}`;
        }

        return `/workpapers/${workpaperId}/outputs/${prevNextOutputId}/`;
      }

      if (wpData?.bundleTransformation) {
        return `/library/bundleTransformations/${workpaperId}/outputs/${prevNextOutputId}/`;
      }

      return `/library/${
        wpData?.isDMT ? 'datamodelTransformations' : 'workpapers'
      }/${workpaperId}/outputs/${prevNextOutputId}/`;
    }

    return `#`;
  };

  return (
    <>
      <Spinner
        spinning={isLoading}
        overlayOpacity={0}
        minHeight={wpData?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK ? '100px' : 'calc(100vh - 120px)'}
        size={32}
        pathSize={4}
        label=''
        optionalRender
      >
        <Spinner
          spinning={isLoadingCSV || isOutputDownloading || isSavingToJe}
          size={32}
          overlayOpacity={0.9}
          label={
            isLoadingCSV || isOutputDownloading
              ? t('Pages_WorkpaperProcess_Output_SaveAsCSVProcessing')
              : t('Pages_WorkpaperProcess_Output_SaveToJEProcessing')
          }
        >
          <Container backgroundColor='white' pb={4} pt={11}>
            <Flex justifyContent='space-between' alignItems='center' fontSize='s' mb={9}>
              <Breadcrumbs crumbs={crumbs} fontWeight='m' fontSize='s' />
            </Flex>

            {outputInfo && (
              <Box>
                {config?.outputPage?.jobProfileIframe && currentOutput?.jobId && (
                  <WpOutputJobProfile
                    IframeTitle={t('Pages_Trifacta_Iframe_Title')}
                    workpaperId={workpaperId}
                    jobId={currentOutput?.jobId}
                    outputName={outputInfo?.name}
                  />
                )}

                <WpOutputNavigation
                  outputName={outputInfo?.name}
                  outputs={outputsList}
                  workpaperId={workpaperId}
                  canvasType={canvasType}
                  mainWorkpaperId={mainWorkpaperId}
                />
                <Flex alignItems='center' justifyContent='space-between' mt={8} fontSize='s'>
                  <Flex alignItems='center'>
                    {config?.outputPage?.download && (
                      <WpOutputDownload
                        workpaperType={wpData.workpaperSource}
                        workpaper={wpData}
                        workpaperId={workpaperId}
                        // eslint-disable-next-line camelcase
                        tableId={output?.table_id}
                        transformationId={output?.transformationId}
                        filename={currentOutput?.sourceName || currentOutput?.name}
                        nodePath={currentOutput?.nodePath}
                        nodeId={currentOutput?.nodeId}
                        canvasType={canvasType}
                        outputId={outputId}
                        showDownloadRestrictWarning={showDownloadRestrictWarning}
                      />
                    )}
                    {config?.outputPage?.saveTo && <WpOutputSaveTo />}
                    {config?.outputPage?.delete && <WpOutputDelete />}
                    {config?.outputPage?.tableauTailoring && <WpOutputTableauTailoring />}
                    {config?.outputPage?.transferToApp && <WpOutputTrasferToApp />}
                    {config?.outputPage?.addLabel && <WpOutputAddLabel />}
                    {config?.outputPage?.sendToOmnia && (
                      <WpOutputSendToOmnia
                        isConnectedToOmnia={
                          engagement?.linkedOmniaEngagements && engagement?.linkedOmniaEngagements.length
                        }
                        output={outputInfo}
                        displaySendToOmniaAction
                        workpaperId={workpaperId}
                      />
                    )}

                    {config?.outputPage?.saveJE && wpData?.isJEWorkpaper && !mainWorkpaperId && (
                      <WpOutputSaveToJE
                        outputName={outputInfo?.name}
                        workpaperId={workpaperId}
                        transformationId={output?.transformationId}
                        outputId={outputInfo?.id}
                        pagename={PAGE_NAME}
                        nodeId={outputInfo?.nodeId}
                        nodePath={outputInfo?.nodePath}
                        // eslint-disable-next-line camelcase
                        eftINTEngagementLink={engagement?.efT_INT_EngagementLink}
                        engagementId={wpData.engagementId}
                      />
                    )}

                    {outputInfo?.jeStatus && (
                      <Box ml={4}>
                        <Tooltip
                          display='inline-block'
                          direction={TooltipPosition.INFO}
                          tooltipContent={`${outputInfo?.jeStatus?.type}: ${
                            outputInfo?.jeStatus?.status === jeStatus.FAILED &&
                            outputInfo?.jeStatus?.errorMessage != null
                              ? outputInfo?.jeStatus?.errorMessage
                              : outputInfo?.jeStatus?.status
                          }`}
                          showOnHover
                        >
                          <Icon
                            type={getJeStatusIcon(outputInfo?.jeStatus?.status)}
                            height={20}
                            width={20}
                            color={getJeStatusColor(outputInfo?.jeStatus?.status)}
                          />
                        </Tooltip>
                      </Box>
                    )}
                  </Flex>
                  <Flex alignItems='center'>
                    {config?.outputPage?.outputRow && (
                      <Flex mr={5} pb={1}>
                        <Text>{outputInfoLabel.rows}&nbsp;</Text>
                        <Text>| {outputInfoLabel.columns}</Text>
                      </Flex>
                    )}
                    {outputInfo && config?.outputPage?.editAdvanced && (
                      <Button
                        type={ButtonTypes.LINK}
                        icon={IconTypes.EXTERNAL_TAB}
                        iconWidth={20}
                        onClick={onEditAdvanced}
                        dataInstance={`${PAGE_NAME}-EditAdvanced`}
                      >
                        {t('Pages_WorkpaperProcess_Output_AdvancedView')}
                      </Button>
                    )}
                  </Flex>
                  <Flex alignItems='right' justifyContent='flex-end'>
                    {outputInfo.dataSetName && (
                      <Tag
                        dataInstance={`${PAGE_NAME}-DisplayLabel`}
                        isClosable={!readOnlyfromWP}
                        type={TagTypes.INFO}
                        onClose={onCloseClick}
                      >
                        {outputInfo.dataSetName}
                      </Tag>
                    )}
                  </Flex>
                </Flex>
              </Box>
            )}
          </Container>
        </Spinner>
      </Spinner>
      <WpOutputTable output={output} wpData={wpData} canvasType={canvasType} workpaperId={workpaperId} />
      {outputInfo && (
        <Flex
          justifyContent='space-between'
          flexDirection='row-reverse'
          alignItems='center'
          pt={6}
          pl={12}
          pr={12}
          mb={9}
        >
          <Flex justifyContent='flex-end' alignItems='center'>
            <Link type={LinkTypes.FLAT} to={onButtonClick(previousOutputId)} dataInstance={`${PAGE_NAME}-Previous`}>
              <Button type={ButtonTypes.SECONDARY} ml={20}>
                {t('Pages_WorkpaperProcess_Output_GoToPreviousOutput')}
              </Button>
            </Link>
            <Link type={LinkTypes.FLAT} to={onButtonClick(nextOutputId)} dataInstance={`${PAGE_NAME}-Next`}>
              <Button type={ButtonTypes.PRIMARY} ml={20}>
                {t('Pages_WorkpaperProcess_Output_GoToNextOutput')}
              </Button>
            </Link>
          </Flex>
        </Flex>
      )}
      {renderWarningModal()}
    </>
  );
};

export default React.memo(WorkPaperOutput);
