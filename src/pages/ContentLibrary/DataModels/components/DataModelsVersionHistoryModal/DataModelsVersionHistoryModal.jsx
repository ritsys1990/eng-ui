import React, { useEffect, useState } from 'react';
import { Flex, Modal, ModalSizes, Spinner, Text, TextTypes, Timeline } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { getDatamodelVersionsHistoryById } from '../../../../../store/contentLibrary/datamodels/actions';
import { contentLibraryDMSelectors } from '../../../../../store/contentLibrary/datamodels/selectors';
import useTranslation from '../../../../../hooks/useTranslation';
import LocalizedDate from '../../../../../components/LocalizedDate/LocalizedDate';
import { CLDataModelsActionTypes } from '../../../../../store/contentLibrary/datamodels/actionTypes';
import { DM_VERSION_HISTORY_STATUS } from '../../constants/constants';

export const COMPONENT_NAME = 'DataModelsVersionHistory';

const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');

const getStatusColor = status => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'published':
      return 'green';
    case 'readyforreview':
      return 'yellow';
    case 'rejected':
      return 'red';
    case 'deactivated':
      return 'red';
    default:
      return 'blue';
  }
};

const DataModelsVersionHistoryModal = ({ onClose, datamodel }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [history, setHistory] = useState([...(datamodel.stateHistory || [])]);

  const isLoading = useSelector(contentLibraryDMSelectors.isHistoryLoading);
  const data = useSelector(contentLibraryDMSelectors.dMHistoryData);

  useEffect(() => {
    if (!datamodel || !datamodel.stateHistory) {
      dispatch(getDatamodelVersionsHistoryById(datamodel.id));
    }

    return () => {
      dispatch({ type: CLDataModelsActionTypes.GET_DATAMODEL_HISTORY_ERROR_RESET });
    };
  }, [dispatch, datamodel.id]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    if (data && data.stateHistory) {
      setHistory([...(data.stateHistory || [])]);
    }
  }, [data]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
                {datamodel?.nameTech}
              </Text>
              <Text forwardedAs='span'> {t('Components_WorkpaperHistoryModal_History')}</Text>
            </Text>
            <Timeline mt={3} px={2}>
              {history.map((entry, index) => {
                const status = entry.publishState;

                return (
                  <Timeline.Item key={index} color={getStatusColor(status)}>
                    <div key={index}>
                      <Text type={TextTypes.CAPTION} color='gray'>
                        {entry.timestamp && <LocalizedDate date={entry.timestamp} isTimeStamp />}
                      </Text>
                      <Text type={TextTypes.H4} fontWeight='m'>
                        {splitByCapital(status)}
                      </Text>
                      <Text type={TextTypes.CAPTION} color='blue'>
                        {entry.createdBy}
                      </Text>
                      {entry.sourceEnv && (
                        <Text type={TextTypes.CAPTION} color='gray'>
                          {t('Components_DatamodelVersionHistory_SourceEnviroment')} {entry.sourceEnv}
                        </Text>
                      )}
                      {entry.sourceEnv && (
                        <Text type={TextTypes.CAPTION} color='gray'>
                          {t('Components_DatamodelVersionHistory_SourceEnviroment_Version')} {entry.sourceEnvVersion}
                        </Text>
                      )}
                      <Text type={TextTypes.CAPTION} color='gray'>
                        {status === DM_VERSION_HISTORY_STATUS.REJECTED
                          ? `${t(`Components_DatamodelVersionHistory_Rejected_Comments`)} ${entry.comment}`
                          : ''}
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

DataModelsVersionHistoryModal.defaultProps = {
  datamodel: {},
};

export default DataModelsVersionHistoryModal;
