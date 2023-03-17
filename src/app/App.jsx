import React, { useContext, useEffect, useState } from 'react';
import { Spinner, Theme } from 'cortex-look-book';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { ThemeContext, ThemeProvider } from 'styled-components';
import { Provider, useDispatch, useSelector } from 'react-redux';
import env from 'env';
import store from '../store';

import {
  Client,
  Clients,
  ClientSetup,
  Engagement,
  Home,
  WorkPaperInput,
  NotebookWorkPaperInput,
  WorkPaperInputData,
  NotebookWorkPaperInputData,
  WorkPaperOutput,
  DataWrangler,
  WorkPaperType,
  WorkpaperAnalysis,
  // CLDataModels,
  Omnia,
  DataModelDetail,
  DefineFilters,
} from '../pages';
import ChildWorkPaper from '../pages/ChildWorkPaper/ChildWorkPaper';
import DataModels from '../pages/ContentLibrary/DataModels/DataModels';
import Pipelines from '../pages/ContentLibrary/Pipelines/Pipelines';
import ReleasePipelines from '../pages/ContentLibrary/ReleasePipelines/ReleasePipelines';
import Header from '../components/Header/Header';
import { getMe, getMeRoles, getUnacceptedTOU, getAlertsList } from '../store/security/actions';
import { getLocale } from '../store/settings/actions';

import { StyledApp, StyledContent, StyledGlobal } from './StyledApp';
import UserNotFound from '../pages/UserNotFound/UserNotFound';
import useCheckAuth from '../hooks/useCheckAuth';
import { isEmpty } from 'lodash';
import IdleModal from './IdleModal';
import TOUModal from '../components/TOUModal/TOUModal';

// import './App.css';
import { securitySelectors } from '../store/security/selectors';
import { settingsSelectors } from '../store/settings/selectors';
import { userCanAccessCortex } from '../utils/securityHelper';
import { getAppInsights } from './appInsights/TelemetryService';
import { LegacyLogin } from './LegacyLogin';
import ServiceInitializer from './ServiceInitializer';
import useAdobeTracking from './adobeAnalytics/useAdobeTracking';
import { login, useIsAuth, getProgressStatus, InteractionStatus } from '../utils/authHelper';
import { useSignalR } from '../hooks/useSignalR';
import { NETWORK_STATUS, NOTIFICATION_HUB } from '../constants/signalR.const';

