import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useTranslation from '../../../../../../hooks/useTranslation';
import { errorsSelectors } from '../../../../../../store/errors/selectors';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { deleteIngestDMTError, resetIngestDMTError } from '../../../../../../store/errors/actions';
import {
  getDMTFromEnvironment,
  ingestDMTAction,
  ingestSBTAction,
} from '../../../../../../store/contentLibrary/datamodels/actions';
import { Header } from 'src/components/InputUploaderModal/components/Header/Header';
import { Box, Spinner, Modal, ModalSizes, Text, TextTypes, Select, SelectTypes, AlertHub } from 'cortex-look-book';
import { DMFieldContainer } from 'src/pages/ContentLibrary/DataModels/DataModelDetail/components/AddDMFieldModal/DMFieldModal.styled';
import { securitySelectors } from '../../../../../../store/security/selectors';

const COMPONENT_NAME = 'CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ModalIngestDmt = ({ ingestDMTOpen, handleIngestDMTModal, activeDMT }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const allEnvironments = useSelector(contentLibraryDMSelectors.allEnvironments);
  const selectIngestDMTErrors = useSelector(errorsSelectors.selectIngestDMTErrors);
  const environmentContentDMT = useSelector(contentLibraryDMSelectors.environmentContentDMT);
  const isFetchingEnvironments = useSelector(contentLibraryDMSelectors.isFetchingEnvironments);
  const isFetchingEnvContent = useSelector(contentLibraryDMSelectors.isFetchingEnvContent);
  const isIngestingDMT = useSelector(contentLibraryDMSelectors.isIngestingDMT);
  const me = useSelector(securitySelectors.selectMe);

  const [selectedDMT, setSelectedDMT] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState([]);
  const [openRenameModal, setOpenRenameModal] = useState(false);

  const onErrorClose = errorKey => {
    dispatch(deleteIngestDMTError(errorKey));
  };

  const fetchEnviContent = enviValue => {
    setSelectedEnvironment(enviValue);
    setSelectedDMT([]);
    dispatch(resetIngestDMTError());
    if (enviValue.length > 0) {
      dispatch(getDMTFromEnvironment(activeDMT, enviValue[0].name));
    }
  };

  const getSpinnerLabels = () => {
    if (isFetchingEnvironments) {
      return t('Components_Modal_Ingest_Content_DM_Environments_Loading');
    } else if (isFetchingEnvContent) {
      return t('Components_Modal_Ingest_Content_DM_Environment_Contents_Loading');
    } else if (isIngestingDMT) {
      return t('Components_Modal_Ingest_Content_DM_Environment_Ingesting_Standard_Bundle_Transformation');
    }

    return '';
  };

  const handleModalClose = () => {
    setSelectedDMT([]);
    setSelectedEnvironment([]);
    handleIngestDMTModal(false);
    setOpenRenameModal(false);
  };

  const continueIngestDMT = () => {
    dispatch(ingestDMTAction(selectedDMT[0], openRenameModal)).then(res => {
      if (res.error) {
        if (res.isRename) {
          setOpenRenameModal(true);
        }
        // case: (res.error : true && res.remane: undefined) --> keep the modal open to display errors
      } else {
        handleModalClose();
      }
    });
  };

  const continueIngestSBT = () => {
    dispatch(ingestSBTAction(selectedDMT[0], activeDMT.bundleBaseId, me.email)).then(res => {
      if (!res.error) {
        handleModalClose();
      }
    });
  };

  const handleModalIngest = () => {
    if (!selectedDMT[0]?.trifactaTransformationId) continueIngestDMT();
    else continueIngestSBT();
  };

  const getRenameModalBody = () => {
    let renameBodyText = t(
      'Pages_Content_Library_StandardBundleList_Standard_Bundle_Transformation_Ingest_Modal_DMT_Rename_Body'
    ).replace('dmtName', environmentContentDMT[0].bundleName);
    renameBodyText = renameBodyText.replace('selectdEnvi', selectedEnvironment[0]?.name?.toUpperCase());

    return renameBodyText;
  };

  return (
    <Box>
      <Modal
        isOpen={ingestDMTOpen}
        onClose={handleModalClose}
        size={ModalSizes.MEDIUM}
        primaryButtonText={t(`Pages_Content_Library_StandardBundleList_DMT_Ingest_Modal_OK_Button`)}
        onPrimaryButtonClick={handleModalIngest}
        disablePrimaryButton={isFetchingEnvironments || isFetchingEnvContent || isIngestingDMT || !selectedDMT?.length}
        secondaryButtonText={t(`Pages_Content_Library_StandardBundleList_DMT_Ingest_Modal_CLOSE_Button`)}
        onSecondaryButtonClick={handleModalClose}
        dataInstance={`${COMPONENT_NAME}-DMT_INGEST-MODAL`}
      >
        <Box dataInstance={`${COMPONENT_NAME}-DMT_INGEST-MODAL-HEADER`}>
          <DMFieldContainer>
            <Header
              titleText={t(
                'Pages_Content_Library_StandardBundleList_Standard_Bundle_Transformation_Ingest_Modal_Header'
              )}
              pb={3}
            />
            <AlertHub
              alerts={[...selectIngestDMTErrors]}
              onClose={onErrorClose}
              dataInstance={`${COMPONENT_NAME}-DMT_INGEST-MODAL-ALERTHUB`}
            />
          </DMFieldContainer>
        </Box>

        <Box dataInstance={`${COMPONENT_NAME}-DMT_INGEST-MODAL-BODY`}>
          <Spinner
            spinning={isFetchingEnvironments || isFetchingEnvContent || isIngestingDMT}
            label={getSpinnerLabels()}
          >
            {openRenameModal ? (
              <Text type={TextTypes.BODY} fontWeight='s' mb={2}>
                {getRenameModalBody()}
              </Text>
            ) : (
              <Box>
                <DMFieldContainer>
                  <Text type={TextTypes.H4} fontWeight='m' mb={2}>
                    {t('Components_Modal_Ingest_Content_From_Environment_Label')}
                  </Text>

                  <Select
                    type={SelectTypes.SINGLE}
                    options={allEnvironments}
                    optionValueKey='name'
                    optionTextKey='name'
                    filtering
                    value={selectedEnvironment}
                    onChange={onChangeValue => {
                      fetchEnviContent(onChangeValue);
                    }}
                    placeholder={t('Components_Modal_Ingest_Content_Environment_Placeholder')}
                    emptyMessage={t(
                      'Pages_Content_Library_StandardBundleList_DMT_Ingest_Modal_Environment_EmptyMessage'
                    )}
                    dataInstance={`${COMPONENT_NAME}-DMT_INGEST-MODAL-BODY-ENVIRONMENT-SELECT`}
                  />
                </DMFieldContainer>

                <DMFieldContainer>
                  <Text type={TextTypes.H4} fontWeight='m' mb={2}>
                    {t(
                      'Pages_Content_Library_StandardBundleList_Standard_Bundle_Transformation_Ingest_Modal_DMT_Labels'
                    )}
                  </Text>
                  <Text type={TextTypes.CAPTION} fontWeight='s' mb={2}>
                    {t(
                      'Pages_Content_Library_StandardBundleList_Standard_Bundle_Transformation_Ingest_Modal_DMT_Caption'
                    )}
                  </Text>
                  <Select
                    disabled={!selectedEnvironment.length}
                    type={SelectTypes.SINGLE}
                    options={environmentContentDMT}
                    filtering
                    value={selectedDMT}
                    optionValueKey='name'
                    optionTextKey='name'
                    onChange={onChangeValue => {
                      setSelectedDMT(onChangeValue);
                    }}
                    placeholder={t(
                      'Pages_Content_Library_StandardBundleList_Standard_Bundle_Transformation_Ingest_Modal_DMT_Placeholder'
                    )}
                    emptyMessage={t(
                      'Pages_Content_Library_StandardBundleList_Standard_Bundle_Transformation_Ingest_Modal_DMT_EmptyMessage'
                    )}
                    dataInstance={`${COMPONENT_NAME}-DMT_INGEST-MODAL-BODY-DMT-SELECT`}
                    showTrifactaIcon
                  />
                </DMFieldContainer>
              </Box>
            )}
          </Spinner>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalIngestDmt;
