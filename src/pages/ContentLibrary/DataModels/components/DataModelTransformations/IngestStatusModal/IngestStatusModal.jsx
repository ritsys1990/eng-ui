import React, { useEffect } from 'react';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import {
  Box,
  Flex,
  TextTypes,
  Text,
  Modal,
  ModalSizes,
  Table,
  StateView,
  Icon,
  IconTypes,
  Tooltip,
  TooltipPosition,
  Spinner,
} from 'cortex-look-book';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import {
  getDMTIngestionStatus,
  getSBTIngestionStatus,
} from '../../../../../../store/contentLibrary/datamodels/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getIconTypes } from '../../../utils/DataModelsHelper';
import LocalizedDate from '../../../../../../components/LocalizedDate/LocalizedDate';
import { INGEST_TYPES } from '../../../constants/constants';

const IngestStatusModal = props => {
  const { isOpen, handleClose, selectedDM, ingestType = INGEST_TYPES.DMT } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFetchingDMTsIngestStatus = useSelector(contentLibraryDMSelectors.isFetchingDMTsIngestStatus);
  const dmtsIngestionStatus = useSelector(contentLibraryDMSelectors.dmtsIngestionStatus);

  const PAGE_NAME = 'INGEST_STATUS';

  useEffect(() => {
    if (isOpen && selectedDM) {
      if (ingestType === INGEST_TYPES.DMT) {
        dispatch(getDMTIngestionStatus(selectedDM.nameTech));
      } else {
        dispatch(getSBTIngestionStatus(selectedDM?.id));
      }
    }
  }, [isOpen]);

  const headers = [
    {
      title: '',
      width: '1%',
      key: 'type',
      render: type => (
        <Flex>
          {type === 1 && (
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.RIGHT}
              tooltipContent={t(`Pages_Content_Library_AddNewDMTModal_${ingestType}_TrifactaTrifactaTooltip`)}
              showOnHover
            >
              <Icon type={IconTypes.AUTO_CONNECTOR_ON} height={28} width={28} color='black' />
            </Tooltip>
          )}
        </Flex>
      ),
    },
    {
      title: t(`Pages_Ingest_${ingestType}_Status_Modal_Headers_Name`),
      key: 'name',
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-DMT-NameTech-${row.id}`}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-DMT-NameTech-${row.id}-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Ingest_DMTs_Status_Modal_Headers_Status'),
      key: 'status',
      render: (status, row) => (
        <Flex cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-DMT-${row.id}-description`}>
          <Icon type={getIconTypes(status, t)?.type} height={28} width={28} color={getIconTypes(status, t)?.color} />

          <Text charLimit={40} pt={3}>
            {getIconTypes(status, t)?.status}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Ingest_DMTs_Status_Modal_Headers_FromEnv'),
      key: 'fromEnv',
      render: (fromEnv, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-DMT-${row.id}-fromEnv`}>
          <Text charLimit={40}>
            {fromEnv} &nbsp; {row?.lastUpdatedAt ? <LocalizedDate date={row.lastUpdatedAt} isTimeStamp /> : ''}
          </Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Ingest_DMTs_Status_Modal_Headers_Details'),
      key: 'errorMessage',
      render: (errorMessage, row) => (
        <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-DMT-${row.id}-description`}>
          <Text charLimit={40}>{row?.status?.indexOf('Failed') > -1 ? errorMessage : ''}</Text>
        </Box>
      ),
    },
  ];

  const closeModal = () => {
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      onPrimaryButtonClick={closeModal}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.EXTRA_LARGE}
      dataInstance={`${PAGE_NAME}-Modal`}
    >
      <Spinner spinning={isFetchingDMTsIngestStatus}>
        <Box width='100%'>
          <Flex pb={5}>
            <Text type={TextTypes.H2} fontWeight='s' dataInstance={`${PAGE_NAME}-Header`}>
              {t(`Pages_Ingest_${ingestType}_Status_Header_Label`)}
            </Text>
          </Flex>

          <Box pb={5}>
            {dmtsIngestionStatus?.length > 0 && (
              <Table rows={dmtsIngestionStatus} headers={headers} dataInstance={`${PAGE_NAME}-Table`} />
            )}

            {dmtsIngestionStatus?.length <= 0 && (
              <StateView
                title={t(`Pages_Ingest_${ingestType}_Status_Modal_Headers_None_Ingested`)}
                dataInstance={`${PAGE_NAME}-DMTIngestion-NoRecords`}
                iconWidth={120}
                height={150}
              />
            )}
          </Box>
        </Box>
      </Spinner>
    </Modal>
  );
};

export default IngestStatusModal;
