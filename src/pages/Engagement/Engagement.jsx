import React, { useCallback, useContext, useEffect, useState } from 'react';
import useNavContext from '../../hooks/useNavContext';
import { Box, Flex, HeaderBar, Spinner, Tabs, Alert, AlertDialog, Intent } from 'cortex-look-book';
import { Route, Switch, useHistory, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import env from 'env';
import EngagementWorkpapers from '../EngagementWorkpapers/engagementWorkpapers';
import EngagementPipelines from '../EngagementPipelines/EngagementPipelines';
import EngagementDataManagement from '../EngagementDataManagement/EngagementDataManagement';
import EngagementUserPermissions from '../EngagementUserPermissions/EngagementUserPermissions';
import EngagementSettings from './components/EngagementSettings/EngagementSettings';
import { getEngagementById, getEngagementRenameStatus, updatepathEngagementPath } from '../../store/engagement/actions';
import { getMyClientById } from '../../store/client/actions';
import AddWorkpaperModal from './components/AddWorkpaperModal/AddWorkpaperModal';
import AddPipelineModal from './components/AddPipelineModal/AddPipelineModal';
import useCheckAuth from '../../hooks/useCheckAuth';
import { isEmpty } from 'lodash';
import { Actions, checkPermissions, Permissions } from '../../utils/permissionsHelper';
import { isInFrame } from '../../utils/legacyUtils';
import {
  EngagementTabs,
  TODAY,
  DATE_FORMAT_MDY,
  REFRESH_INTERVAL,
  EngagementRenameStatus,
} from './constants/constants';
import { getLandingTab, getTabs } from './utils/engagementHelper';
import { ThemeContext } from 'styled-components';
import { engagementSelectors } from '../../store/engagement/selectors';
import { securitySelectors } from '../../store/security/selectors';
import { isExternal } from '../../utils/securityHelper';
import useTranslation from '../../hooks/useTranslation';
import { generateFilePathAlertMessage } from './utils/Engagement.utils';
import { downloadFile } from '../../store/staging/actions';

export const PAGE_NAME = 'Engagement';

// eslint-disable-next-line sonarjs/cognitive-complexity
const Engagement = props => {
  const { match } = props;
  const { t } = useTranslation();

  const location = useLocation();
  const history = useHistory();
  const { crumbs } = useNavContext(match);
  const [addWorkpaperIsOpen, setAddWorkpaperIsOpen] = useState(false);
  const [addPipelineIsOpen, setAddPipelineIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [redirect, setRedirect] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [tabs, setTabs] = useState([]);
  const [showEngagementWPFilePathErrorMsg, setEngagementWPFilePathErrorMsg] = useState(false);
  const [showEngagementWPFilePathInfoMsg, setEngagementWPFilePathInfoMsg] = useState(false);
  const [showEngagementWPFilePathSuccessMsg, setEngagementWPFilePathSuccessMsg] = useState(false);
  const [isFetchingRetryProcessInProgress, setIsFetchingRetryProcessInProgress] = useState(false);
  const [currentRetryStatus, setCurrentRetryStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { engagementId } = useParams();
  const theme = useContext(ThemeContext);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const isFetchingEngagement = useSelector(engagementSelectors.selectFetchingEngagement);
  const readOnlyfromEng = useSelector(engagementSelectors.readOnlyfromEng);
  const engagementRenameStatus = useSelector(engagementSelectors.selectEngagementRenameStatus);

  const dispatch = useDispatch();
  const permissions = useCheckAuth({ useEngagementPermissions: true });
  const me = useSelector(securitySelectors.selectMe);

  const cleanRetryProcess = () => {
    setEngagementWPFilePathErrorMsg(false);
    setEngagementWPFilePathInfoMsg(false);
    setEngagementWPFilePathSuccessMsg(false);
  };

  const retryInProgress = () => {
    setIsFetchingRetryProcessInProgress(true);
    setEngagementWPFilePathErrorMsg(false);
    setEngagementWPFilePathInfoMsg(true);
    setEngagementWPFilePathSuccessMsg(false);
  };

  const retryError = () => {
    setEngagementWPFilePathErrorMsg(true);
    setEngagementWPFilePathInfoMsg(false);
    setEngagementWPFilePathSuccessMsg(false);
  };

  const retrySuccess = () => {
    setIsFetchingRetryProcessInProgress(false);
    setEngagementWPFilePathErrorMsg(false);
    setEngagementWPFilePathInfoMsg(false);
    setEngagementWPFilePathSuccessMsg(true);
  };

  useEffect(() => {
    return cleanRetryProcess;
  }, []);

  const handleAddWorkpaper = isOpen => {
    setAddWorkpaperIsOpen(!!isOpen);
  };

  const handleAddPipeline = isOpen => {
    setAddPipelineIsOpen(!!isOpen);
  };

  const handleSearchChange = value => {
    setSearchValue(value);
  };

  const handlePrimaryButton = () => {
    if (
      (activeTab !== EngagementTabs.WORKPAPERS && activeTab !== EngagementTabs.PIPELINES) ||
      isEmpty(permissions) ||
      isEmpty(permissions.permissions)
    ) {
      return null;
    }

    if (
      activeTab === EngagementTabs.WORKPAPERS &&
      checkPermissions(permissions.permissions, Permissions.ENGAGEMENT_WORKPAPERS, Actions.ADD)
    ) {
      return () => {
        handleAddWorkpaper(true);
      };
    }

    if (
      activeTab === EngagementTabs.PIPELINES &&
      checkPermissions(permissions.permissions, Permissions.DATA_PIPELINE, Actions.ADD)
    ) {
      return () => {
        handleAddPipeline(true);
      };
    }

    return null;
  };

  const handleTabClick = routeId => {
    const index = tabs.findIndex(x => x.id === routeId);

    if (index !== -1) {
      if (routeId === EngagementTabs.TEAM) {
        window.location.href = `${env.EXTRACTIONUI_URL}/engagement/${engagementId}/${routeId}`;
      } else {
        history.push(`/engagements/${engagementId}/${tabs[index].id}`);
      }
    }
  };

  const setTab = useCallback(
    (tabId, browserHistory = null) => {
      if (
        tabId === EngagementTabs.WORKPAPERS ||
        tabId === EngagementTabs.PIPELINES ||
        tabId === EngagementTabs.DATA_MANAGEMENT
      ) {
        if (browserHistory) {
          browserHistory.replace(`/engagements/${engagementId}/${tabId}`);
        } else {
          setActiveTab(tabId);
        }
      } else {
        window.location.replace(`${env.EXTRACTIONUI_URL}/engagement/${engagementId}/${tabId}`);
      }
    },
    [engagementId]
  );

  useEffect(() => {
    if (!isEmpty(tabs) && !isEmpty(permissions.pagePermissions) && permissions.options.useEngagementPermissions) {
      const tab = tabs.find(
        element => location.pathname.includes(`/engagements/${engagementId}/${element.id}`) && !element.disabled
      );
      if (tab) {
        setTab(tab.id);
        setRedirect(false);
      } else {
        const tabId = getLandingTab(permissions.pagePermissions);
        setTab(tabId, history);
      }
    }
  }, [location.pathname, engagementId, tabs, history, permissions.pagePermissions, permissions.options, setTab]);

  useEffect(() => {
    dispatch(getEngagementById(engagementId)).then(response => {
      if (response?.clientId) {
        dispatch(getMyClientById(response.clientId));
      }
    });
  }, [dispatch, engagementId]);

  useEffect(() => {
    dispatch(getEngagementRenameStatus(engagementId)).then(res => {
      if (res?.status === EngagementRenameStatus.COMPLETEDWITHERRORS) {
        retryError();
      } else if (res?.status === EngagementRenameStatus.RUNNING) {
        retryInProgress();
      }
    });
  }, [dispatch, engagementId]);

  useEffect(() => {
    let pageTabs = getTabs(t, permissions.pagePermissions, permissions.options, isExternal(me));
    if (activeTab === EngagementTabs.PIPELINES && isInFrame) {
      pageTabs = pageTabs?.filter(tab => tab.id === EngagementTabs.PIPELINES);
    }
    setTabs(pageTabs);
  }, [permissions.pagePermissions, permissions.options, activeTab, isInFrame]);

  useEffect(() => {
    if (engagement?.name) {
      document.title = `${engagement?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [engagement]);

  useEffect(() => {
    let interval;
    if (
      currentRetryStatus !== EngagementRenameStatus.COMPLETEDSUCCESSFULLY &&
      currentRetryStatus !== EngagementRenameStatus.NOTPROCESSING
    ) {
      interval = setInterval(() => {
        dispatch(getEngagementRenameStatus(engagementId)).then(res => {
          setCurrentRetryStatus(res?.status);
          if (res?.status === EngagementRenameStatus.COMPLETEDWITHERRORS) {
            retryError();
          } else if (res?.status === EngagementRenameStatus.RUNNING) {
            retryInProgress();
          } else if (isFetchingRetryProcessInProgress && res?.status === EngagementRenameStatus.COMPLETEDSUCCESSFULLY) {
            retrySuccess();
          } else {
            cleanRetryProcess();
          }
        });
      }, REFRESH_INTERVAL);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [currentRetryStatus, isFetchingRetryProcessInProgress]);

  const handleRetry = async () => {
    retryInProgress();
    dispatch(updatepathEngagementPath(engagementId, engagement.clientId, me.email));
  };

  const handleLogDownload = () => {
    if (
      engagementRenameStatus?.reportUrl &&
      engagementRenameStatus?.status === EngagementRenameStatus.COMPLETEDWITHERRORS
    ) {
      setIsLoading(true);
      dispatch(
        downloadFile(
          engagementRenameStatus.reportUrl,
          `${engagement.name}${t('Pages_EngagementWorkpapers_File_Path_Error_Logs')}${dayjs(
            TODAY,
            DATE_FORMAT_MDY
          ).format(DATE_FORMAT_MDY)}`,
          'csv',
          'text/csv'
        )
      ).then(() => {
        setIsLoading(false);
      });
    }
  };

  return engagement && permissions.options.useEngagementPermissions && !redirect ? (
    <>
      {showEngagementWPFilePathErrorMsg && (
        <Spinner
          label={t('Pages_EngagementWorkpapers_File_Path_Spinner_Download_Log_Details')}
          spinning={isLoading}
          overlayOpacity={0}
          dataInstance={PAGE_NAME}
        >
          <AlertDialog
            type={Intent.ERROR}
            title={t('Pages_EngagementWorkpapers_File_Path_Error_Title')}
            mb={8}
            data-instance={`${PAGE_NAME}_Error_Alert`}
            onClose={() => setEngagementWPFilePathErrorMsg(false)}
          >
            {generateFilePathAlertMessage(
              t,
              () => {
                handleRetry();
              },
              () => {
                handleLogDownload();
              }
            )}
          </AlertDialog>
        </Spinner>
      )}
      {showEngagementWPFilePathInfoMsg && (
        <Alert
          message={t('Pages_EngagementWorkpapers_File_Path_Warning_Fixing_File_Path')}
          type={Intent.WARNING}
          mb={5}
          dataInstance={`${PAGE_NAME}_Info_Alert`}
          onClose={() => setEngagementWPFilePathInfoMsg(false)}
        />
      )}
      {showEngagementWPFilePathSuccessMsg && (
        <Alert
          message={t('Pages_EngagementWorkpapers_File_Path_Success_Fixed_File_Path')}
          type={Intent.SUCCESS}
          mb={5}
          dataInstance={`${PAGE_NAME}_Success_Alert`}
          onClose={() => setEngagementWPFilePathSuccessMsg(false)}
        />
      )}
      <HeaderBar
        disablePrimaryButton={readOnlyfromEng}
        currentView='tile'
        hideViewChange
        onPrimaryButtonClick={handlePrimaryButton()}
        onSecondaryButtonClick={null}
        primaryButtonText={
          activeTab === EngagementTabs.PIPELINES
            ? t('Pages_Engagement_HeaderBar_EngPipelines_PrimButtonText')
            : t('Pages_Engagement_HeaderBar_PrimButtonText')
        }
        searchData={[]}
        onSearchChange={e => handleSearchChange(e)}
        searchKey=''
        crumbs={crumbs}
        crumbsStartFrom={0}
        dataInstance={PAGE_NAME}
      >
        <Flex justifyContent='space-between'>
          <Tabs activeTab={activeTab} tabs={tabs} onTabClicked={handleTabClick} dataInstance={PAGE_NAME} />
          <EngagementSettings
            engagementId={engagement.id}
            clientId={engagement.clientId}
            closeoutStatus={engagement.closeout.status}
            legalHoldStatus={engagement.legalHold.status}
            data-instance={PAGE_NAME}
          />
        </Flex>
      </HeaderBar>
      <AddWorkpaperModal
        isModalOpen={addWorkpaperIsOpen}
        clientId={engagement.clientId}
        handleClose={() => {
          handleAddWorkpaper(false);
        }}
        dataInstance={PAGE_NAME}
      />
      <AddPipelineModal
        isModalOpen={addPipelineIsOpen}
        clientId={engagement.clientId}
        engagementId={engagementId}
        handleClose={() => {
          handleAddPipeline(false);
        }}
        dataInstance={PAGE_NAME}
      />
      <Box>
        <Switch>
          <Route
            path={`${match.path}/${EngagementTabs.WORKPAPERS}`}
            render={() => <EngagementWorkpapers {...{ searchValue }} />}
          />
          <Route
            path={`${match.path}/${EngagementTabs.PIPELINES}`}
            render={() => <EngagementPipelines {...{ searchValue }} />}
          />
          <Route path={`${match.path}/${EngagementTabs.DATA_MANAGEMENT}`} component={EngagementDataManagement} />
          <Route path={`${match.path}/${EngagementTabs.TEAM}`} component={EngagementUserPermissions} />
        </Switch>
      </Box>
    </>
  ) : (
    <Spinner
      label=''
      spinning={isFetchingEngagement}
      overlayOpacity={0}
      height='calc(100vh - 120px)'
      size={theme.space[11]}
      pathSize={theme.space[2]}
      dataInstance={PAGE_NAME}
    />
  );
};

export default Engagement;
