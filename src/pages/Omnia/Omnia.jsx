import React, { useEffect } from 'react';
import { Spinner, AlertTypes, Text, TextTypes, Container, Link } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import useTranslation from 'src/hooks/useTranslation';
import { linkOmniaEngagement } from '../../store/dataExchange/actions';
import { dataExchangeSelectors } from '../../store/dataExchange/selectors';
import { PagePermissions } from '../../utils/permissionsHelper';
import { getClientPermissions } from '../../store/security/actions';
import { addGlobalError } from '../../store/errors/actions';
import env from 'env';
import { Flex } from 'reflexbox';

const TRANSLATION_KEY = 'Pages_Omnia';

export const Omnia = props => {
  const parsedQueryString = queryString.parse(window.location.search);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const omniaLinkResponse = useSelector(dataExchangeSelectors.omniaLinkResponse);
  const isLinkingEngagementToOmnia = useSelector(dataExchangeSelectors.isLinkingEngagementToOmnia);

  const redirectUser = (pagePermissions, clientId, engagementId) => {
    if (
      pagePermissions &&
      (pagePermissions[PagePermissions.CLIENT_SETUP_SETUP] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_APPLICATION_MAPPING] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_COMPONENT_MAPPING] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENTITIES] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENGAGEMENTS] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_CONNECTIONS] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DATA_SOURCES] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DETAILS] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_INFORMATICA] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_STAGING] ||
        pagePermissions[PagePermissions.CLIENT_SETUP_USERS])
    ) {
      props.history.push(`/clients/${clientId}/setup`);
    } else {
      props.history.push(`/engagements/${engagementId}/workpapers`);
    }
  };

  useEffect(() => {
    dispatch(linkOmniaEngagement(parsedQueryString?.token));
  }, [dispatch]);

  useEffect(() => {
    if (omniaLinkResponse) {
      if (!omniaLinkResponse.linkFailReason) {
        dispatch(getClientPermissions(omniaLinkResponse?.clientId)).then(clientPermission => {
          redirectUser(clientPermission.pages, omniaLinkResponse.clientId, omniaLinkResponse.engagementId);
        });
      } else {
        dispatch(addGlobalError({ type: AlertTypes.ERROR, message: omniaLinkResponse?.linkFailReason }));
      }
    }
  }, [omniaLinkResponse]);

  return (
    <Spinner
      spinning={isLinkingEngagementToOmnia}
      overlayOpacity={0}
      minHeight='calc(100vh - 120px)'
      size={32}
      pathSize={4}
      label={t(`${TRANSLATION_KEY}_ErrorMessage_TokenValidation`)}
      optionalRender
    >
      <Container p={10} textAlign='left'>
        <Flex flexDirection='column'>
          <Link to={`${env.REDIRECT_URI}`} key={t(`${TRANSLATION_KEY}_ErrorMessage_GoHomePage`)} external>
            <Text type={TextTypes.LINK}>{t(`${TRANSLATION_KEY}_ErrorMessage_GoHomePage`)}</Text>
          </Link>
          <Link
            to={omniaLinkResponse && omniaLinkResponse.omniaHomeUrl}
            key={t(`${TRANSLATION_KEY}_ErrorMessage_GoOmnia`)}
            external
          >
            <Text type={TextTypes.LINK}>{t(`${TRANSLATION_KEY}_ErrorMessage_GoOmnia`)}</Text>
          </Link>
        </Flex>
      </Container>
    </Spinner>
  );
};

export default Omnia;
