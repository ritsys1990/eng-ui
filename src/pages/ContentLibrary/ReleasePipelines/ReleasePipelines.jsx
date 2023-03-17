import React, { useState } from 'react';
import { HeaderBar, Box, Container, Text, Spinner, Tabs } from 'cortex-look-book';
import useTranslation from '../../../hooks/useTranslation';
import useNavContext from '../../../hooks/useNavContext';
import useCheckAuth from '../../../hooks/useCheckAuth';
import { COMPONENT_NAME } from './constants/constants';
import PipelineList from '../Pipelines/components/PipelineList/PipelineList';
import { PagePermissions } from '../../../utils/permissionsHelper';
import { getTabs } from './utils/ReleasePipelinesHelper';

const ReleasePipelines = ({ match }) => {
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const { pagePermissions } = useCheckAuth();
  const [searchText, setSearchText] = useState('');
  const [isSearchClear, setIsSearchClear] = useState(false);
  const [activeTab, setActiveTab] = useState('Published');

  const tabs = getTabs(t);

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

  return hasPagePermissions() ? (
    <Spinner spinning={false}>
      <HeaderBar
        hideViewChange
        onSecondaryButtonClick={null}
        searchData={[]}
        onSearchChange={e => handleSearchChange(e)}
        searchKey=''
        crumbs={crumbs}
        crumbsStartFrom={0}
        dataInstance={`${COMPONENT_NAME}`}
        clearSearch={isSearchClear}
        searchPlaceholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
      />
      <Box ml={40} dataInstance={`${COMPONENT_NAME}-Tabs`}>
        <Tabs activeTab={activeTab} onTabClicked={setActiveTab} tabs={tabs} />
      </Box>
      <PipelineList searchText={searchText} status={activeTab} dataInstance={`${COMPONENT_NAME}-PipelinesList`} />
    </Spinner>
  ) : (
    <Box pt={12} dataInstance={`${COMPONENT_NAME}-NoPermissions`}>
      <Container>
        <Text>{t('Pages_Clients_NoPermissions')}</Text>
      </Container>
    </Box>
  );
};

export default ReleasePipelines;
