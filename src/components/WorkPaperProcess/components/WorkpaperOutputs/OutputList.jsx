/* eslint-disable no-underscore-dangle */
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { flatMap } from 'lodash';
import OutputContextMenu from './OutputOptionsModal';
import OutputMappingScreen from './OutputMappingScreen';
import { getModalOptions } from './output.utils';
import { ModalOptions, COMPONENT_NAME, OUTPUT_TYPES, OUTPUT_STATUS, TRANSLATION_KEY_CANVAS } from './output.consts';
import {
  Box,
  Button,
  ButtonTypes,
  Text,
  TextTypes,
  GridView,
  GapSizes,
  Link,
  IconCard,
  IconTypes,
  Flex,
  Tooltip,
  TooltipPosition,
  Icon,
  ProgressBarTypes,
} from 'cortex-look-book';
import { useFileSystem } from 'src/hooks/useFileSystem';
import { jeStatus } from '../../../../pages/WorkPaperOutput/constants/WorkPaperOutput.constants';
import {
  getJeStatusIcon,
  getJeStatusColor,
  getLocalizedRowCount,
} from '../../../../pages/WorkPaperOutput/utils/WorkPaperOutput.utils';
import useWarningModal from '../../../../hooks/useWarningModal';
import { removeWorkbooks, downloadAllOutputs } from '../../../../store/workpaperProcess/step3/actions';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import useTranslation from '../../../../hooks/useTranslation';
import WpOutputSendToOmniaModal from '../../../../pages/WorkPaperOutput/components/WpOutputSendToOmniaModal';
import { wpStep3Selectors } from '../../../../store/workpaperProcess/step3/selectors';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { notebookWPStep3Selector } from '../../../../store/notebookWorkpaperProcess/step3/selectors';
import { notebookWPProcessSelectors } from '../../../../store/notebookWorkpaperProcess/selectors';
import { CONTENT_LIBRARY_WP } from '../../constants/WorkPaperProcess.const';
import { removeWorkbooks as removeNotebookWB } from '../../../../store/notebookWorkpaperProcess/step3/actions';

const RUNNING_REFRESH_INTERVAL = 3 * 1000;

