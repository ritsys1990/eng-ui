import React, { useEffect, useState } from 'react';
import { Box, Container, HeaderBar, Spinner, Tabs, Text, TextTypes } from 'cortex-look-book';
import useNavContext from '../../../hooks/useNavContext';
import {
  getBundleNameDetails,
  getSourceVersionFilterDetails,
  fetchBundleContexts,
  fetchTableContexts,
} from '../../../store/bundles/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { bundlesSelectors } from '../../../store/bundles/selectors';
import { PAGE_NAME, DefineFilterTabs, BUNDLE_STATUS } from './constants/constants';
import useTranslation from '../../../hooks/useTranslation';
import AddFilterModal from './components/AddFilterModal/AddFilterModal';
import FiltersTable from './components/FiltersTable/FiltersTable';
import DeleteFilterModal from './components/FiltersTable/DeleteFilterModal';

const DefineFilters = props => {
  const { match } = props;
  const { crumbs } = useNavContext(match);
  const { bundleId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isFetchingBundleNameDetails = useSelector(bundlesSelectors.selectIsFetchingBundleNameDetails);
  const bundleNameDetails = useSelector(bundlesSelectors.selectBundleNameDetails);
  const sourceVersionFilters = useSelector(bundlesSelectors?.selecteSourceVersionFilters);
  const bundleContexts = useSelector(bundlesSelectors?.selectBundleContexts);

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(DefineFilterTabs.FILTERS);
  const [AddFilterIsOpen, setAddFilterIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    dispatch(getBundleNameDetails(bundleId));
  }, [bundleId]);

  useEffect(() => {
    if (bundleNameDetails?.sourceVersionId) {
      dispatch(fetchBundleContexts(bundleNameDetails?.bundleId));
      dispatch(getSourceVersionFilterDetails(bundleNameDetails?.bundleId, bundleNameDetails?.sourceVersionId));
    }
  }, [bundleNameDetails]);

  useEffect(() => {
    if (bundleNameDetails?.sourceVersionId && bundleContexts?.items) {
      const bundleContextId = bundleContexts?.items[0]?.id;
      dispatch(fetchTableContexts(bundleNameDetails?.bundleId, bundleContextId));
    }
  }, [bundleContexts]);

  useEffect(() => {
    setTabs([
      {
        id: DefineFilterTabs.FILTERS,
        label: t('Pages_ContentLibrary_Filters'),
      },
    ]);
  }, []);

  const handleTabClick = tabId => {
    setActiveTab(tabId);
  };

  const handleAddFilterModal = isOpen => {
    setAddFilterIsOpen(isOpen);
    if (!isOpen) {
      setIsChanged(false);
    }
    setIsEditMode(false);
  };

  const handleDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const deleteFilterRow = selectedRow => {
    setSelectedFilter(selectedRow);
    setIsMenuOpen(false);
    setIsDeleteOpen(true);
  };

  const editFilterRow = selectedRow => {
    setSelectedFilter(selectedRow);
    setAddFilterIsOpen(true);
    setIsMenuOpen(false);
    setIsEditMode(true);
  };

  return (
    <Spinner spinning={isFetchingBundleNameDetails} overlayOpacity={0.7} height='100vh' dataInstance={`${PAGE_NAME}`}>
      <HeaderBar
        hideViewChange
        onPrimaryButtonClick={() => handleAddFilterModal(true)}
        disablePrimaryButton={
          bundleNameDetails?.currentState?.publishState === BUNDLE_STATUS.PUBLISHED ||
          bundleNameDetails?.currentState?.publishState === BUNDLE_STATUS.DEACTIVATED ||
          bundleContexts?.length < 1
        }
        onSecondaryButtonClick={null}
        primaryButtonText={t('Pages_ContentLibrary_Define_Filters_Add_Filters')}
        searchData={[]}
        onSearchChange={null}
        allLinks={false}
        searchKey=''
        crumbs={crumbs}
        crumbsStartFrom={0}
        dataInstance={`${PAGE_NAME}-HeaderBar`}
      >
        <Tabs activeTab={activeTab} tabs={tabs} onTabClicked={handleTabClick} dataInstance={`${PAGE_NAME}-Tabs`} />
      </HeaderBar>
      <AddFilterModal
        isOpen={AddFilterIsOpen}
        selectedFilter={selectedFilter}
        handleClose={() => handleAddFilterModal(false)}
        isEditMode={isEditMode}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        dataInstance={`${PAGE_NAME}-Filter-Modal`}
      />
      <DeleteFilterModal
        isOpen={isDeleteOpen}
        selectedFilter={selectedFilter}
        sourceVersionId={bundleNameDetails?.sourceVersionId}
        handleClose={handleDeleteModal}
        dataInstance={`${PAGE_NAME}-Delete-Filter-Modal`}
      />
      <Container pt={12} dataInstance={`${PAGE_NAME}-container`}>
        <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray'>
          {t('Pages_ContentLibrary_Define_Filters_Heading')}
        </Text>
        <Box mt={4}>
          <FiltersTable
            filterRows={sourceVersionFilters}
            deleteFilterRow={deleteFilterRow}
            editFilterRow={editFilterRow}
            setIsMenuOpen={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            dataInstance={`${PAGE_NAME}-Filter-Table`}
            isBundlePublished={
              bundleNameDetails?.currentState?.publishState === BUNDLE_STATUS.PUBLISHED ||
              bundleNameDetails?.currentState?.publishState === BUNDLE_STATUS.DEACTIVATED
            }
          />
        </Box>
      </Container>
    </Spinner>
  );
};

export default DefineFilters;
