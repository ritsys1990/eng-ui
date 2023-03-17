import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Container, Spinner, StateView, Text, TextTypes, Link, useInterval } from 'cortex-look-book';
import { isEmpty } from 'lodash';
import { fetchAllTags } from '../../store/bundles/actions';
import { getWorkpapersList } from '../../store/workpaper/actions';
import useCheckAuth from '../../hooks/useCheckAuth';
import { PagePermissions } from '../../utils/permissionsHelper';
import WorkpaperTable from './components/WorkpaperTable/WorkpaperTable';
import { workpaperSelectors } from '../../store/workpaper/selectors';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { REFRESH_INTERVAL, CLONING_STATUS } from './components/WorkpaperTable/constants';

const technicalLibUrls = {
  pcaob: 'us-pcaob-aam-00200-audit-documentation-url',
  aam: 'us-aam-00200-audit-documentation-url',
};

const COMPONENT_NAME = 'engagementWorkpapers';

// eslint-disable-next-line sonarjs/cognitive-complexity
const EngagementWorkpapers = props => {
  const { searchValue } = props;
  const { engagementId } = useParams();
  const { t } = useTranslation();
  const tags = useSelector(state => (state.bundles.get('tagsList') || {}).items);
  const workpapersList = useSelector(workpaperSelectors.selectList);
  const isFetching = useSelector(workpaperSelectors.selectIsFetchingWorkpaperList);
  const isWorkpaperRefreshNeeded = useSelector(workpaperSelectors.selectIsWorkpaperRefreshNeeded);
  const permissions = useCheckAuth({ useEngagementPermissions: true });
  const dispatch = useDispatch();
  const [workpapers, setWorkpapers] = useState([]);
  const [showWorkpaperCloneRefresh, setShowWorkpaperCloneRefresh] = useState(true);
  const isCloningStatus =
    workpapersList?.items &&
    workpapersList.items.some(wplist => wplist.workpaperWorkflowCloneStatus === CLONING_STATUS.INPROGRESS);

  const emptyStateText =
    (searchValue || '').length > 0
      ? t('Pages_EngagementWorkpapers_NoSearchResults')
      : t('Pages_EngagementWorkpapers_NoWorkpapers');

  const hasPagePermissions = () => {
    if (isEmpty(permissions.pagePermissions) || !permissions.options.useEngagementPermissions) {
      return false;
    }

    if (permissions.pagePermissions[PagePermissions.ENGAGEMENT_WORK_ITEMS_DASHBOARD]) {
      return true;
    }

    return false;
  };

  useInterval(
    () => {
      if (isCloningStatus) {
        dispatch(getWorkpapersList(`?engagementId=${engagementId}`));
        setShowWorkpaperCloneRefresh(false);
      }
    },
    isCloningStatus ? REFRESH_INTERVAL : null
  );

  useEffect(() => {
    dispatch(getWorkpapersList(`?engagementId=${engagementId}`));
    dispatch(fetchAllTags());
  }, [dispatch, isWorkpaperRefreshNeeded, engagementId]);

  useEffect(() => {
    setWorkpapers(
      ((workpapersList || {}).items || []).filter(
        x =>
          (x.name || '')
            .trim()
            .toLowerCase()
            .indexOf((searchValue || '').trim().toLowerCase()) > -1 ||
          (x.description || '')
            .trim()
            .toLowerCase()
            .indexOf((searchValue || '').trim().toLowerCase()) > -1
      )
    );
  }, [workpapersList, searchValue]);

  const renderWorkpaperTable = () => {
    if (workpapers.length > 0) {
      return <WorkpaperTable engegementId={engagementId} rows={workpapers} tags={tags} dataInstance={COMPONENT_NAME} />;
    } else if (isFetching) {
      return <Box minHeight={300} width='100%' />;
    }

    return <StateView title={emptyStateText} />;
  };

  return hasPagePermissions() ? (
    <Container pt={12}>
      <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray'>
        {t('Pages_EngagementWorkpapers_PageTitle')}
      </Text>
      <Spinner spinning={isFetching && showWorkpaperCloneRefresh} pb={60}>
        {renderWorkpaperTable()}
      </Spinner>
      <Box pt={41}>
        <Text textAlign='left' type={TextTypes.H4} mb={4}>
          {t('Pages_EngagementWorkpapers_Disclaimer_Line1')}{' '}
          <Link to={t(technicalLibUrls.aam, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)} external target='_blank'>
            {t('Pages_EngagementWorkpapers_Disclaimer_Line2')}
          </Link>{' '}
          {t('Pages_EngagementWorkpapers_Disclaimer_Line3')}{' '}
          <Link to={t(technicalLibUrls.pcaob, nameSpaces.TRANSLATE_NAMESPACE_GENERAL)} external target='_blank'>
            {t('Pages_EngagementWorkpapers_Disclaimer_Line4')}
          </Link>{' '}
          {t('Pages_EngagementWorkpapers_Disclaimer_Line5')}
        </Text>
      </Box>
    </Container>
  ) : null;
};

export default EngagementWorkpapers;
