import React, { useEffect, useState } from 'react';
import { Spinner, Select, SelectTypes, Modal, ModalSizes, Box } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';
import { contentLibraryDMSelectors } from '../../store/contentLibrary/datamodels/selectors';
import PropTypes from 'prop-types';
import { Header } from '../InputUploaderModal/components/Header/Header';
import { getEnvironments, getDMTsOfDMByEnv, clearDMTsOfDMByEnv } from '../../store/contentLibrary/datamodels/actions';
import { INGEST_TYPES } from '../../pages/ContentLibrary/DataModels/constants/constants';

const COMPONENT_NAME = 'INGEST_SELECTOR_MODAL';

const IngestSelectorModal = props => {
  const { selectedItem, handleSubmit, handleClose, isOpen, titleText, ingestType } = props;
  const [selectedEnv, setSelectedEnv] = useState([]);
  const [selectedDMT, setSelectedDMT] = useState([]);
  const dispatch = useDispatch();
  const allEnvironments = useSelector(contentLibraryDMSelectors.allEnvironments);
  const isFetchingEnvironments = useSelector(contentLibraryDMSelectors.isFetchingEnvironments);
  const dmtsListToIngest = useSelector(contentLibraryDMSelectors.dmtsListToIngest);
  const isFetchingDMTsToIngest = useSelector(contentLibraryDMSelectors.isFetchingDMTsToIngest);
  const isDMTIngestQueue = useSelector(contentLibraryDMSelectors.isDMTIngestQueue);
  const { t } = useTranslation();

  //  getEnvironments
  useEffect(() => {
    dispatch(getEnvironments());
  }, [dispatch]);

  useEffect(() => {
    setSelectedEnv([]);
    setSelectedDMT([]);
  }, [isOpen]);

  const closeModal = () => {
    dispatch(clearDMTsOfDMByEnv());
    handleClose();
  };

  const onEnvironmentChange = selectedEnvi => {
    setSelectedEnv(selectedEnvi);
    if (ingestType === INGEST_TYPES.DMT && selectedEnvi?.length > 0) {
      dispatch(getDMTsOfDMByEnv(selectedItem?.nameTech, selectedEnvi[0].name)).then(response => {
        if (response?.isError) {
          closeModal();
        }
      });
    }
  };

  const onSelectValue = selectedValue => {
    setSelectedDMT(selectedValue);
  };

  const onIngestClick = () => {
    if (selectedEnv?.length > 0 && selectedDMT?.length > 0) {
      handleSubmit(selectedEnv[0].name, selectedDMT[0]);
    }
  };

  const getFieldModal = () => {
    let ingestingLabel = t('Components_Modal_Ingest_Content_DM_Ingesting');
    const environmentsLabel = t('Components_Modal_Ingest_Content_DM_Environments_Loading');
    const environmentContentsLabel = t('Components_Modal_Ingest_Content_DM_Environment_Contents_Loading');
    if (isFetchingEnvironments) {
      ingestingLabel = environmentsLabel;
    } else if (isFetchingDMTsToIngest) {
      ingestingLabel = environmentContentsLabel;
    }

    return (
      <Spinner spinning={isFetchingEnvironments || isFetchingDMTsToIngest || isDMTIngestQueue} label={ingestingLabel}>
        <Box pb={20}>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Components_Modal_Ingest_Content_From_Environment_Label')}
            options={allEnvironments}
            optionValueKey='name'
            optionTextKey='name'
            filtering
            value={selectedEnv}
            onChange={onEnvironmentChange}
            emptyMessage={t('Components_Modal_Ingest_Content_Environment_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-env`}
            disabled={allEnvironments.length === 0}
          />
        </Box>
        <Box pb={20}>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Components_Modal_Ingest_DMT_Label')}
            options={dmtsListToIngest}
            filtering
            value={selectedDMT}
            optionValueKey='id'
            optionTextKey='name'
            onChange={onSelectValue}
            emptyMessage={t('Pages_Ingest_DMTs_Empty_Message')}
            dataInstance={`${COMPONENT_NAME}-ingestItem`}
            disabled={false}
            showTrifactaIcon
          />
        </Box>
      </Spinner>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        onPrimaryButtonClick={onIngestClick}
        onSecondaryButtonClick={closeModal}
        primaryButtonText={t('Pages_Content_Library_StandardBundleList_DMT_Ingest_Modal_OK_Button')}
        secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        size={ModalSizes.MEDIUM}
        dataInstance={`${COMPONENT_NAME}`}
        disablePrimaryButton={selectedEnv?.length <= 0 || selectedDMT?.length <= 0}
      >
        <Header titleText={titleText} pb={3} />
        {getFieldModal()}
      </Modal>
    </>
  );
};

export default IngestSelectorModal;

IngestSelectorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
