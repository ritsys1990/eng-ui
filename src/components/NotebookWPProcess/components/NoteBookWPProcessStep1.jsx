import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Flex, Tag, Link, Spinner, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import { resetInputFileErrors } from '../../../store/errors/actions';
import { COMPONENT_NAME, WP_PROCESS_INPUT_STATUS } from '../../WorkPaperProcess/constants/WorkPaperProcess.const';
import useTranslation, { nameSpaces } from '../../../hooks/useTranslation';
import useConfig from '../../WorkPaperProcess/hooks/useConfig';
import NotebookWPInputs from './NotebookWPInputs/NotebookWPInputs';
import InputUploaderModal from '../../InputUploaderModal/InputUploaderModal';
import LargeFileWarningModal from '../../InputUploaderModal/components/LargeFileWarning/LargeFileWarningModal';

const NoteBookWPProcessStep1 = ({ template, workpaperType, workpaper, canvasType, disableProperties }) => {
  const dispatch = useDispatch();
  const { config } = useConfig(canvasType);
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const { workpaperId } = useParams();
  const [selectedInput, setSelectedInput] = useState(null);
  const [selectedInputData, setSelectedInputData] = useState(null);
  const [shouldClean, setShouldClean] = useState(false);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [isUploaderShown, setIsUploaderShown] = useState(false);
  const [isAnyInputProcessing, setIsAnyInputProcessing] = useState(false);
  const [isLargeFileWarningShown, setIsLargeFileWarningShown] = useState(false);
  const [spinnerLabel, setSpinnerLabel] = useState(config.step1.inputOptions.allOptions_Spinner_label);
  const { t } = useTranslation();
  const onCloseLargeFileWarning = () => {
    setIsLargeFileWarningShown(false);
  };

  const onCloseWarning = () => {
    setIsWarningShown(false);
  };

  const onAcceptWarning = () => {
    setIsWarningShown(false);
    setIsUploaderShown(true);
    setIsNewUpload(false);
  };
  const handleGoToInputDataScreen = inputData => {
    if (inputData.error && inputData?.status === WP_PROCESS_INPUT_STATUS.MAPPING) {
      history.push(`/library/workpapers/${workpaperId}/inputs/${inputData.id}/source=${workpaperType}`);
    } else if (inputData?.status === WP_PROCESS_INPUT_STATUS.DONE) {
      history.push(`/library/workpapers/${workpaperId}/inputs/${inputData.id}/data/source=${workpaperType}`);
    }
  };

  useEffect(() => {
    setSpinnerLabel(config.step1.inputOptions.allOptions_Spinner_label);
  }, [config.step1.inputOptions.allOptions_Spinner_label]);

  return (
    <Box pl={90} style={{ pointerEvents: disableProperties ? 'none' : '' }}>
      <Spinner
        overlayOpacity={0.9}
        pathSize={theme.space[1]}
        size={theme.space[8]}
        spinning={false}
        label={spinnerLabel}
        optionalRender={false}
      >
        {config?.step1?.showAnalyticTemplate && (
          <Box mb={20}>
            <Text type={TextTypes.BODY} mb={3} color='gray'>
              {t('Pages_WorkpaperProcess_Step1_SelectedTemplateType')}
            </Text>
            <Flex alignItems='center'>
              <Tag dataInstance={`${COMPONENT_NAME}-AnalyticsTemplate`}>{template?.name}</Tag>
              {template?.link ? (
                <Link ml={4} to={template.link?.url} external target='_blank'>
                  {template.link?.name}
                </Link>
              ) : (
                ''
              )}
            </Flex>
          </Box>
        )}
        <Box>
          <NotebookWPInputs
            workpaperId={workpaperId}
            engagementId={workpaper?.engagementId}
            workpaperType={workpaperType}
            config={config}
            setSelectedInput={setSelectedInput}
            setShouldClean={setShouldClean}
            setIsNewUpload={setIsNewUpload}
            setIsWarningShown={setIsWarningShown}
            setIsUploaderShown={setIsUploaderShown}
            handleGoToInputDataScreen={handleGoToInputDataScreen}
            setSelectedInputData={setSelectedInputData}
            trifactaFlowId={workpaper?.trifactaFlowId}
            isAnyInputProcessing={isAnyInputProcessing}
            setIsAnyInputProcessing={setIsAnyInputProcessing}
            reviewStatus={workpaper?.reviewStatus}
            canvasType={canvasType}
          />
        </Box>
        {isUploaderShown && (
          <InputUploaderModal
            isDMT={workpaper?.isDMT}
            isOpen={isUploaderShown}
            isNewUpload={isNewUpload}
            inputId={selectedInput}
            selectedInput={selectedInputData}
            shouldClean={shouldClean}
            workpaperType={workpaperType}
            trifactaFlowId={workpaper?.trifactaFlowId}
            handleClose={() => {
              setIsUploaderShown(false);
              dispatch(resetInputFileErrors());
            }}
            handleLargeFileWarning={() => {
              setIsLargeFileWarningShown(true);
              setIsUploaderShown(false);
            }}
            canvasType={canvasType}
          />
        )}
        <Modal
          isOpen={isWarningShown}
          onClose={onCloseWarning}
          onPrimaryButtonClick={onAcceptWarning}
          onSecondaryButtonClick={onCloseWarning}
          primaryButtonText={t('Continue', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
          secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
          size={ModalSizes.SMALL}
          dataInstance={`${COMPONENT_NAME}-Warning`}
        >
          <Text>{shouldClean && t('Pages_WorkpaperProcess_Step1_WarningDescription_Replace')}</Text>
        </Modal>
        <LargeFileWarningModal isOpen={isLargeFileWarningShown} onClose={onCloseLargeFileWarning} />
      </Spinner>
    </Box>
  );
};

NoteBookWPProcessStep1.propTypes = {
  canvasType: PropTypes.string,
};

NoteBookWPProcessStep1.defaultProps = {
  canvasType: '',
};

export default NoteBookWPProcessStep1;
