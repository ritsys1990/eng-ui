import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  AlertTypes,
  Modal,
  ModalSizes,
  Flex,
  Text,
  TextTypes,
  Radio,
  Alert,
  Spinner,
  Box,
  Select,
  SelectTypes,
} from 'cortex-look-book';
import useTranslation, { nameSpaces } from '../../../hooks/useTranslation';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import { submitFileSharingRequest } from '../../../store/dataExchange/actions';
import { checkFileSize } from '../../../store/workpaperProcess/step3/actions';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WpOutputSendToOmniaModal = ({ isModalOpen, handleClose, engagement, selectedOutput }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [omniaLoader, setOmniaLoader] = useState(true);
  const [fileLimit, setFileLimit] = useState(500);
  const [isTrialBalance, setIsTrialBalance] = useState(false);
  const [selectedOmniaEngId, setSelectedOmniaEngId] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    async function checkFileSizeLimit() {
      setOmniaLoader(true);
      if (selectedOutput && isModalOpen) {
        const { dataLakePath } = selectedOutput;
        if (dataLakePath) {
          const size = await dispatch(checkFileSize(dataLakePath));
          setFileLimit(size);
        }
      }
      setOmniaLoader(false);
    }
    checkFileSizeLimit();
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsTrialBalance(false);
    setIsAlertOpen(false);
    setSelectedOmniaEngId([]);
    handleClose();
  };

  const handleSendToOmnia = async () => {
    setOmniaLoader(true);
    const data = {
      cortexEngagementId: selectedOutput?.engagementId,
      omniaEngagementId:
        engagement?.linkedOmniaEngagements.length > 1
          ? selectedOmniaEngId[0]?.omniaEngagementId
          : engagement?.linkedOmniaEngagements[0]?.omniaEngagementId,
      filePath: selectedOutput?.dataLakePath || selectedOutput?.nodePath,
      outputId: selectedOutput?.id,
      fileName: selectedOutput?.name,
      isTrialBalance,
    };
    await dispatch(submitFileSharingRequest(data, selectedOutput?.workpaperId));
    handleCloseModal();

    setOmniaLoader(false);
  };

  const selectIsTrialBalance = selected => {
    setIsTrialBalance(selected);
    setIsAlertOpen(selected);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <Flex>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size={ModalSizes.MEDIUM}
        onPrimaryButtonClick={handleSendToOmnia}
        onSecondaryButtonClick={handleCloseModal}
        primaryButtonText={t('Send', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        dataInstance={`${PAGE_NAME}_SendToOmniaModal`}
        disablePrimaryButton={
          fileLimit > 500 ||
          omniaLoader ||
          (engagement?.linkedOmniaEngagements &&
            engagement?.linkedOmniaEngagements.length > 1 &&
            selectedOmniaEngId.length === 0)
        }
        disableSecondaryButton={false}
      >
        <Spinner spinning={omniaLoader}>
          <Box>
            <Flex>
              <Text type={TextTypes.H2} fontWeight='s' color='black'>
                {t('Pages_WorkpaperProcess_Output_SendToOmnia')}
              </Text>
            </Flex>
            {fileLimit > 500 ? (
              <Alert
                message={t('Pages_WorkpaperProcess_Output_SendToOmnia_SizeInMB_Warning')}
                type={AlertTypes.ERROR}
                mb={5}
                mt={5}
              />
            ) : (
              <>
                <Flex mt={8} mb={6}>
                  <Text type={TextTypes.BODY}>{t('Pages_WorkpaperProcess_Output_SendToOmnia_TBData')}</Text>
                  <Radio
                    name='IsTrialBalance'
                    ml={5}
                    value='true'
                    checked={isTrialBalance}
                    onOptionSelected={() => selectIsTrialBalance(true)}
                    dataInstance={`${PAGE_NAME}_TB`}
                  />
                  <Text type={TextTypes.BODY}>{t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}</Text>
                  <Radio
                    name='IsTrialBalance'
                    ml={5}
                    value='false'
                    checked={!isTrialBalance}
                    onOptionSelected={() => selectIsTrialBalance(false)}
                    dataInstance={`${PAGE_NAME}_TB`}
                  />
                  <Text type={TextTypes.BODY}>{t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}</Text>
                </Flex>
                {isAlertOpen && (
                  <Alert
                    message={t('Pages_WorkpaperProcess_Output_SendToOmnia_TB_Message')}
                    type={AlertTypes.WARNING}
                    mb={5}
                    onClose={() => handleAlertClose()}
                    dataInstance={`${PAGE_NAME}_Alert`}
                  />
                )}
                {engagement?.linkedOmniaEngagements && engagement?.linkedOmniaEngagements.length > 1 ? (
                  <Box mb={8} mt={8}>
                    <Select
                      type={SelectTypes.SINGLE}
                      label={t('Pages_WorkpaperProcess_Output_SelectOmniaEngagement')}
                      options={engagement.linkedOmniaEngagements}
                      value={selectedOmniaEngId}
                      filtering
                      loading={false}
                      required
                      onChange={onChangeValue => setSelectedOmniaEngId(onChangeValue)}
                      emptyMessage={t('Pages_WorkpaperProcess_Output_SelectOmniaEngagement_EmptyMessage')}
                      disabled={false}
                      optionValueKey='omniaEngagementId'
                      optionTextKey='omniaEngagementName'
                      dataInstance={`${PAGE_NAME}_Select`}
                    />
                  </Box>
                ) : null}
              </>
            )}
          </Box>
        </Spinner>
      </Modal>
    </Flex>
  );
};

export default WpOutputSendToOmniaModal;
