import React, { useState, useCallback } from 'react';
import {
  Box,
  Intent,
  Alert,
  Text,
  TextTypes,
  Button,
  ButtonTypes,
  IconTypes,
  Accordion,
  AccordionTypes,
} from 'cortex-look-book';
import { useSelector, useDispatch } from 'react-redux';
import useTranslation from '../../../hooks/useTranslation';
import { wpStep3Selectors } from '../../../store/workpaperProcess/step3/selectors';
import { generateWorkbooks } from '../../../store/workpaperProcess/step3/actions';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { notebookWPStep3Selector } from '../../../store/notebookWorkpaperProcess/step3/selectors';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import { GenWBStatus, GenWBStep, WB_PROCESS_TYPE } from '../../../utils/workbooks.const';
import useConfig from '../hooks/useConfig';
import LabelDataSetModal from './WorkpaperOutputs/LabelDataSetModal';
import PublishWorkbookProgress from './WorkpaperOutputs/PublishWorkbookProgress';
import PublishWorkbookModal from './WorkpaperOutputs/PublishWorkbookModal';
import OutputList from './WorkpaperOutputs/OutputList';
import { COMPONENT_NAME, OUTPUT_TYPES, OUTPUT_STATUS } from './WorkpaperOutputs/output.consts';

// eslint-disable-next-line sonarjs/cognitive-complexity
const RenderLists = ({
  canvasType,
  workpaperId,
  isCentralizedDSUpdated,
  showSimplePopUp,
  closeSimplePopup,
  showTableauAlert,
  setSTableauAlert,
  isDMT,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();

  const { config } = useConfig(canvasType);
  const { t } = useTranslation();

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const isChildWorkpapersStatusCompleted = useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted);

  let selector = wpStep3Selectors;
  if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
    selector = notebookWPStep3Selector;
  }

  const outputs = useSelector(selector.selectOutputs(workpaperId));
  const workbooks = useSelector(selector.selectWorkbooks);
  const generateWorkbooksState = useSelector(selector.selectGenerateWorkbooksState);
  const publishStatus = useSelector(selector.selectPublishStatus);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const hasOutputs =
    (config?.step3?.outputsDQC && outputs?.dqc.length > 0) ||
    (config?.step3?.outputsDataTable && outputs?.dataTable.length > 0);

  const tableauCardsState = () => {
    if (config?.step3?.manageTableau) {
      return Intent.GUIDANCE;
    }
    switch (generateWorkbooksState?.status) {
      case GenWBStatus.Error:
        return Intent.ERROR;
      case GenWBStatus.Done:
        return Intent.SUCCESS;
      default:
        return null;
    }
  };

  const getOutputErrorMessage = useCallback(() => {
    if (generateWorkbooksState?.status === GenWBStatus.Error) {
      switch (generateWorkbooksState?.step) {
        case GenWBStep.SavingToSQL:
          return t('Pages_WorkpaperProcess_Step3_SQLErrorMessage');
        case GenWBStep.Cloning:
          return t('Pages_WorkpaperProcess_Step3_GenerateTableauError');
        default:
          return t('Pages_WorkpaperProcess_Step3_Default');
      }
    }

    return null;
  }, [generateWorkbooksState?.status, generateWorkbooksState?.step, t]);

  const genWorkbooksHandler = async () => {
    if (config?.step3?.cloneTableau) {
      await dispatch(generateWorkbooks(workpaperId, true));
      setSTableauAlert(true);
    }
  };

  const isAnyOutputDone = () => {
    return !!outputs?.dataTable?.find(o => o.status === OUTPUT_STATUS.COMPLETE);
  };

  return (
    <Box>
      {!hasOutputs && (
        <Text color='black54' mb={8}>
          {config?.step3?.emptyText}
        </Text>
      )}

      {config?.step3?.outputDescription && hasOutputs && (
        <Text color='black54' mb={8}>
          {config?.step3?.outputDescription}
        </Text>
      )}

      {config?.step3?.outputsDQC && outputs && outputs?.dqc.length > 0 && isDMT && (
        <>
          <Accordion
            status={Intent.SUCCESS}
            isOpened
            type={AccordionTypes.MEDIUM}
            header={{
              render: () => (
                <Text fontSize={13} color='black' fontWeight='bold' mb={8}>
                  {t('Pages_WorkpaperProcess_Step3_DataQualityCheckOutputs')}
                </Text>
              ),
            }}
            mb={2}
          >
            <OutputList
              itemDescription={t('Pages_WorkpaperProcess_Step3_DataTable')}
              data={outputs.dqc}
              type={OUTPUT_TYPES.DQC}
              workpaperId={workpaperId}
              mainWorkpaperId={workpaper.id}
              config={config}
              canvasType={canvasType}
              isDMT={isDMT}
            />
          </Accordion>
        </>
      )}

      {config?.step3?.outputsDQC && outputs && outputs?.dqc.length > 0 && !isDMT && (
        <OutputList
          title={t('Pages_WorkpaperProcess_Step3_DataQualityCheckOutputs')}
          itemDescription={t('Pages_WorkpaperProcess_Step3_DataTable')}
          data={outputs.dqc}
          type={OUTPUT_TYPES.DQC}
          workpaperId={workpaperId}
          config={config}
          canvasType={canvasType}
        />
      )}

      {config?.step3?.outputsDataTable && outputs && outputs?.dataTable.length > 0 && isDMT && (
        <>
          <Accordion
            status={Intent.SUCCESS}
            isOpened
            type={AccordionTypes.MEDIUM}
            header={{
              render: () => (
                <Text fontSize={13} color='black' fontWeight='bold' mb={0}>
                  {t('Pages_WorkpaperProcess_Step3_DataTableOutputs')}
                </Text>
              ),
            }}
            color='black'
            mb={2}
          >
            <OutputList
              itemDescription={t('Pages_WorkpaperProcess_Step3_DataTable')}
              data={outputs.dataTable}
              type={OUTPUT_TYPES.DATA_TABLE}
              workpaperId={workpaperId}
              mainWorkpaperId={workpaper.id}
              config={config}
              canvasType={canvasType}
              isCentralizedDSUpdated={isCentralizedDSUpdated}
              isDMT={isDMT}
            />
          </Accordion>
        </>
      )}

      {config?.step3?.outputsDataTable && outputs && outputs?.dataTable.length > 0 && !isDMT && (
        <OutputList
          title={t('Pages_WorkpaperProcess_Step3_DataTableOutputs')}
          itemDescription={t('Pages_WorkpaperProcess_Step3_DataTable')}
          data={outputs.dataTable}
          type={OUTPUT_TYPES.DATA_TABLE}
          workpaperId={workpaperId}
          config={config}
          canvasType={canvasType}
          isCentralizedDSUpdated={isCentralizedDSUpdated}
        />
      )}

      {config?.step3?.outputsTableau && workbooks?.length > 0 && (
        <OutputList
          title={t('Pages_WorkpaperProcess_Step3_TableauOutputs')}
          data={workbooks}
          type={OUTPUT_TYPES.TABLEAU}
          workpaperId={workpaperId}
          cardsLoading={generateWorkbooksState?.status === GenWBStatus.Progress}
          cardsState={tableauCardsState()}
          config={config}
        >
          {tableauCardsState() === Intent.ERROR && showTableauAlert && (
            <Alert
              type={Intent.ERROR}
              message={getOutputErrorMessage()}
              onClose={() => setSTableauAlert(false)}
              dataInstance={`${COMPONENT_NAME}-GenerateTableauAlert`}
              mb={4}
            />
          )}
          {!config?.step3?.manageTableau && generateWorkbooksState?.status === GenWBStatus.Error && (
            <Button
              dataInstance={`${COMPONENT_NAME}-GenerateTableau`}
              type={ButtonTypes.PRIMARY}
              mr={4}
              onClick={genWorkbooksHandler}
              disabled={!isAnyOutputDone()}
            >
              {t('Pages_WorkpaperProcess_Step3_GenerateTableauButton')}
            </Button>
          )}
        </OutputList>
      )}

      {config?.step3?.manageTableau && publishStatus && (
        <PublishWorkbookProgress publishStatus={publishStatus} my={4} />
      )}

      {config?.step3?.manageTableau &&
        workbooks?.length === 0 &&
        (!publishStatus ||
          publishStatus?.status === WB_PROCESS_TYPE.ERROR ||
          publishStatus?.status === WB_PROCESS_TYPE.TABLEMISMATCH) && (
          <>
            <Button
              disabled={readOnlyfromWP || isChildWorkpapersStatusCompleted}
              type={ButtonTypes.LINK}
              icon={IconTypes.PLUS}
              iconWidth={20}
              onClick={() => setIsPublishModalOpen(true)}
              dataInstance={`${COMPONENT_NAME}-AddWorkbook`}
            >
              <Text type={TextTypes.H3}>{t('Pages_WorkpaperProcess_Step3_OpenPublishModalButton')}</Text>
            </Button>
          </>
        )}

      {isPublishModalOpen && outputs && (
        <PublishWorkbookModal
          isOpen={isPublishModalOpen}
          workpaperId={workpaper.id}
          workpaperType={workpaper.workpaperSource}
          workbookDataSource={workpaper.workbookDataSource}
          outputs={outputs.dataTable}
          onClose={() => setIsPublishModalOpen(false)}
        />
      )}

      {showSimplePopUp && (
        <LabelDataSetModal
          readOnlyfromWP={readOnlyfromWP || isChildWorkpapersStatusCompleted}
          isOpen={showSimplePopUp}
          title={t('Components_HeaderHelp_Label_Dataset')}
          onClose={closeSimplePopup}
          workpaperId={workpaper.id}
          canvasType={canvasType}
        />
      )}
    </Box>
  );
};

export default RenderLists;
