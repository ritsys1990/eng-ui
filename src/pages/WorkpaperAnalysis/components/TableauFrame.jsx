import React, { useState, useRef, useEffect } from 'react';
import { Box, Flex, IconTypes, Button, ButtonTypes, AlertTypes } from 'cortex-look-book';
import env from 'env';
import tableau from 'src/utils/tableau';
import useTranslation from 'src/hooks/useTranslation';
import { trackEvent } from '../../../app/appInsights/TelemetryService';
import { eventName, eventAction, eventStatus } from '../../../app/appInsights/appInsights.const';
import { useDispatch } from 'react-redux';
import { addGlobalError } from '../../../store/errors/actions';
import { updateWbRefreshFlag } from '../../../store/workpaperProcess/step3/actions';

const COMPONENT_NAME = 'TableauFrame';

const TableauFrame = ({ view, dataInstance, workpaperId, shouldRefresh }) => {
  const { t } = useTranslation();
  const vizContainer = useRef(null);
  const [viz, setViz] = useState(null);
  const dispatch = useDispatch();

  const getViewUrl = url => {
    const arr = url.split('/');

    return `${env.TABLEAU_URL}/t/${arr[1]}/views/${arr[2]}/${arr[4]}`;
  };

  const smartRefresh = async event => {
    try {
      await dispatch(
        addGlobalError({ type: AlertTypes.INFO, message: t('Pages_WorkpaperAnalysis_RefreshVisualization') })
      );
      await event?.getViz().refreshDataAsync();
      await dispatch(updateWbRefreshFlag(workpaperId, false));
    } catch (error) {
      await dispatch(
        addGlobalError({ type: AlertTypes.ERROR, message: t('Pages_WorkpaperAnalysis_RefreshVisualizationError') })
      );
    }
  };

  const initViz = refreshFlag => {
    viz?.dispose(); // eslint-disable-line no-unused-expressions
    const viewUrl = getViewUrl(view.url);
    const options = {
      hideTabs: true,
      width: '100%',
      height: '100%',
      toolbarPosition: tableau.ToolbarPosition.TOP,
      onFirstInteractive: async e => {
        if (refreshFlag) {
          await smartRefresh(e);
        }
      },
    };
    try {
      setViz(new tableau.Viz(vizContainer.current, viewUrl, options));
      trackEvent(eventName.TABLEAU_REQUEST, {
        eventAction: eventAction.COMPLETED,
        workpaperId: null,
        status: eventStatus.FINISHED,
        view: view.name,
        viewUrl,
      });
    } catch (e) {
      trackEvent(eventName.TABLEAU_REQUEST, {
        eventAction: eventAction.COMPLETED,
        workpaperId: null,
        status: eventStatus.ERROR,
        view: view.name,
        viewUrl,
      });
    }
  };

  useEffect(() => {
    if (view && shouldRefresh !== undefined && workpaperId) {
      initViz(shouldRefresh);
    }
  }, [view, shouldRefresh, workpaperId]);

  const onExportPDFClick = () => {
    viz?.showExportPDFDialog(); // eslint-disable-line no-unused-expressions
  };

  return (
    <Flex flex='1' flexDirection='column' dataInstance={`${dataInstance}_${COMPONENT_NAME}`}>
      <Box>
        {viz && (
          <Button
            type={ButtonTypes.LINK}
            icon={IconTypes.UPLOAD}
            mt={4}
            mb={8}
            onClick={onExportPDFClick}
            fontSize={14}
          >
            {t('Pages_WorkpaperAnalysis_ExportPDFButton')}
          </Button>
        )}
      </Box>
      <Box ref={vizContainer} height='100%' backgroundColor='black36' flex='1' minHeight={850} mb={12} />
    </Flex>
  );
};

export default TableauFrame;
