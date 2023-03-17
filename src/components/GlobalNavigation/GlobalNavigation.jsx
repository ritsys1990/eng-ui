import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Tabs } from 'cortex-look-book';
import { PagePermissions as PermissionsLabels } from '../../utils/permissionsHelper';
import env from 'env';
import useCheckAuth from '../../hooks/useCheckAuth';
import useTranslation from '../../hooks/useTranslation';

export const COMPONENT_NAME = 'GLOBAL-NAVIGATION';

const clientViewPermission = [
  PermissionsLabels.CLIENT_VIEW_SETUP,
  PermissionsLabels.CLIENT_VIEW_SETUP_BLACKOUT,
  PermissionsLabels.CLIENT_VIEW_SETUP_DATA_SOURCES,
  PermissionsLabels.CLIENT_VIEW_SETUP_SECURE_AGENT,
  PermissionsLabels.CLIENT_VIEW_USERS,
];

const GlobalNavigation = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const { pagePermissions } = useCheckAuth();

  useEffect(() => {
    setActiveTab(location.pathname.substr(1).replace('/', ''));
  }, [location]);

  useEffect(() => {
    const newTabs = [];
    const isClientViewVisible = pagePermissions.clientView && clientViewPermission.some(i => pagePermissions[i]);

    if (pagePermissions) {
      if (
        pagePermissions.engagement ||
        pagePermissions.clientSetup ||
        (!pagePermissions.contentLibrary && !pagePermissions.admin)
      ) {
        newTabs.push({
          id: 'clients',
          label: t('Components_GlobalNavigation_Tabs_MyClients'),
          route: '/clients',
          external: false,
        });
      }

      if (isClientViewVisible) {
        newTabs.push({
          id: 'client-setup',
          label: t('Components_GlobalNavigation_Tabs_ClientSetup'),
          route: `${env.EXTRACTIONUI_URL}/clientview`,
          external: true,
        });
      }

      if (pagePermissions.contentLibrary) {
        newTabs.push({
          id: 'content-library',
          label: t('Components_GlobalNavigation_Tabs_ContentLibrary'),
          route: `${env.EXTRACTIONUI_URL}/content-library`,
          external: true,
        });
      }

      if (pagePermissions.admin) {
        newTabs.push({
          id: 'admin',
          label: t('Components_GlobalNavigation_Tabs_Admin'),
          route: `${env.EXTRACTIONUI_URL}/admin`,
          external: true,
        });
      }
    }

    setTabs(newTabs);
  }, [pagePermissions]);

  const handleTabClick = routeId => {
    const index = tabs.findIndex(x => x.id === routeId);

    if (index !== -1) {
      if (!tabs[index].external) {
        history.push(tabs[index].route);
        setActiveTab(tabs[index].id);
      } else {
        window.location.href = tabs[index].route;
      }
    }
  };

  return <Tabs activeTab={activeTab} tabs={tabs} onTabClicked={handleTabClick} dataInstance={COMPONENT_NAME} />;
};

export default GlobalNavigation;