const OutputList = ({
  title,
  itemDescription,
  data,
  workpaperId,
  mainWorkpaperId,
  cardsLoading,
  cardsState,
  config,
  type,
  children,
  canvasType,
  isCentralizedDSUpdated,
  isDMT,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { downloadWorkpaperOutputs } = useFileSystem(type, RUNNING_REFRESH_INTERVAL);

  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSendToOmniaModal, setIsSendToOmniaModal] = useState(false);
  const [isMappingScreenOpen, setIsMappingScreenOpen] = useState(false);
  const [isTableauTailoringOpen, setIsTableauTailoringOpen] = useState(false);
  const [list, setList] = useState();
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const { renderWarningModal, showWarningModal } = useWarningModal();

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  let readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);

  let selector = wpStep3Selectors;
  let processSelector = WPProcessingSelectors;
  if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
    selector = notebookWPStep3Selector;
    processSelector = notebookWPProcessSelectors;
  }

  const omniaOutput = useSelector(selector.selectOutput);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  readOnlyfromWP = !readOnlyfromWP ? useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted) : readOnlyfromWP;
  const workpaperProgress = useSelector(processSelector.workpaperProgress(workpaper.id));
  const executionStatus = useSelector(notebookWPProcessSelectors.executionStatus);

  const { t } = useTranslation();

  const closeMappingScreen = () => {
    setIsMappingScreenOpen(false);
    setIsTableauTailoringOpen(false);
  };

  const handleContexButtonClick = (event, outputId) => {
    setContextButtonRef({ current: event.target });
    setSelectedOutput(list.find(el => el.id === outputId));
    setIsMenuOpen(true);
  };

  useEffect(() => {
    const options = getModalOptions(t, type, readOnlyfromWP, isCentralizedDSUpdated);
    if (isDMT) {
      const filteredOptionsDMT = options.filter(opt => {
        const hasPermission = config?.step3?.contextMenu?.[opt.value];
        let extraPermissions = false;

        switch (opt.value) {
          case ModalOptions.DOWNLOAD_AS_CSV:
          case ModalOptions.SEND_TO_OMNIA:
            extraPermissions = true;
            break;
          case ModalOptions.SAVE_TO_DL:
            extraPermissions = !engagement?.encryption;
            break;

          default:
        }

        return hasPermission && extraPermissions;
      });
      setFilteredOptions(filteredOptionsDMT);
    } else {
      const filteredOptionsWorkpaper = options.filter(opt => {
        const hasPermission = config?.step3?.contextMenu?.[opt.value];
        let extraPermissions = true;

        switch (opt.value) {
          case ModalOptions.SAVE_TO_JE:
            extraPermissions = workpaper.isJEWorkpaper;
            break;
          case ModalOptions.SAVE_TO_DL:
            extraPermissions = !engagement?.encryption;
            break;
          case ModalOptions.DOWNLOAD_AS_CSV:
          case ModalOptions.CONNECT_TO_DM:
          case ModalOptions.DELETE:
          case ModalOptions.EDIT_CONNECT_TO_DM:
          case ModalOptions.RENAME:
          case ModalOptions.SAVE_TO_SQL:
          case ModalOptions.SEND_TO_OMNIA:
          case ModalOptions.TABLEAU_TAILORING:
          default:
        }

        return hasPermission && extraPermissions;
      });
      setFilteredOptions(filteredOptionsWorkpaper);
    }
  }, [t, selectedOutput]);

  useEffect(() => {
    switch (type) {
      case OUTPUT_TYPES.TABLEAU:
        const views = flatMap(data, x =>
          x.views.map(v => ({
            ...v,
            workbookId: x.workbookId,
            id: `${x.id}-${v.name}`,
            cloned: x.cloned,
            tableau: true,
          }))
        );
        setList(views);
        break;
      case OUTPUT_TYPES.DATA_TABLE:
      case OUTPUT_TYPES.DQC:
      default:
        setList(data);
    }
  }, [data]);

  const handleClose = () => setIsSendToOmniaModal(false);

  const getCardIconType = () => {
    switch (type) {
      case OUTPUT_TYPES.TABLEAU:
        return IconTypes.ADD_FILE;
      case OUTPUT_TYPES.DATA_TABLE:
      case OUTPUT_TYPES.DQC:
      default:
        return IconTypes.XLS;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderContextMenu = () => {
    if (filteredOptions.length > 0 && isMenuOpen) {
      const finalFilteredOptions = [];
      let contexMenuFilteredOptions = [...filteredOptions];

      if (selectedOutput?.datamodelId) {
        contexMenuFilteredOptions = [...contexMenuFilteredOptions].filter(
          eachElement => eachElement.value !== ModalOptions.CONNECT_TO_DM
        );
        if (!workpaper?.engagementId) {
          contexMenuFilteredOptions.push({
            value: ModalOptions.EDIT_CONNECT_TO_DM,
            text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_Edit_ConnectToDM`),
            desc: t('Components_OutputOptionsModal_Edit_ConnectToDMDesc'),
          });
        }
      }

      if (selectedOutput?.savedToSql) {
        filteredOptions.forEach(element => {
          if (
            element.value === ModalOptions.SAVE_TO_SQL &&
            element.text === t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_SaveToSQL`)
          ) {
            const optionText = `${element.text} (${selectedOutput?.sqlTableName})`;
            finalFilteredOptions.push({ ...element, text: optionText });
          } else {
            finalFilteredOptions.push({ ...element });
          }
        });
      }

      return (
        <OutputContextMenu
          rename={config?.step3?.contextMenu?.rename}
          options={selectedOutput?.savedToSql ? finalFilteredOptions : contexMenuFilteredOptions}
          output={selectedOutput}
          contextButtonRef={contextButtonRef}
          isModalOpen={isMenuOpen}
          setIsSendToOmniaModal={setIsSendToOmniaModal}
          setIsMappingScreenOpen={setIsMappingScreenOpen}
          setIsTableauTailoringOpen={setIsTableauTailoringOpen}
          setIsModalOpen={setIsMenuOpen}
          workpaperId={workpaperId}
          canvasType={canvasType}
          resetOmniaDescription={options => setFilteredOptions(options)}
          isConnectedToOmnia={
            engagement?.id && engagement.id !== CONTENT_LIBRARY_WP.ENGAGEMENT_ID
              ? engagement?.linkedOmniaEngagements.length
              : false
          }
          // eslint-disable-next-line camelcase
          eftINTEngagementLink={engagement?.efT_INT_EngagementLink}
        />
      );
    }

    return null;
  };

  const renderMappingScreen = () => {
    if (isMappingScreenOpen || isTableauTailoringOpen) {
      return (
        <OutputMappingScreen
          output={selectedOutput}
          isModalOpen={isMappingScreenOpen || isTableauTailoringOpen}
          setIsModalOpen={closeMappingScreen}
          workpaperId={workpaperId}
          isCentralizedDSUpdated={isCentralizedDSUpdated}
          savedToSql={isMappingScreenOpen}
        />
      );
    }

    return null;
  };

  const renderSendToOmniaModal = () => {
    return (
      <WpOutputSendToOmniaModal
        isModalOpen={isSendToOmniaModal}
        handleClose={handleClose}
        output={omniaOutput}
        isConnectedToOmnia={
          engagement?.id && engagement.id !== CONTENT_LIBRARY_WP.ENGAGEMENT_ID
            ? engagement?.linkedOmniaEngagements.length
            : false
        }
        engagement={engagement}
        selectedOutput={selectedOutput}
      />
    );
  };

  const getItemUrl = item => {
    // Consider adding cases based in canvas and or workpaper config
    switch (type) {
      case OUTPUT_TYPES.TABLEAU:
        // if (!config?.step3?.manageTableau && !item.cloned)
        return config?.step3?.outputsTableauPath
          ?.replace(':workpaperId', workpaperId)
          ?.replace(':workbookId', item.workbookId)
          ?.replace(':view', encodeURIComponent(item.name))
          ?.replace(':workpaperType', workpaper.workpaperSource);
      case OUTPUT_TYPES.DATA_TABLE:
      case OUTPUT_TYPES.DQC:
      default:
        if (workpaper?.isDMT && !!workpaper?.trifactaFlowId) {
          return `/library/datamodelTransformations/${workpaperId}/outputs/${item.id}`;
        }
        if (workpaper?.bundleTransformation && !!workpaper?.trifactaFlowId) {
          return `/library/bundleTransformations/${workpaperId}/outputs/${item.id}`;
        }
        if (mainWorkpaperId && isDMT) {
          return `/workpapers/${mainWorkpaperId}/${workpaperId}/datamodelOutputs/${item.id}`;
        }
        if (workpaper?.engagementId) {
          return `/workpapers/${workpaperId}/outputs/${item.id}`;
        }

        return `/library/workpapers/${workpaperId}/outputs/${item.id}`;
    }
  };

  const isCardDisabled = output => {
    if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
      return executionStatus.status !== ProgressBarTypes.FINISHED;
    } else if (Object.prototype.hasOwnProperty.call(output, 'status')) {
      return output.status !== OUTPUT_STATUS.COMPLETE;
    } else if (Object.prototype.hasOwnProperty.call(output, 'tableau')) {
      return workpaperProgress?.status !== ProgressBarTypes.FINISHED;
    }

    return false;
  };

  const removeWorkbookHandler = () => {
    if (workpaper.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
      dispatch(removeNotebookWB(workpaperId, true));
    } else {
      dispatch(removeWorkbooks(workpaperId));
    }
  };

  const handleDownloadAllOutputs = () => {
    if (workpaper.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
      downloadWorkpaperOutputs(workpaperId);
    } else if (workpaper.engagementId && workpaper.isRestrictFileDownload) {
      showWarningModal(t('Pages_Workpaper_Restrict_Download_Error'), null, true);
    } else {
      dispatch(
        downloadAllOutputs(workpaperId, workpaper.name, {
          id: type,
          name: t(`Pages_WorkpaperProcess_Step3_DownloadAllOutputs_Zip_${type}`),
        })
      );
    }
  };

  return (
    <Box>
      <Flex mb={5}>
        <Text type={TextTypes.BODY} color='gray' mr={4}>
          {title}
        </Text>
        {type === OUTPUT_TYPES.TABLEAU && config?.step3?.manageTableau && (
          <Button
            disabled={readOnlyfromWP}
            type={ButtonTypes.LINK}
            icon={IconTypes.CROSS}
            iconWidth={18}
            onClick={() =>
              showWarningModal(t('Pages_WorkpaperProcess_Step3_RemoveWorkbookConfirm'), removeWorkbookHandler)
            }
            dataInstance={`${COMPONENT_NAME}-RemoveWorkbook`}
          >
            <Text type={TextTypes.BODY}>{t('Pages_WorkpaperProcess_Step3_RemoveWorkbookButton')}</Text>
          </Button>
        )}
        {(type === OUTPUT_TYPES.DQC || type === OUTPUT_TYPES.DATA_TABLE) && !isDMT && (
          <Tooltip
            tooltipContent={t(`Pages_WorkpaperProcess_Step3_DownloadAllOutputs_${type}`)}
            showOnHover
            dataInstance={COMPONENT_NAME}
          >
            <Button
              type={ButtonTypes.LINK}
              iconWidth={20}
              icon={IconTypes.UPLOAD}
              onClick={handleDownloadAllOutputs}
              dataInstance={`${COMPONENT_NAME}-DownloadAll-${type}`}
            />
          </Tooltip>
        )}
      </Flex>
      {children}
      <GridView
        dataInstance={`${COMPONENT_NAME}-Outputs`}
        gap={GapSizes.LARGE}
        itemsPerRow={4}
        width='100%'
        pt={5}
        mb={9}
      >
        {list?.map((item, index) => (
          <Link key={item.id} to={isCardDisabled(item) ? '#' : getItemUrl(item)}>
            <IconCard
              key={item.id}
              iconType={getCardIconType()}
              dataInstance={`${COMPONENT_NAME}-${index}`}
              handleContextButton={filteredOptions.length > 0 ? handleContexButtonClick : null}
              loading={cardsLoading}
              disabled={isCardDisabled(item)}
              id={item.id}
              state={cardsState}
            >
              <Box>
                <Flex width='100%'>
                  <Tooltip showOnHover tooltipContent={item.name || item.fileName} display='grid'>
                    <Text color='black' type={TextTypes.BODY} fontWeight={theme.fontWeights.m} ellipsis>
                      {item.name || item.fileName}
                    </Text>
                  </Tooltip>
                  {item?.jeStatus && (
                    <Box ml={1} minWidth='20px'>
                      <Tooltip
                        display='inline-block'
                        direction={TooltipPosition.INFO}
                        tooltipContent={`${item?.jeStatus?.type}: ${
                          item?.jeStatus?.status === jeStatus.FAILED && item?.jeStatus?.errorMessage != null
                            ? item?.jeStatus?.errorMessage
                            : item?.jeStatus?.status
                        }`}
                        showOnHover
                      >
                        <Icon
                          type={getJeStatusIcon(item?.jeStatus?.status)}
                          height={20}
                          width={20}
                          color={getJeStatusColor(item?.jeStatus?.status)}
                        />
                      </Tooltip>
                    </Box>
                  )}
                </Flex>
                <Text type={TextTypes.BODY} color='gray' ellipsis>
                  {itemDescription}
                </Text>
                {type === OUTPUT_TYPES.DQC && (
                  <Text type={TextTypes.CAPTION} color='gray'>
                    {getLocalizedRowCount(item?.rowCount) > 0 ? (
                      <Text type={TextTypes.BODY} color='gray' ellipsis>
                        {t('Pages_WorkpaperProcess_Step3_Output_Rows_DQC_issues_found_Label')}
                      </Text>
                    ) : (
                      <Text type={TextTypes.BODY} color='gray' ellipsis>
                        {t('Pages_WorkpaperProcess_Step3_Output_Rows_DQC_no_issues_found_Label')}
                      </Text>
                    )}
                  </Text>
                )}
              </Box>
            </IconCard>
          </Link>
        ))}
      </GridView>
      {renderContextMenu()}
      {renderWarningModal()}
      {renderMappingScreen()}
      {renderSendToOmniaModal()}
    </Box>
  );
};

export default OutputList;
