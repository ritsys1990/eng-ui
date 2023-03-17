import React, { useEffect, useState } from 'react';
import { Flex, Modal, ModalSizes, Spinner, Text, TextTypes, Timeline } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { WpHistoryActions } from '../../store/wpHistory/actionTypes';
import { getWpRevisions } from '../../store/wpHistory/actions';
import { wpHistorySelectors } from '../../store/wpHistory/slectors';
import useTranslation from '../../hooks/useTranslation';
import LocalizedDate from '../LocalizedDate/LocalizedDate';

const DEFAULT_STATUS = 'InProgress';
export const COMPONENT_NAME = 'WorkpaperHistory';

const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');

const getStatusColor = status => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'publish':
      return 'green';
    case 'completed':
      return 'green';
    case 'review':
      return 'yellow';
    case 'submittedforreview':
      return 'yellow';
    default:
      return 'blue';
  }
};

const WorkpaperHistoryModal = ({ onClose, workpaper }) => {
  // Current state.
  const firstEntry = {
    creationTime: workpaper.creationDate,
    status: DEFAULT_STATUS,
    createdby: workpaper.createdBy,
  };

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [history, setHistory] = useState([...(workpaper.statusHistory || []).reverse(), firstEntry]);

  const isLoading = useSelector(wpHistorySelectors.isLoading);
  const data = useSelector(wpHistorySelectors.data);

  useEffect(() => {
    if (!workpaper || !workpaper.statusHistory) {
      dispatch(getWpRevisions(workpaper.id));
    }

    return () => {
      dispatch({ type: WpHistoryActions.RESET });
    };
  }, [dispatch, workpaper]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    if (data && data.statusHistory) {
      setHistory([...(data.statusHistory || []).reverse(), firstEntry]);
    }
  }, [data]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onClickOutside={handleClose}
      onPrimaryButtonClick={() => onClose()}
      primaryButtonText={t('Components_WorkpaperHistoryModal_PrimaryBtnText')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isLoading}>
        {!isLoading ? (
          <>
            <Text type={TextTypes.H2} fontWeight='l'>
              <Text ellipsisTooltip tooltipWrapperWidth='inherit' forwardedAs='span'>
                {workpaper?.name}
              </Text>
              <Text forwardedAs='span'> {t('Components_WorkpaperHistoryModal_History')}</Text>
            </Text>
            <Timeline mt={3} px={2}>
              {history.map((entry, index) => {
                const status = entry.status || DEFAULT_STATUS;

                return (
                  <Timeline.Item key={index} color={getStatusColor(status)}>
                    <div key={index}>
                      <Text type={TextTypes.CAPTION} color='gray'>
                        {entry.creationTime && <LocalizedDate date={entry.creationTime} isTimeStamp />}
                      </Text>
                      <Text type={TextTypes.H4} fontWeight='m'>
                        {splitByCapital(status)}
                      </Text>
                      <Text type={TextTypes.CAPTION} color='blue'>
                        {entry.createdby}
                      </Text>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </>
        ) : (
          <Flex height={200} width='100%' />
        )}
      </Spinner>
    </Modal>
  );
};

WorkpaperHistoryModal.defaultProps = {
  workpaper: {},
};

export default WorkpaperHistoryModal;
