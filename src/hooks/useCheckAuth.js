import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getClientPermissions, getEngagementPermissions, getGlobalPermissions } from '../store/security/actions';
import { securitySelectors } from '../store/security/selectors';
import { clientSelectors } from '../store/client/selectors';
import { engagementSelectors } from '../store/engagement/selectors';
import { CONTENT_LIBRARY_WP } from '../components/WorkPaperProcess/constants/WorkPaperProcess.const';

const getInitialPermissions = (options, permissions, engagementPermissions, clientPermissions) => {
  if (options?.useEngagementPermissions) {
    return engagementPermissions?.permissions;
  } else if (options?.useClientPermissions) {
    return clientPermissions?.permissions;
  }

  return permissions?.permissions;
};

const useCheckAuth = (options = { useEngagementPermissions: false, useClientPermissions: false }) => {
  const me = useSelector(securitySelectors.selectMe);
  const client = useSelector(clientSelectors.selectClient);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const permissions = useSelector(securitySelectors.selectPermissions);
  const clientPermissions = useSelector(securitySelectors.selectClientPermissions);
  const engagementPermissions = useSelector(securitySelectors.selectEngagementPermissions);
  const [pagePermissions, setPagePermissions] = useState({});
  const [allPermissions, setAllPermissions] = useState(
    getInitialPermissions(options, permissions, engagementPermissions, clientPermissions) || {}
  );
  const [useEngagementPermissions, setUseEngagementPermissions] = useState(options?.useEngagementPermissions);
  const [useClientPermissions, setUseClientPermissions] = useState(options?.useClientPermissions);
  const [config, setConfig] = useState(options);
  const dispatch = useDispatch();

  useEffect(() => {
    if (me && !permissions) {
      dispatch(getGlobalPermissions());
    }
  }, [dispatch, permissions, me]);

  useEffect(() => {
    if (client?.id && client.id !== CONTENT_LIBRARY_WP.CLIENT_ID) {
      dispatch(getClientPermissions(client.id));
    }
  }, [dispatch, client]);

  useEffect(() => {
    setUseClientPermissions(options?.useClientPermissions);
    setUseEngagementPermissions(options?.useEngagementPermissions);
  }, [options]);

  useEffect(() => {
    setConfig({ useClientPermissions, useEngagementPermissions });
  }, [useEngagementPermissions, useClientPermissions]);

  useEffect(() => {
    if (engagement?.id && engagement.id !== CONTENT_LIBRARY_WP.ENGAGEMENT_ID) {
      dispatch(getEngagementPermissions(engagement.id));
    }
  }, [dispatch, engagement]);

  useEffect(() => {
    let permissionsToCheck = permissions;

    if (useEngagementPermissions) {
      permissionsToCheck = engagementPermissions;
    } else if (useClientPermissions) {
      permissionsToCheck = clientPermissions;
    }

    if (permissionsToCheck) {
      const topPages = {};

      const keys = Object.keys(permissionsToCheck.pages);
      keys.forEach(page => {
        const top = page.split('_')[0];
        topPages[top] = !!(topPages[top] || permissionsToCheck.pages[page]);
      });

      permissionsToCheck.pages = {
        ...permissionsToCheck.pages,
        ...topPages,
      };

      permissionsToCheck.pages.clientView =
        permissionsToCheck.pages.clientView ||
        (Array.isArray(permissionsToCheck.clientIds) && permissionsToCheck.clientIds.length > 0);

      permissionsToCheck.pages.engagement =
        permissionsToCheck.pages.engagement ||
        permissionsToCheck.pages.clientView ||
        (Array.isArray(permissionsToCheck.engagementIds) && permissionsToCheck.engagementIds.length > 0);

      setPagePermissions(permissionsToCheck.pages);
      setAllPermissions(permissionsToCheck.permissions);
    } else {
      setPagePermissions({});
      setAllPermissions({});
    }
  }, [permissions, engagementPermissions, clientPermissions, useEngagementPermissions, useClientPermissions]);

  return {
    pagePermissions,
    permissions: allPermissions,
    options: config,
  };
};

export default useCheckAuth;
