import React, { useEffect, useState } from 'react';
import { HeaderBar, Box, Container, Text, Spinner } from 'cortex-look-book';
import useNavContext from '../../../../hooks/useNavContext';
import { PagePermissions } from '../../../../utils/permissionsHelper';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import useTranslation from '../../../../hooks/useTranslation';
import { getDatamodelFromId, getDMFieldTypes } from '../../../../store/contentLibrary/datamodels/actions';
import { resetDMFieldErrors } from '../../../../store/errors/actions';
import { contentLibraryDMSelectors } from '../../../../store/contentLibrary/datamodels/selectors';
import DataModelFieldsList from './components/DataModelFieldsList/DataModelFieldsList';

const COMPONENT_NAME = 'Datamodel-Detail';

const DataModelDetail = ({ match }) => {
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const { pagePermissions, permissions } = useCheckAuth();
  const { datamodelId } = useParams();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isAddField, setIsAddField] = useState(false);
  const isDMDataLoading = useSelector(contentLibraryDMSelectors.isDMDataLoading);
  const isDMFieldDeleting = useSelector(contentLibraryDMSelectors.isDMFieldDeleting);
  const [isFieldModalShown, setIsFieldModalShown] = useState(false);

  const handleSearchChange = value => {
    setSearchText(value);
  };
  const hasPagePermissions = () => {
    if (pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS]) {
      return true;
    }

    return false;
  };

  const hasUpdateFieldPermissions = () => {
    if (permissions?.dataModels?.update) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    dispatch(getDatamodelFromId(datamodelId));
    dispatch(getDMFieldTypes());
  }, [dispatch, datamodelId]);

  const handlePrimaryButton = () => {
    dispatch(resetDMFieldErrors());
    setIsAddField(true);
    setIsFieldModalShown(true);
  };

  const handleClose = () => {
    setIsAddField(false);
    setIsFieldModalShown(false);
  };

  return hasPagePermissions() ? (
    <Spinner
      spinning={isDMDataLoading || isDMFieldDeleting}
      size={32}
      pathSize={4}
      dataInstance={`${COMPONENT_NAME}-Spinner`}
      label={isDMFieldDeleting ? 'Deleting Field...' : ''}
    >
      <HeaderBar
        currentView='tile'
        hideViewChange
        onPrimaryButtonClick={handlePrimaryButton}
        onSecondaryButtonClick={null}
        primaryButtonText={t('Pages_Content_Library_AddNewField')}
        searchData={[]}
        onSearchChange={e => handleSearchChange(e)}
        searchKey=''
        crumbs={crumbs}
        crumbsStartFrom={0}
        dataInstance={`${COMPONENT_NAME}-HeaderBar`}
        disablePrimaryButton={!hasUpdateFieldPermissions()}
      />
      <DataModelFieldsList
        searchText={searchText}
        isFieldModalShown={isFieldModalShown}
        handleClose={handleClose}
        showFieldModal={() => {
          dispatch(resetDMFieldErrors());
          setIsAddField(false);
          setIsFieldModalShown(true);
        }}
        isAddField={isAddField}
        dataInstance={`${COMPONENT_NAME}-DataModelFieldsList`}
      />
    </Spinner>
  ) : (
    <Box pt={12} dataInstance={`${COMPONENT_NAME}-NoPermissions`}>
      <Container>
        <Text>{t('Pages_Clients_NoPermissions')}</Text>
      </Container>
    </Box>
  );
};

export default DataModelDetail;
