import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { Box, Spinner, Tabs, AlertHub, Text } from 'cortex-look-book';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import { errorsSelectors } from '../../../store/errors/selectors';
import { deleteWPProcessingErrors } from '../../../store/errors/actions';
import WPProgressBar from './WorkpaperProcessing/WPProgressBar';
import JRSteps from './WorkpaperProcessing/JRSteps';
import ProcessWorkpaper from './WorkpaperProcessing/ProcessWorkpaper';
import { COMPONENT_NAME } from '../constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';

const WpProcessStep2 = ({ workpaperId }) => {
  // Setup
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  // State from Redux
  const isLoading = useSelector(WPProcessingSelectors.isLoading(workpaperId));
  const errors = useSelector(errorsSelectors.selectWorkpaperProcessingErrors(workpaperId));
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));

  const [activeTab, setActiveTab] = useState('dataTransformationTab');
  const [batchMode, setBatchMode] = useState(workpaperProgress?.batchMode);

  const { t } = useTranslation();

  const onTabClickHandler = tabId => {
    setActiveTab(tabId);
  };

  const onErrorClose = errorKey => {
    dispatch(deleteWPProcessingErrors(errorKey, { workpaperId }));
  };

  useEffect(() => {
    setBatchMode(workpaperProgress?.batchMode);
  }, [workpaperProgress]);

  const renderBasedOnBatchMode = () => {
    if (batchMode === false) {
      if (workpaperProgress?.status === 'running' || workpaperProgress?.status === 'finished') {
        return <Text>{t('Pages_WorkpaperProcess_Step2_Batch_Mode_Off')}</Text>;
      }

      return <WPProgressBar workpaperId={workpaperId} />;
    }

    return (
      <>
        <WPProgressBar workpaperId={workpaperId} />
        <Tabs
          activeTab={activeTab}
          onTabClicked={onTabClickHandler}
          tabs={[
            {
              id: 'dataTransformationTab',
              label: t('Pages_WorkpaperProcess_Step2_Tab_Title'),
            },
          ]}
          header
          mb={theme.space[9] - 4}
          dataInstance={COMPONENT_NAME}
        />
        <JRSteps workpaperId={workpaperId} />
        <ProcessWorkpaper workpaperId={workpaperId} />
      </>
    );
  };

  return (
    <Box ml={90}>
      <Spinner
        spinning={isLoading}
        overlayOpacity={0.5}
        size={theme.space[11]}
        pathSize={theme.space[2]}
        label=''
        optionalRender={false}
      >
        <AlertHub alerts={errors || []} onClose={onErrorClose} />
        {renderBasedOnBatchMode()}
      </Spinner>
    </Box>
  );
};

WpProcessStep2.propTypes = {
  workpaperId: PropTypes.string,
};

WpProcessStep2.defaultProps = {
  workpaperId: '',
};

export default WpProcessStep2;
