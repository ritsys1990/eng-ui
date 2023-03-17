import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Spinner, Text, TextTypes, Button, ButtonTypes } from 'cortex-look-book';
import { downloadNotices } from '../../store/client/actions';
import { clientSelectors } from '../../store/client/selectors';
import env from 'env';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';
import { openOneTrustPopup } from '../../utils/oneTrustUtils';

export const COMPONENT_NAME = 'AUDIT-DISCLAIMER';

const noticeUrls = {
  pcaob: 'us-pcaob-aam-22852-url',
  aam: 'us-aam-22852-url',
  etuat: 'engagement-teams-use-of-an-audit-tool-url',
};

const AuditDisclaimer = () => {
  const dispatch = useDispatch();
  const noticesBlob = useSelector(clientSelectors.selectNoticesBlob);
  const fetchingNotices = useSelector(clientSelectors.selectFetchingNotices);
  const currentAuditYear = new Date().getFullYear();

  const { t } = useTranslation();

  useEffect(() => {
    let name = null;
    if (noticesBlob?.caller === 'disclaimer') {
      name = 'FRONT-END NOTICE.pdf';
    } else if (noticesBlob?.caller === 'cortex tou') {
      name = 'CORTEX TOU.pdf';
    } else if (noticesBlob?.caller === 'privacy') {
      name = 'Privacy Statement.pdf';
    } else if (noticesBlob?.caller === 'cookie notice') {
      name = 'Cookie Notice.pdf';
    }
    if (name) {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(noticesBlob.file, name);
      } else {
        const url = (window.URL ? window.URL : window.webkitURL).createObjectURL(noticesBlob.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
      }
      dispatch(downloadNotices(true));
    }
  }, [noticesBlob]);

  return (
    <Spinner
      spinning={noticesBlob && noticesBlob.caller === 'disclaimer' && fetchingNotices}
      overlayOpacity={0.5}
      dataInstance={COMPONENT_NAME}
    >
      <Text textAlign='left' type={TextTypes.H4} mb={4}>
        {t('Components_AuditDisclaimer_Line1').replace(`${'year'}`, currentAuditYear)}{' '}
        <Link
          external
          to='#'
          onClick={() =>
            dispatch(
              downloadNotices(
                false,
                `/${env.ENVIRONMENT_NAME}${t('terms-of-use-url', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}`,
                'cortex tou'
              )
            )
          }
        >
          {t('Components_AuditDisclaimer_Line2_Terms')}
        </Link>
        ,&nbsp;
        <Link
          external
          to='#'
          onClick={() =>
            dispatch(
              downloadNotices(
                false,
                `/${env.ENVIRONMENT_NAME}${t('privacy-statement-url', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}`,
                'privacy'
              )
            )
          }
        >
          {t('Components_AuditDisclaimer_Line2_PrivacyStatement')}
        </Link>{' '}
        {t('Components_AuditDisclaimer_Line2_And')}{' '}
        <Link
          external
          to='#'
          onClick={() =>
            dispatch(
              downloadNotices(
                false,
                `/${env.ENVIRONMENT_NAME}${t('notices-url', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}`,
                'disclaimer'
              )
            )
          }
        >
          {t('Components_AuditDisclaimer_Line2_Notices')}
        </Link>{' '}
        {t('Components_AuditDisclaimer_Line3')}{' '}
        <Link to={t(noticeUrls.pcaob, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)} external target='_blank'>
          {t('Components_AuditDisclaimer_Line4')}
        </Link>{' '}
        {t('Components_AuditDisclaimer_Line5')}{' '}
        <Link to={t(noticeUrls.aam, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)} external target='_blank'>
          {t('Components_AuditDisclaimer_Line6')}
        </Link>{' '}
        {t('Components_AuditDisclaimer_Line7')}{' '}
        <Link to={t(noticeUrls.etuat, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)} external target='_blank'>
          {t('Components_AuditDisclaimer_Line8')}
        </Link>{' '}
        {t('Components_AuditDisclaimer_Line9')}{' '}
      </Text>
      <Text textAlign='left' type={TextTypes.H4} mb={4}>
        <Button type={ButtonTypes.LINK} display='inline-block' height={10} onClick={openOneTrustPopup}>
          <Text type={TextTypes.BODY_COPY_SMALL}>{t('Components_AuditDisclaimer_Line10_cookie_settings')}</Text>
        </Button>{' '}
        {t('Components_AuditDisclaimer_Line10_and')}{' '}
        <Link
          external
          to='#'
          onClick={() =>
            dispatch(
              downloadNotices(
                false,
                `/${env.ENVIRONMENT_NAME}${t('cookie-notice', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}`,
                'cookie notice'
              )
            )
          }
        >
          {t('Components_AuditDisclaimer_Line10_cookie_notice')}
        </Link>{' '}
      </Text>
    </Spinner>
  );
};

export default AuditDisclaimer;
