import React, { useEffect, useState } from 'react';
import { HeaderBar, Box, Container, Text, Spinner } from 'cortex-look-book';
import useNavContext from '../../../hooks/useNavContext';
import { COMPONENT_NAME } from './constants/constants';
import DataModelsTabMenu from './components/DataModelsTabMenu/DataModelsTabMenu';
import { PagePermissions } from '../../../utils/permissionsHelper';
import { fetchOnlyPublishedTagsWithGroups } from '../../../store/bundles/actions';
import { contentLibraryDMSelectors } from '../../../store/contentLibrary/datamodels/selectors';
import { clearModalContent } from '../../../store/contentLibrary/datamodels/actions';
import { resetDMFieldErrors } from '../../../store/errors/actions';
import { useDispatch, useSelector } from 'react-redux';
import useCheckAuth from '../../../hooks/useCheckAuth';
import useTranslation from '../../../hooks/useTranslation';
import AddDataModelModal from './components/AddDataModelModal/AddDataModelModal';

const DataModels = ({ match }) => {
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const { pagePermissions } = useCheckAuth();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isSearchClear, setIsSearchClear] = useState(false);
  const [isAddDMModalShown, setIsAddDMModalShown] = useState(false);
  const [isAddCDMModalShown, setIsAddCDMModalShown] = useState(false);
  const [isAddDM, setIsAddDM] = useState(false);
  const [selectedDM, setSelectedDM] = useState(false);
  const [isActiveDMTTB, setIsActiveDMTTB] = useState(false);
  const [isCDMTab, setIsCDMTab] = useState(false);
  const isDMValidating = useSelector(contentLibraryDMSelectors.isDMValidating);

  const handlePrimaryButton = () => {
    dispatch(resetDMFieldErrors());
    if (isCDMTab) {
      setIsAddCDMModalShown(true);
    } else {
      setIsAddDM(true);
      setIsAddDMModalShown(true);
    }
  };

  const handleSearchChange = value => {
    setSearchText(value);
    setSearchText(value);
    if (value === '') {
      setIsSearchClear(true);
    }
    if (value !== '') {
      setIsSearchClear(false);
    }
  };

  const hasPagePermissions = () => {
    if (pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS]) {
      return true;
    }

    return false;
  };

  const handleClose = () => {
    setIsAddDMModalShown(false);
    setIsAddDM(false);
    setSelectedDM(false);
    dispatch(clearModalContent());
  };

  const openEditDMModal = dm => {
    dispatch(resetDMFieldErrors());
    setSelectedDM(dm);
    setIsAddDM(false);
    setIsAddDMModalShown(true);
  };

  const closeAddEditModal = () => {
    setIsAddCDMModalShown(false);
  };

  useEffect(() => {
    dispatch(fetchOnlyPublishedTagsWithGroups());
  }, [dispatch]);

  return hasPagePermissions() ? (
    <Spinner spinning={isDMValidating}>
      <HeaderBar
        currentView='tile'
        hideViewChange
        onPrimaryButtonClick={isActiveDMTTB ? null : handlePrimaryButton}
        onSecondaryButtonClick={null}
        primaryButtonText={
          isCDMTab
            ? t('Pages_Content_Library_CommonDataModels_AddCommonDataModel')
            : t('Pages_Content_Library_AddDataModel')
        }
        searchData={[]}
        onSearchChange={e => handleSearchChange(e)}
        searchKey=''
        crumbs={crumbs}
        crumbsStartFrom={0}
        dataInstance={`${COMPONENT_NAME}-Header`}
        clearSearch={isSearchClear}
      />
      <DataModelsTabMenu
        dataInstance={`${COMPONENT_NAME}-DataModelsTabMenu`}
        searchText={searchText}
        openEditDMModal={openEditDMModal}
        handlerPrimaryButton={setIsActiveDMTTB}
        searchTextHandle={handleSearchChange}
        setIsCDMTab={setIsCDMTab}
        isAddCDMModalShown={isAddCDMModalShown}
        closeAddEditModal={closeAddEditModal}
      />
      <AddDataModelModal
        dataInstance={`${COMPONENT_NAME}-AddDataModelModal`}
        isOpen={isAddDMModalShown}
        handleClose={handleClose}
        isAddDM={isAddDM}
        selectedDM={selectedDM}
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

export default DataModels;
