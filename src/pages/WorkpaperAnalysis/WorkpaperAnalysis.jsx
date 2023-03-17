import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, AlertTypes } from 'cortex-look-book';
import useNavContext from '../../hooks/useNavContext';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { getWorkbooks, setupTableau } from '../../store/workpaperProcess/step3/actions';
import { wpStep3Selectors } from '../../store/workpaperProcess/step3/selectors';
import { notebookWPStep3Selector } from '../../store/notebookWorkpaperProcess/step3/selectors';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { trackEvent } from '../../app/appInsights/TelemetryService';
import { eventName, eventAction, eventStatus } from '../../app/appInsights/appInsights.const';
import { getWorkbooks as getNotebookWB } from '../../store/notebookWorkpaperProcess/step3/actions';
import { WORKPAPER_TYPES } from '../../utils/WorkpaperTypes.const';
import { PageModes } from './constants';
import { getPageMode } from './utils';
import WorkbookNav from './components/WorkbookNav';
import TablauFrame from './components/TableauFrame';
import Wrapper from './components/Wrapper';
import useTranslation from 'src/hooks/useTranslation';

const COMPONENT_NAME = 'WorkpaperAnalysis';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WorkpaperAnalysis = props => {
  const { t } = useTranslation();
  const { match } = props;
  const { crumbs } = useNavContext(match);
  const dispatch = useDispatch();
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);

  let selector = wpStep3Selectors;

  if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
    selector = notebookWPStep3Selector;
  }

  const workbooks = useSelector(selector.selectWorkbooks);
  const isWpLoading = useSelector(wpProcessSelectors.selectIsLoading);
  const isFetchingWorkbooks = useSelector(selector.selectIsFetchingWorkbooks);
  const isSettingUpTableau = useSelector(wpStep3Selectors.selectIsSettingUpTableau);
  const setupTableauError = useSelector(wpStep3Selectors.selectSetupTableauError);
  const hasSetupTableau = useSelector(wpStep3Selectors.selectHasSetupTableau);
  const [view, setView] = useState();
  const history = useHistory();
  const isLoading = isWpLoading || isFetchingWorkbooks || isSettingUpTableau;
  const [pageAlert, setPageAlert] = useState(null);
  // Avoid multiple inits in iframe due to clean up.
  const [started, setStarted] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(undefined);

  const showAlert = (message, type = AlertTypes.ERROR) => {
    setPageAlert({ message, type });
  };

  useEffect(() => {
    (async () => {
      const { workpaperId, workpaperType } = match.params;
      await dispatch(getWorkpapersDetails(workpaperId, workpaperType));
      setStarted(true);
      trackEvent(eventName.TABLEAU_REQUEST, {
        eventAction: eventAction.STARTED,
        workpaperId,
        status: eventStatus.RUNNING,
        view: match.params.view,
      });
    })();
  }, [match.params.workpaperId, dispatch]);

  useEffect(() => {
    if (workpaper && started) {
      const pageMode = getPageMode(match.path);
      switch (pageMode) {
        case PageModes.CONTENT_LIBRARY:
          if (workpaper.engagementId) {
            showAlert(t('Pages_WorkpaperAnalysis_WpNotFoundInCLError'));

            return;
          }
          break;
        case PageModes.ENGAGEMENT:
          if (!workpaper.engagementId) {
            showAlert(t('Pages_WorkpaperAnalysis_WpNotFoundInEngError'));

            return;
          }
          break;
        default:
          // If this happens there is something wrong in code.
          throw new Error(`${t('Pages_WorkpaperAnalysis_Error')} ${pageMode}`);
      }
      if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
        dispatch(getNotebookWB(workpaper?.id));
      } else {
        dispatch(getWorkbooks(workpaper?.id));
      }
    }
  }, [workpaper, started]);

  const updateRoute = (workbookId, viewName) => {
    setShouldRefresh(false);
    const path = match.path
      .replace(':workpaperId', match.params.workpaperId)
      .replace(':workbookId?', workbookId)
      .replace(':view?', encodeURIComponent(viewName))
      .replace(':workpaperType', workpaper?.workpaperSource);
    history.push(path);
  };

  const runSetupTableau = async () => {
    // Make sure we only try to setup one time for this instance.
    if (workpaper?.id && !hasSetupTableau && !setupTableauError) {
      await dispatch(setupTableau(workpaper.id));
    }
  };

  useEffect(() => {
    if (setupTableauError) {
      // Show a warning, since the user could be already created.
      showAlert(t('Pages_WorkpaperAnalysis_SetupTableauError'), AlertTypes.WARNING);
    }
  }, setupTableauError);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const setupContent = async () => {
    if (!started) {
      return;
    }
    if (!workbooks) {
      return;
    }
    if (workbooks.length === 0) {
      showAlert(t('Pages_WorkpaperAnalysis_NoWorkbooksError'));

      return;
    }
    const cloned = workbooks?.every(x => x.cloned);
    if (!cloned && workpaper.engagementId) {
      showAlert(t('Pages_WorkpaperAnalysis_NoClonedWorkbooksError'), AlertTypes.GUIDANCE);

      return;
    }
    await runSetupTableau();
    const { workbookId, view: viewParam } = match.params;
    if (!workbookId || !viewParam) {
      // Updates the path, if not workbookId or view provided.
      const viewName = viewParam ? decodeURIComponent(viewParam)?.trim() : null;
      let pathWorkbook = workbookId ? workbooks.find(x => x.workbookId === workbookId) : workbooks[0];
      pathWorkbook = pathWorkbook || workbooks[0];
      let pathView = viewName ? pathWorkbook.views.find(v => v.name?.trim() === viewName) : pathWorkbook.views?.[0];
      pathView = pathView || pathWorkbook.views?.[0];
      updateRoute(pathWorkbook.workbookId, pathView.name);
    } else {
      // Sets the view based on path
      const viewName = decodeURIComponent(viewParam)?.trim();
      const pathView = workbooks.find(x => x.workbookId === workbookId)?.views.find(v => v.name?.trim() === viewName);
      if (pathView) {
        setView(pathView);
      }
    }
  };

  useEffect(() => {
    if (workbooks && workbooks.length > 0) {
      const refresh = workbooks.some(workbook => workbook.shouldRefresh);
      setShouldRefresh(refresh);
    }
  }, [workbooks]);

  useEffect(() => {
    setupContent();
  }, [workbooks, match.params.workbookId, match.params.view, started]);

  const onViewChangeHandler = selectedView => {
    updateRoute(selectedView.workbookId, selectedView.name);
  };

  return (
    <Wrapper isLoading={isLoading} crumbs={crumbs} dataInstance={COMPONENT_NAME}>
      {pageAlert && (
        <Alert
          message={pageAlert.message}
          type={pageAlert.type}
          mb={5}
          id={`${COMPONENT_NAME}_PageAlert`}
          onClose={() => setPageAlert(null)}
        />
      )}
      <WorkbookNav workbooks={workbooks} view={view} onViewChange={onViewChangeHandler} dataInstance={COMPONENT_NAME} />
      <TablauFrame workpaperId={match.params.workpaperId} view={view} shouldRefresh={shouldRefresh} />
    </Wrapper>
  );
};

export default WorkpaperAnalysis;
