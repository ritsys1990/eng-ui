import React, { useCallback, useState } from 'react';
import { Modal, ModalSizes, Text, TextTypes, Box, Spinner } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { acceptTOU, getUnacceptedTOU } from '../../store/security/actions';
import { TRANSLATION_KEY, TOU_TYPES, COMPONENT_NAME } from './constants/TOUModal.const';
import PDFViewer from '../PDFViewer/PDFViewer';
import { securitySelectors } from '../../store/security/selectors';
import env from 'env';
import useTranslation from '../../hooks/useTranslation';
import { logoutWrapper } from '../../utils/logoutHelper';

const TOUModal = props => {
  const { t } = useTranslation();
  const { touName } = props;
  const dispatch = useDispatch();
  const isFetching = useSelector(securitySelectors.fetchingTOU);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleDecline = useCallback(() => {
    logoutWrapper();
  }, []);

  const handleAccept = useCallback(() => {
    dispatch(acceptTOU(touName)).then(() => {
      dispatch(getUnacceptedTOU());
    });
  }, [dispatch, touName]);

  const getTOU = useCallback(tou => {
    let url = '';
    let pdfName = '';
    switch (tou) {
      case TOU_TYPES.GLOBAL_EXTRACTION:
        url = `/${env.ENVIRONMENT_NAME}/static/EXTRACTION TOU.pdf`;
        pdfName = 'EXTRACTION TOU.pdf';
        break;
      case TOU_TYPES.CORTEX11:
      default:
        url = `/${env.ENVIRONMENT_NAME}/static/CORTEX TOU.pdf`;
        pdfName = 'TOU.pdf';
        break;
    }

    return <PDFViewer url={url} pdfName={pdfName} setIsLoadingFile={setIsLoadingFile} />;
  }, []);

  return (
    <Modal
      isOpen
      size={ModalSizes.MEDIUM}
      onPrimaryButtonClick={handleAccept}
      primaryButtonText={t(`${TRANSLATION_KEY}_Accept`)}
      onSecondaryButtonClick={handleDecline}
      secondaryButtonText={t(`${TRANSLATION_KEY}_Decline`)}
      disablePrimaryButton={isFetching || isLoadingFile}
      disableSecondaryButton={isFetching || isLoadingFile}
      dataInstance={COMPONENT_NAME}
    >
      <Text type={TextTypes.H2} fontWeight='l' mb={9}>
        {t(`${TRANSLATION_KEY}_Title`)}
      </Text>
      <Spinner spinning={isLoadingFile} label='' size={32} pathSize={4}>
        <Box mb={9}>{getTOU(touName)}</Box>
      </Spinner>
    </Modal>
  );
};

export default TOUModal;