const Root = () => {
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(true);
  const theme = useContext(ThemeContext);
  const me = useSelector(securitySelectors.selectMe);
  const meFetched = useSelector(securitySelectors.selectMeFetched);
  const permissions = useSelector(securitySelectors.selectPermissions);
  const permissionsFetched = useSelector(securitySelectors.selectPermissionsFetched);
  const roles = useSelector(securitySelectors.selectMeRoles);
  const rolesFetched = useSelector(securitySelectors.selectMeRolesFetched);
  const tou = useSelector(securitySelectors.selectTOU);
  const fetchingLocalization = useSelector(settingsSelectors.selectFetchingLocalization);
  const fetchingUserLocale = useSelector(settingsSelectors.selectfetchingUserLocale);
  const fetchingSetUserLocale = useSelector(settingsSelectors.selectFetchingSetUserLocale);
  const localizationFetched = !(fetchingLocalization || fetchingUserLocale || fetchingSetUserLocale);
  const { pagePermissions } = useCheckAuth();
  const alerts = useSelector(securitySelectors.selectAlerts);
  const [alert, setAlert] = useState({});

  const { subscribeToSignalR, unsubscribeToSignalR } = useSignalR();
  const currentPage = useHistory().location.pathname;

  useAdobeTracking();

  useEffect(() => {
    subscribeToSignalR(`${env.API_URL}/${NOTIFICATION_HUB}`);
  }, []);

  useEffect(() => {
    window.addEventListener(NETWORK_STATUS.ONLINE, () => {
      subscribeToSignalR(`${env.apiUrl}/${NOTIFICATION_HUB}`);
    });

    window.addEventListener(NETWORK_STATUS.OFFLINE, () => {
      unsubscribeToSignalR(`${env.apiUrl}/${NOTIFICATION_HUB}`);
    });
  }, [env, currentPage]);

  useEffect(() => {
    dispatch(getMe()).then(response => {
      if (response) {
        dispatch(getMeRoles());
        dispatch(getUnacceptedTOU());
        dispatch(getLocale());
        dispatch(getAlertsList());
      }
    });
  }, [dispatch]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (permissionsFetched && rolesFetched && !isEmpty(pagePermissions)) {
      if (!pagePermissions.clientSetup && !pagePermissions.engagement) {
        if (pagePermissions.contentLibrary) {
          // Important: Remove redirection after Content Library Page is implemented
          if (window.location.pathname !== '/clients') {
            setRedirect(false);
          } else {
            window.location.replace(`${env.EXTRACTIONUI_URL}/content-library`);
          }
        } else if (pagePermissions.admin) {
          // Important: Remove redirection after Admin Page is implemented
          window.location.replace(`${env.EXTRACTIONUI_URL}/admin`);
        } else {
          setRedirect(false);
        }
      } else {
        setRedirect(false);
      }
    }
  }, [pagePermissions, rolesFetched, permissionsFetched]);

  const getWorkpaperPermission = permission => {
    return window.location.pathname.indexOf('library') !== -1 ? permission.workItems : permission.engagementWorkpapers;
  };

  useEffect(() => {
    alerts?.forEach(alertValue => {
      const currentTime = new Date();
      const formatedStartDate = new Date(alertValue.startDate);
      const formatedEndDate = new Date(alertValue.endDate);

      if (currentTime > formatedStartDate && currentTime < formatedEndDate) {
        setAlert(alertValue);
      }
    });
  }, [alerts]);

  useEffect(() => {
    const lastAccessGranted = localStorage.getItem('ping');
    const hasWorkpaperPermissions = permissions ? getWorkpaperPermission(permissions.permissions) : null;
    if (hasWorkpaperPermissions && Object.values(hasWorkpaperPermissions).some(val => val) && !lastAccessGranted) {
      localStorage.setItem('ping', true);
      login();
    }
  }, [permissions]);

  useEffect(() => {
    window.UserId = me?.email;
  }, [me]);

  const getApp = () => {
    if (!isEmpty(tou)) {
      return <TOUModal touName={tou[0]} />;
    }

    if (
      me &&
      permissions &&
      !isEmpty(pagePermissions) &&
      rolesFetched &&
      tou &&
      !redirect &&
      userCanAccessCortex(roles, me) &&
      localizationFetched
    ) {
      return (
        <>
          <Header alert={alert} />
          <StyledContent>
            <Switch>
              <Route path='/engagements/:engagementId' component={Engagement} />
              <Route path='/workpapers/:workpaperId' exact component={WorkPaperType} />
              <Route path='/library/workpapers/:workpaperId' exact component={WorkPaperType} />
              <Route path='/library/datamodelTransformations/:workpaperId' exact component={WorkPaperType} />
              <Route path='/library/bundleTransformations/:workpaperId' exact component={WorkPaperType} />
              <Route path='/library/datamodels' exact component={DataModels} />
              <Route path='/library/datamodels/standard-bundles' exact component={DataModels} />
              <Route path='/library/datamodels/common-datamodels' exact component={DataModels} />
              <Route path='/library/datamodels/published-datamodels' exact component={DataModels} />
              <Route path='/workpapers/:workpaperId/data' exact component={DataWrangler} />
              <Route
                path='/workpapers/:workpaperId/datamodelTransformation/:datamodelTransformationId'
                exact
                render={props => <DataWrangler {...props} isDMT />}
              />
              <Route path='/library/workpapers/:workpaperId/data' exact component={DataWrangler} />
              <Route path='/library/datamodelTransformations/:workpaperId/data' exact component={DataWrangler} />
              <Route path='/library/bundleTransformations/:workpaperId/data' exact component={DataWrangler} />
              <Route path='/library/datamodels/:datamodelId/data' exact component={DataModelDetail} />
              <Route path='/library/bundles/:bundleId/filters' exact component={DefineFilters} />
              <Route path='/workpapers/:workpaperId/inputs/:inputId' exact component={WorkPaperInput} />
              <Route path='/library/workpapers/:workpaperId/inputs/:inputId' exact component={WorkPaperInput} />
              <Route
                path='/library/datamodelTransformations/:workpaperId/inputs/:inputId'
                exact
                component={WorkPaperInput}
              />
              <Route
                path='/library/bundleTransformations/:workpaperId/inputs/:inputId'
                exact
                component={WorkPaperInput}
              />
              <Route
                path='/library/workpapers/:workpaperId/inputs/:inputId/source=:workpaperType'
                exact
                component={NotebookWorkPaperInput}
              />
              <Route path='/workpapers/:workpaperId/inputs/:inputId/data' exact component={WorkPaperInputData} />
              <Route
                path='/library/workpapers/:workpaperId/inputs/:inputId/data'
                exact
                component={WorkPaperInputData}
              />
              <Route
                path='/library/datamodelTransformations/:workpaperId/inputs/:inputId/data'
                exact
                component={WorkPaperInputData}
              />
              <Route
                path='/library/bundleTransformations/:workpaperId/inputs/:inputId/data'
                exact
                component={WorkPaperInputData}
              />
              <Route
                path='/library/workpapers/:workpaperId/inputs/:inputId/data/source=:workpaperType'
                exact
                component={NotebookWorkPaperInputData}
              />
              <Route path='/workpapers/:workpaperId/outputs/:outputId' exact component={WorkPaperOutput} />
              <Route
                path='/workpapers/:mainWorkpaperId/:workpaperId/datamodelOutputs/:outputId'
                exact
                component={WorkPaperOutput}
              />
              <Route path='/library/workpapers/:workpaperId/outputs/:outputId' exact component={WorkPaperOutput} />
              <Route
                path='/library/datamodelTransformations/:workpaperId/outputs/:outputId'
                exact
                component={WorkPaperOutput}
              />
              <Route
                path='/library/bundleTransformations/:workpaperId/outputs/:outputId'
                exact
                component={WorkPaperOutput}
              />
              <Route
                path='/workpapers/:workpaperId/analysis/:workbookId?/:view?/source=:workpaperType'
                exact
                component={WorkpaperAnalysis}
              />
              <Route
                path='/library/workpapers/:workpaperId/analysis/:workbookId?/:view?/source=:workpaperType'
                exact
                component={WorkpaperAnalysis}
              />
              <Route path='/library/pipelines' exact component={Pipelines} />
              <Route path='/library/releases/pipelines' exact component={ReleasePipelines} />
              <Route path='/clients/:clientId/setup' component={ClientSetup} />
              <Route path='/clients/:clientId' component={Client} />
              <Route path='/clients' component={Clients} />
              <Route path='/workpaper/:workpaperId/childworkpaper' component={ChildWorkPaper} />
              <Route path='/omnia' component={Omnia} />
              <Route exact path='/user-not-found' component={UserNotFound} />
            </Switch>
          </StyledContent>
          <IdleModal />
        </>
      );
    }
    if (((!me && meFetched) || (meFetched && rolesFetched && !userCanAccessCortex(roles, me))) && localizationFetched) {
      return (
        <>
          <Header hideGlobalNavigation hideHeaderActions />
          <StyledContent>
            <UserNotFound />
          </StyledContent>
        </>
      );
    }

    return (
      <StyledContent>
        <Spinner height='100vh' spinning hideOverlay label='' size={theme.space[11]} pathSize={theme.space[2]} />
      </StyledContent>
    );
  };

  return getApp();
};

/* eslint-disable */
const ProtectedApp = () => {
  const isAuth = useIsAuth();
  const progressStatus = getProgressStatus();

  useEffect(() => {
    if (progressStatus === InteractionStatus.None && !isAuth) {
      login();
    }
  }, [progressStatus, isAuth]);

  return isAuth ? <Root /> : <div />;
};

const App = () => {
  // eslint-disable-next-line
  let appInsights = null;

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={Theme}>
          <ServiceInitializer
            telemetryProps={{
              instrumentationKey: env.APPINSIGHTS_INSTRUMENTATIONKEY,
              after: () => {
                if (!appInsights) {
                  // eslint-disable-next-line
                  appInsights = getAppInsights();
                }
              },
            }}
          >
            <StyledGlobal />
            <StyledApp>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/legacy-login' component={LegacyLogin} />
                <ProtectedApp />
              </Switch>
            </StyledApp>
          </ServiceInitializer>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
