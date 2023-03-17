import React, { useEffect } from 'react';
import { Modal, ModalSizes, Spinner, Text, TextTypes, Timeline, StateView } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { dataExchangeSelectors } from '../../../store/dataExchange/selectors';
import { getSendToOmniaOutputHistory } from '../../../store/dataExchange/actions';
import { sendWPOutputStatusTypes } from '../constants/WorkPaperOutput.constants';
import useTranslation from 'src/hooks/useTranslation';
import LocalizedDate from '../../../components/LocalizedDate/LocalizedDate';

export const COMPONENT_NAME = 'OutputHistory';

const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');

const getStatusColor = status => {
  switch (status) {
    case sendWPOutputStatusTypes.SUCCESS:
      return 'green';
    case sendWPOutputStatusTypes.IN_PROGRESS:
      return 'yellow';
    default:
      return 'red';
  }
};

const SendToOmniaHistoryModal = ({ handleClose, output, isModalOpen }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const history = useSelector(dataExchangeSelectors.sendToOmniaOutputHistory);
  const isLoading = useSelector(dataExchangeSelectors.isFetchingSendToOmniaOutputHistory);

  useEffect(() => {
    if (isModalOpen) {
      dispatch(getSendToOmniaOutputHistory(output.id));
    }
  }, [output.id, isModalOpen]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      onClickOutside={handleClose}
      onPrimaryButtonClick={handleClose}
      primaryButtonText={t('Components_WorkpaperHistoryModal_PrimaryBtnText')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isLoading}>
        {!isLoading && history?.length ? (
          <>
            <Text type={TextTypes.H2} fontWeight='l'>
              <Text ellipsisTooltip tooltipWrapperWidth='inherit' forwardedAs='span'>
                {output?.name}
              </Text>
              <Text forwardedAs='span'> {t('Components_WorkpaperHistoryModal_History')}</Text>
            </Text>
            <Timeline mt={3} px={2}>
              {history
                .sort((a, b) => new Date(b.lastUpdatedDate) - new Date(a.lastUpdatedDate))
                .map((entry, index) => {
                  const { status } = entry;

                  return (
                    <Timeline.Item key={index} color={getStatusColor(status)}>
                      <div key={index}>
                        <Text type={TextTypes.CAPTION} color='gray'>
                          {entry.lastUpdatedDate && <LocalizedDate date={entry.lastUpdatedDate} isTimeStamp />}
                        </Text>
                        <Text type={TextTypes.H4} fontWeight='m'>
                          {splitByCapital(status)}
                        </Text>
                        <Text type={TextTypes.CAPTION} color='blue'>
                          {entry.createBy}
                        </Text>
                      </div>
                    </Timeline.Item>
                  );
                })}
            </Timeline>
          </>
        ) : (
          <StateView title={t('Components_No_History_Output')} />
        )}
      </Spinner>
    </Modal>
  );
};

SendToOmniaHistoryModal.defaultProps = {
  output: {},
};

export default SendToOmniaHistoryModal;
