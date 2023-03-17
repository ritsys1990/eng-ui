import React, { useEffect, useState } from 'react';
import { HeaderBar, Box, Container, Text, Spinner } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants/constants';
import useTranslation from '../../../hooks/useTranslation';
import useNavContext from '../../../hooks/useNavContext';
import { useSelector } from 'react-redux';
import useCheckAuth from '../../../hooks/useCheckAuth';
import { CLPipelinesSelectors } from '../../../store/contentLibrary/pipelines/selectors';
import PipelineList from './components/PipelineList/PipelineList';
import PipelineFormModal from './components/PipelineFormModal/PipelineFormModal';
import { PagePermissions } from '../../../utils/permissionsHelper';

const Pipelines = ({ match }) => {
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const { pagePermissions } = useCheckAuth();
  const [searchText, setSearchText] = useState('');
  const [isSearchClear, setIsSearchClear] = useState(false);
  const [isPipelineFormModalShown, setIsPipelineFormModalShown] = useState(false);
  const isCLPipelineAdding = useSelector(CLPipelinesSelectors.isCLPipelineAdding);

  useEffect(() => {
    if (!isCLPipelineAdding) {
      setIsPipelineFormModalShown(false);
    }
  }, [isCLPipelineAdding]);

  const hasPagePermissions = () => {
    if (pagePermissions[PagePermissions.CONTENT_LIBRARY_PIPELINES]) {
      return true;
    }

    return false;
  };

  const handleSearchChange = value => {
    setSearchText(value);
    if (value === '') {
      setIsSearchClear(true);
    }
    if (value !== '') {
      setIsSearchClear(false);
    }
  };

  const handlePrimaryButton = () => {
    setIsPipelineFormModalShown(true);
  };

  const handleAddModalClose = () => {
    setIsPipelineFormModalShown(false);
  };

  return hasPagePermissions() ? (
    <Spinner spinning={false}>
      <HeaderBar
        hideViewChange
        onPrimaryButtonClick={handlePrimaryButton}
        onSecondaryButtonClick={null}
        primaryButtonText={t('Pages_Content_Library_AddPipeline')}
        searchData={[]}
        onSearchChange={e => handleSearchChange(e)}
        searchKey=''
        crumbs={crumbs}
        crumbsStartFrom={0}
        dataInstance={`${COMPONENT_NAME}`}
        clearSearch={isSearchClear}
        searchPlaceholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
      />
      <Box pt={12} />
      <PipelineList searchText={searchText} />
      <PipelineFormModal
        isOpen={isPipelineFormModalShown}
        onClose={handleAddModalClose}
        dataInstance={`${COMPONENT_NAME}-Form`}
      />
      <Box pt={41} />
    </Spinner>
  ) : (
    <Box pt={12} dataInstance={`${COMPONENT_NAME}-NoPermissions`}>
      <Container>
        <Text>{t('Pages_Clients_NoPermissions')}</Text>
      </Container>
    </Box>
  );
};

export default Pipelines;
