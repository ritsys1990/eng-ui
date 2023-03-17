import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useTranslation from '../../../hooks/useTranslation';
import { getLatestRunDate } from '../utils/WorkPaperProcess.utils';
import { Flex, Alert, AlertTypes } from 'cortex-look-book';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { DATA_REQUEST_STATUS } from './InputDataRequestStatus/constants/InputDataRequestStatus.const';

const ScheduleAlert = ({ workpaperId, shouldAutoDmt }) => {
  const [showAlertSchedule, setShowAlertSchedule] = useState(true);
  const [latestRunFlowDate, setLatestRunFlowDate] = useState(null);
  const [schedulesExtracted, setSchedulesExtracted] = useState([]);
  const overallProgress = useSelector(WPProcessingSelectors.overallProgress);
  const inputs = useSelector(wpStep1Selectors.selectInputs);

  const { t } = useTranslation();

  const COMPONENT_NAME = 'ScheduleAlert';

  useEffect(() => {
    if (inputs != null) {
      const events = [];

      inputs.forEach(input => {
        if (input.dataRequestStatus) {
          const eventsFromInput = input.dataRequestStatus[0];

          // Remove first/default event
          if (
            eventsFromInput.length >= 2 &&
            eventsFromInput.every(event => event.status === DATA_REQUEST_STATUS.TRANSFER_COMPLETE)
          ) {
            // Check for addittional events
            const inputEvents = eventsFromInput.map(data => {
              return {
                inputName: input.name,
                createdDate: new Date(data.createdDate),
              };
            });
            events.push(inputEvents);
          }
        }
      });

      setSchedulesExtracted(events);
    }
  }, [inputs]);

  useEffect(() => {
    if (overallProgress != null) {
      const latestRunDate = getLatestRunDate(overallProgress.get(workpaperId)?.recipes.map(r => r));
      setLatestRunFlowDate(new Date(latestRunDate));
    }
  }, [overallProgress, workpaperId]);

  const getScheduleAlerts = () => {
    if (schedulesExtracted?.length > 0) {
      const alerts = [];

      schedulesExtracted.forEach(group => {
        const eventsGroup = group;

        eventsGroup.every(e => {
          const message = shouldAutoDmt
            ? t('Pages_WorkpaperProcess_Step1_Alert_EventExtracted_ForToggleOn').replace('inputName', e.inputName)
            : t('Pages_WorkpaperProcess_Step1_Alert_EventExtracted_ForToggleOff').replace('inputName', e.inputName);

          const showAlert = e.createdDate?.getTime() > latestRunFlowDate?.getTime();

          if (showAlertSchedule && showAlert) {
            const component = (
              <Flex alignItems='center'>
                <Alert
                  type={AlertTypes.INFO}
                  message={message}
                  dataInstance={`${COMPONENT_NAME}-TrifactaShowOutdatedVersionInfo`}
                  mb={5}
                  onClose={() => setShowAlertSchedule(false)}
                  charLimit={null}
                />
              </Flex>
            );

            alerts.push(component);

            return false;
          }

          return true;
        });
      });

      return alerts;
    }

    return null;
  };

  return getScheduleAlerts();
};

export default ScheduleAlert;
