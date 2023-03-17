import { Box, Flex } from 'reflexbox';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DataModelsList from '../DataModelsList/DataModelsList';
import useTranslation from '../../../../../hooks/useTranslation';
import { getTabs, getDMTTabs, isActiveStandardBundleTab } from '../../utils/DataModelsHelper';
import { Tabs, Container, Select, SelectTypes } from 'cortex-look-book';
import { bundlesSelectors } from '../../../../../store/bundles/selectors';
import { DATAMODEL_TABS, TABS_ROUTES } from '../../constants/constants';
import DataModelTransformations from '../DataModelTransformations/DataModelTransformations';
import CommonDataModels from '../CommonDataModels/CommonDataModels';
import { fetchOnlyPublishedTagsWithGroups, getPublishedBundleBaseList } from '../../../../../store/bundles/actions';
import { getAllDataModels, getPublishedDatamodels } from '../../../../../store/contentLibrary/datamodels/actions';
import { getAllCommonDataModels } from '../../../../../store/contentLibrary/commonDataModels/actions';

const PAGE_NAME = 'CL_DATAMODELS_TAB_MENU';

const DataModelsTabMenu = ({
  searchText,
  handlerPrimaryButton,
  openEditDMModal,
  searchTextHandle,
  setIsCDMTab,
  isAddCDMModalShown,
  closeAddEditModal,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('');
  const [activeDMTTab, setActiveDMTTab] = useState('');
  const [publishedTags, setPublishedTags] = useState([]);
  const budleTags = useSelector(bundlesSelectors.selectTagsPublishedList);
  const [allSelectedTags, setAllSelectedTags] = useState([]);

  const tabs = (() => getTabs(t))();
  const dmtTabs = (() => getDMTTabs(t))();

  const handleTabClick = tabId => {
    if (tabId !== activeTab) {
      if (tabId === DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS) {
        history.push(TABS_ROUTES.STANDARD_BUNDLES);
      } else if (tabId === DATAMODEL_TABS.COMMON_DATAMODELS) {
        history.push(TABS_ROUTES.COMMON_DATAMODELS);
      } else {
        history.push(TABS_ROUTES.DATAMODELS);
      }
    }
  };

  const handleDMTTabClick = tabId => {
    if (tabId === DATAMODEL_TABS.DATAMODELS) {
      history.push(TABS_ROUTES.PUBLISHED_DATAMODELS);
    } else {
      history.push(TABS_ROUTES.STANDARD_BUNDLES);
    }
  };

  useEffect(() => {
    searchTextHandle('');

    if ([TABS_ROUTES.DATAMODELS, TABS_ROUTES.DEFAULT].includes(history?.location?.pathname)) {
      setActiveTab(tabs[0].id);
      dispatch(getAllDataModels());
      handlerPrimaryButton(false);
      setActiveDMTTab('');
      setIsCDMTab(false);
    } else if ([TABS_ROUTES.COMMON_DATAMODELS].includes(history?.location?.pathname)) {
      setActiveTab(tabs[1].id);
      dispatch(getAllCommonDataModels());
      handlerPrimaryButton(false);
      setActiveDMTTab('');
      setIsCDMTab(true);
    } else {
      setActiveTab(tabs[2].id);
      handlerPrimaryButton(true);
      setIsCDMTab(false);
      if (history.location.pathname?.includes(TABS_ROUTES.PUBLISHED_DATAMODELS)) {
        setActiveDMTTab(dmtTabs[1].id);
        dispatch(getPublishedDatamodels());
      } else if (history.location.pathname?.includes(TABS_ROUTES.STANDARD_BUNDLES)) {
        setActiveDMTTab(dmtTabs[0].id);
        dispatch(getPublishedBundleBaseList(10, 0, searchText, []));
        dispatch(fetchOnlyPublishedTagsWithGroups(true));
      }
    }
  }, [history.location.pathname]);

  const getSelectedTags = onChangeValue => {
    return onChangeValue.map(eachItem => eachItem.id);
  };

  useEffect(() => {
    if (isActiveStandardBundleTab(activeDMTTab)) {
      dispatch(getPublishedBundleBaseList(10, 0, searchText, getSelectedTags(allSelectedTags)));
    }
  }, [searchText]);

  useEffect(() => {
    setPublishedTags(budleTags.items);
  }, [budleTags]);

  const onSelectTags = onChangeValue => {
    setAllSelectedTags(onChangeValue);
    dispatch(getPublishedBundleBaseList(10, 0, searchText, getSelectedTags(onChangeValue)));
  };

  return (
    <>
      <Container backgroundColor='white'>
        <Tabs activeTab={activeTab} tabs={tabs} onTabClicked={handleTabClick} dataInstance={`${PAGE_NAME}-tabs`} />
        <Flex
          dataInstance={`${PAGE_NAME}-Flex`}
          flexWrap='wrap'
          justifyContent='space-between'
          alignItems='center'
          width='100%'
        >
          {activeTab === DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS && (
            <Tabs
              activeTab={activeDMTTab}
              tabs={dmtTabs}
              onTabClicked={handleDMTTabClick}
              dataInstance={`${PAGE_NAME}-DMT_tabs`}
            />
          )}

          {activeTab === DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS && isActiveStandardBundleTab(activeDMTTab) && (
            <Box width='25%'>
              <Select
                dataInstance={`${PAGE_NAME}-Select-Tags`}
                type={SelectTypes.MULTIPLE}
                emptyMessage={t('Pages_Content_Library_FilterByTags_NoSearchResults')}
                placeholder={t('Pages_Content_Library_FilterByTags_Placeholder')}
                options={publishedTags || []}
                value={allSelectedTags || []}
                filtering
                onChange={onChangeValue => {
                  onSelectTags(onChangeValue);
                }}
                optionValueKey='id'
                optionTextKey='name'
                childrenListKey='tags'
                isFilteringChildren
              />
            </Box>
          )}
        </Flex>
      </Container>
      <Container>
        {activeTab === DATAMODEL_TABS.DATAMODELS && (
          <DataModelsList
            dataInstance={`${PAGE_NAME}-DMListing`}
            searchText={searchText}
            openEditDMModal={openEditDMModal}
          />
        )}
        {activeTab === DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS && (
          <DataModelTransformations
            dataInstance={`${PAGE_NAME}-DMTransformations`}
            selectedTab={activeDMTTab}
            searchText={searchText}
            selectedTags={getSelectedTags(allSelectedTags)}
          />
        )}
        {activeTab === DATAMODEL_TABS.COMMON_DATAMODELS && (
          <CommonDataModels
            dataInstance={`${PAGE_NAME}-Common-Datamodels`}
            isAddCDMModalShown={isAddCDMModalShown}
            closeAddEditModal={closeAddEditModal}
            searchText={searchText}
          />
        )}
      </Container>
    </>
  );
};

export default DataModelsTabMenu;
