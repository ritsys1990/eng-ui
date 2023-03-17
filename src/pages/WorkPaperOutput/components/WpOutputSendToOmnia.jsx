import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertTypes,
  Button,
  ButtonTypes,
  IconTypes,
  useInterval,
  Icon,
  Flex,
  Tooltip,
  TooltipPosition,
  Box,
} from 'cortex-look-book';
import useTranslation from '../../../hooks/useTranslation';
import { PAGE_NAME, sendWPOutputStatusTypes, errorCodes } from '../constants/WorkPaperOutput.constants';
import { dataExchangeSelectors } from '../../../store/dataExchange/selectors';
import { wpStep3Selectors } from '../../../store/workpaperProcess/step3/selectors';
import { engagementSelectors } from '../../../store/engagement/selectors';
import { checkFileSharingRequestStatusById } from '../../../store/dataExchange/actions';
import { addGlobalError } from '../../../store/errors/actions';
import WpOutputSendToOmniaModal from './WpOutputSendToOmniaModal';
import SendToOmniaHistoryModal from './SendToOmniaHistoryModal';

const REFRESH_INTERVAL = 5 * 1000;

// eslint-disable-next-line sonarjs/cognitive-complexity
const WpOutputSendToOmnia = ({ output, isConnectedToOmnia, workpaperId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [stopPolling, setStopPolling] = useState(true);
  const outputs = useSelector(wpStep3Selectors.selectOutputs(workpaperId));
  const sendWPOutputStatus = useSelector(dataExchangeSelectors.sendWPOutputStatus);
  const isFetchingWPOutputStatus = useSelector(dataExchangeSelectors.isFetchingWPOutputStatus);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const selectedOutput = outputs?.dataTable?.find(omniaOutput => output.id === omniaOutput.id);

  useInterval(
    () => {
      if (!isFetchingWPOutputStatus && output?.omniaEngagementFileId) {
        dispatch(checkFileSharingRequestStatusById(output?.omniaEngagementFileId));
      }
    },
    !stopPolling ? REFRESH_INTERVAL : null
  );

  useEffect(() => {
    if (output.omniaEngagementFileId) {
      dispatch(checkFileSharingRequestStatusById(output?.omniaEngagementFileId));
    }
  }, [output]);

  useEffect(() => {
    if (sendWPOutputStatus?.outputId === output.id) {
      switch (sendWPOutputStatus?.status) {
        case sendWPOutputStatusTypes.IN_PROGRESS:
          setStopPolling(false);
          break;
        case sendWPOutputStatusTypes.FAILED:
          dispatch(
            addGlobalError({
              type: AlertTypes.ERROR,
              message: sendWPOutputStatus?.errorCode
                ? t(errorCodes[sendWPOutputStatus?.errorCode])
                : sendWPOutputStatus?.failedReason,
            })
          );
          setStopPolling(true);
          const tooltipDetail = {
            tooltipContent: t('Pages_WorkpaperProcess_Output_SendToOmniaFail'),
            color: 'red',
            iconType: IconTypes.NOTIFICATIONS_ERROR,
          };
          setStatusMessage(tooltipDetail);
          break;
        case sendWPOutputStatusTypes.SUCCESS:
          setStopPolling(true);
          const messageDetail = {
            tooltipContent: t('Pages_WorkpaperProcess_Output_SendToOmniaSucess'),
            color: 'green',
            iconType: IconTypes.SUCCESS,
          };
          setStatusMessage(messageDetail);
          break;
        default:
          break;
      }
    }
  }, [sendWPOutputStatus]);

  const handleClose = () => {
    setIsModalOpen(false);
    setIsHistoryModalOpen(false);
  };

  const handleOpen = async () => {
    setIsModalOpen(true);
  };
  const handleOpenHistory = async () => {
    setIsHistoryModalOpen(true);
  };

  return (
    <Flex>
      <Button
        disabled={
          !isConnectedToOmnia ||
          (output.omniaEngagementFileId && sendWPOutputStatus?.status === sendWPOutputStatusTypes.IN_PROGRESS)
        }
        type={ButtonTypes.LINK}
        iconWidth={20}
        icon={IconTypes.EXTERNAL_TAB}
        mr={20}
        onClick={handleOpen}
        dataInstance={`${PAGE_NAME}_SendToOmnia`}
      >
        {t(
          `Pages_WorkpaperProcess_Output_SendToOmnia${
            output.omniaEngagementFileId && sendWPOutputStatus?.status === sendWPOutputStatusTypes.IN_PROGRESS
              ? '_InProgress'
              : ''
          }`
        )}
      </Button>
      {(sendWPOutputStatus?.status === sendWPOutputStatusTypes.FAILED ||
        sendWPOutputStatus?.status === sendWPOutputStatusTypes.SUCCESS) && (
        <Box mr={20}>
          <Tooltip
            showOnHover
            tooltipContent={statusMessage ? statusMessage.tooltipContent : ''}
            display='inline-block'
            direction={TooltipPosition.TOP}
            dataInstance={`${PAGE_NAME}_Tooltip`}
          >
            {statusMessage ? (
              <Icon
                type={statusMessage.iconType}
                size={20}
                color={statusMessage ? statusMessage.color : ''}
                dataInstance={`${PAGE_NAME}_Icon`}
              />
            ) : null}
          </Tooltip>
        </Box>
      )}
      <Button
        type={ButtonTypes.FLAT}
        icon={IconTypes.CLOCK}
        iconWidth={20}
        iconColor='blue'
        onClick={handleOpenHistory}
        dataInstance={`${PAGE_NAME}-History`}
      />
      <WpOutputSendToOmniaModal
        isModalOpen={isModalOpen}
        handleClose={handleClose}
        output={output}
        isConnectedToOmnia={isConnectedToOmnia}
        engagement={engagement}
        selectedOutput={selectedOutput}
      />
      <SendToOmniaHistoryModal isModalOpen={isHistoryModalOpen} handleClose={handleClose} output={output} />
    </Flex>
  );
};

export default WpOutputSendToOmnia;
