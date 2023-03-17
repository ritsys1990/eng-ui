import React, { useContext } from 'react';
import env from 'env';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  IconCard,
  IconTypes,
  Link,
  Intent,
  Text,
  Table,
  Modal,
  ModalSizes,
  TextTypes,
  Tooltip,
  TooltipPosition,
  ProgressBarTypes,
} from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { Box, Flex } from 'reflexbox';
import useTranslation from '../../hooks/useTranslation';
import LocalizedDate from '../LocalizedDate/LocalizedDate';

dayjs.extend(localizedFormat);

const COMPONENT_NAME = 'FlowJobsListModal';

const FlowJobsListModal = ({ jobs, isOpen, onClose }) => {
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();

  const parseJobStatusMessage = message => {
    switch (message) {
      case t('Pages_Trifacta_Run_Job_Status_Running'):
        return Intent.WAITING;
      case t('Pages_Trifacta_Run_Job_Status_NotStarted'):
        return Intent.GUIDANCE;
      case t('Pages_Trifacta_Run_Job_Status_Error'):
        return Intent.ERROR;
      case t('Pages_Trifacta_Run_Job_Status_Success'):
        return Intent.SUCCESS;
      default:
        return Intent.WAITING;
    }
  };

  const displayJobStatusTitle = message => {
    switch (message) {
      case ProgressBarTypes.RUNNING:
        return t('Pages_WorkpaperProcess_Step2_Progress_Running_Label');
      case ProgressBarTypes.NOTSTARTED:
        return t('Pages_TrifactaWorkpaperProcess_Step2_Progress_NotStarted_Label');
      case ProgressBarTypes.RUNNING_WITH_ERRORS:
        return t('Pages_WorkpaperProcess_Step2_Progress_Running_With_Error_Label');
      case ProgressBarTypes.ERROR:
        return t('Pages_WorkpaperProcess_Step2_Progress_Error_Label');
      case ProgressBarTypes.FINISHED:
        return t('Pages_WorkpaperProcess_Step2_Progress_Success_Label');
      case ProgressBarTypes.PARTIALLY_COMPLETE:
        return t('Pages_WorkpaperProcess_Step2_Progress_Partially_Success_Label');
      case ProgressBarTypes.QUEUED:
        return t('Pages_WorkpaperProcess_Step2_Progress_Queued_Label');
      default:
        return t('Pages_TrifactaWorkpaperProcess_Step2_Progress_NotStarted_Label');
    }
  };

  const headers = [
    {
      title: t('Pages_TrifactaWorkpaperProcess_JobStatusListModalContent_HeaderOutput'),
      key: 'output',
      width: '35%',
      headerStyles: {
        paddingLeft: theme.space[8] + 12,
      },
      render: (name, row) => (
        <Box>
          {row && (
            <Flex height='75px' alignItems='center' key={row.id}>
              <Link
                target='_blank'
                to={`${env.TRIFACTA_URL}/jobs/${row.id}${
                  row.status === t('Pages_Trifacta_Run_Job_Status_Success') ? '?activeTab=profile' : ''
                }`}
                key={row.id}
                external
              >
                <Text>{row.outputName}</Text>
              </Link>
            </Flex>
          )}
        </Box>
      ),
    },
    {
      title: t('Pages_TrifactaWorkpaperProcess_JobStatusListModalContent_HeaderJob'),
      key: 'job',
      width: '10%',
      headerStyles: {
        paddingLeft: theme.space[8] + 12,
      },
      render: (name, row) => (
        <Box>
          {row && (
            <Flex height='75px' alignItems='center' key={row.id}>
              <Text>{row.id ? row.id : ''}</Text>
            </Flex>
          )}
        </Box>
      ),
    },
    {
      title: t('Pages_TrifactaWorkpaperProcess_JobStatusListModalContent_HeaderLastRun'),
      key: 'lastRun',
      width: '20%',
      headerStyles: {
        paddingLeft: theme.space[8] + 12,
      },
      render: (name, row) => (
        <Box>
          {row && (
            <Flex height='75px' alignItems='center' key={row.id}>
              <Text>{row.runEndDate ? <LocalizedDate date={row.runEndDate} isTimeStamp /> : ''}</Text>
            </Flex>
          )}
        </Box>
      ),
    },
    {
      title: t('Pages_TrifactaWorkpaperProcess_JobStatusListModalContent_HeaderStatus'),
      key: 'status',
      width: '15%',
      headerStyles: {
        paddingLeft: theme.space[8] + 12,
      },
      render: (name, row) => (
        <Box>
          {row && (
            <Tooltip
              direction={TooltipPosition.LEFT}
              showOnHover={
                (row.status === ProgressBarTypes.QUEUED && row.queuePosition > 0) ||
                (row.status === ProgressBarTypes.ERROR && row.errorReason)
              }
              dataInstance={`${COMPONENT_NAME}-JobStatusTooltip`}
              tooltipContent={
                row.status === ProgressBarTypes.ERROR && row.errorReason
                  ? `${t(`Components_${COMPONENT_NAME}_TOOLTIP_${row.errorReason}`)}`
                  : `${t(`Components_${COMPONENT_NAME}_TOOLTIP_QUEUE_POSITION`)} ${row.queuePosition}`
              }
            >
              <Flex minHeight='75px' alignItems='center' key={row.id}>
                <IconCard
                  cursor='default'
                  width='100%'
                  loading={parseJobStatusMessage(row.status) === Intent.WAITING}
                  size='m'
                  title={displayJobStatusTitle(row.status)}
                  iconType={IconTypes.DOCUMENT}
                  state={
                    parseJobStatusMessage(row.status) !== Intent.GUIDANCE ? parseJobStatusMessage(row.status) : null
                  }
                />
              </Flex>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const modalContent = () => (
    <Box>
      <Text type={TextTypes.H2} fontWeight='l' mb={9}>
        {t('Pages_TrifactaWorkpaperProcess_JobStatusListModalContent_Title')}
      </Text>
      <Table rows={jobs || []} headers={headers} dataInstance={`${COMPONENT_NAME}`} />
      {!jobs && <Text>{t('Pages_TrifactaWorkpaperProcess_JobStatusListModalContent_NoContent')}</Text>}
    </Box>
  );

  return (
    <Modal isOpen={isOpen} size={ModalSizes.LARGE} onClose={onClose} dataInstance={`${COMPONENT_NAME}`}>
      {modalContent()}
    </Modal>
  );
};

export default FlowJobsListModal;
