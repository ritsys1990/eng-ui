import React, { useEffect, useState, useCallback } from 'react';
import env from 'env';
import { useSelector, useDispatch } from 'react-redux';
import useTranslation from '../../../../../hooks/useTranslation';
import {
  Text,
  Flex,
  Box,
  IconTypes,
  TextTypes,
  Table,
  Icon,
  Container,
  TooltipPosition,
  Tooltip,
  Spinner,
  StateView,
  ButtonTypes,
  Button,
  Link,
  PopoverOrigin,
  Popover,
  ContextMenu,
} from 'cortex-look-book';
import { PIPELINE_TYPE, CONTEXT_MENU_OPTIONS, STATUS, WP_STATUS } from '../../constants/constants';
import { CLPipelinesSelectors } from '../../../../../store/contentLibrary/pipelines/selectors';
import {
  getCLPipelines,
  deleteCLPipeline,
  switchPipelineBackToDraft,
  approvePipeline,
} from '../../../../../store/contentLibrary/pipelines/actions';
import LocalizedDate from '../../../../../components/LocalizedDate/LocalizedDate';
import ListPopover from '../ListPopover/ListPopover';
import PipelineFormModal from '../PipelineFormModal/PipelineFormModal';
import PipelineSubmitFormModal from '../PipelineSubmitFormModal/PipelineSubmitFormModal';
import PipelineRejectFormModal from '../PipelineRejectFormModal/PipelineRejectFormModal';
import { getContextMenuOptions } from '../../utils/CLPipelinesHelper';
import useWarningModal from '../../../../../hooks/useWarningModal';
import { checkPermissions } from '../../../../../utils/permissionsHelper';
import useCheckAuth from '../../../../../hooks/useCheckAuth';

export const COMPONENT_NAME = 'CL_PIPELINES_LIST';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PipelineList = ({ searchText, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const CLPipelines = useSelector(CLPipelinesSelectors.CLPipelines);
  const isCLPipelineFetching = useSelector(CLPipelinesSelectors.isCLPipelineFetching);
  const isCLPipelinesRefreshNeeded = useSelector(CLPipelinesSelectors.isCLPipelinesRefreshNeeded);
  const [CLPipelinesFiltered, setCLPipelinesFiltered] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPublishedEditModalOpen, setIsPublishedEditModalOpen] = useState(false);
  const [isRejectedEditModalOpen, setIsRejectedEditModalOpen] = useState(false);
  const [isSubmitReviewEditModalOpen, setIsSubmitReviewEditModalOpen] = useState(false);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [isPipelineFormModalShown, setIsPipelineFormModalShown] = useState(false);
  const [isPipelineSubmitFormModalShown, setIsPipelineSubmitFormModalShown] = useState(false);
  const [isRejectFormModalShown, setIsRejectFormModalShown] = useState(false);
  const isCLPipelineUpdating = useSelector(CLPipelinesSelectors.isCLPipelineUpdating);
  const options = getContextMenuOptions(t);
  const { permissions } = useCheckAuth();
  const [headers, setHeaders] = useState([]);

  const navigateToPipeline = useCallback(pipeline => {
    window.location.href = `${env.ANALYTICSUI_URL}/content-library/pipeline/${pipeline.id}`;
  }, []);

  const handleContextButton = useCallback((e, pipeline) => {
    setSelectedPipeline(pipeline);
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    setHeaders([
      {
        key: 'pipelineSource',
        render: pipelineSource => (
          <Flex>
            {pipelineSource === PIPELINE_TYPE.TRIFACTA && (
              <Tooltip
                display='inline-block'
                direction={TooltipPosition.RIGHT}
                tooltipContent={t('Pages_Content_Library_PipelinesListing_TrifactaTooltip')}
                showOnHover
              >
                <Icon type={IconTypes.AUTO_CONNECTOR_ON} height={28} width={28} color='black' />
              </Tooltip>
            )}
          </Flex>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_Pipeline'),
        key: 'pipelineName',
        render: (name, row) => (
          <Flex
            external
            cursor='pointer'
            position='relative'
            width='100%'
            alignItems='center'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}`}
            onClick={() => navigateToPipeline(row)}
          >
            <Text
              ellipsisTooltip
              tooltipWrapperWidth='inherit'
              charLimit={20}
              fontWeight='m'
              dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-name`}
            >
              {name}
            </Text>
          </Flex>
        ),
      },
      {
        key: 'pipelineError',
        render: (pipelineError, pipeline) => (
          <Flex justifyContent='flex-end'>
            {pipeline.workpapersInformation.some(workpaper => workpaper.isLatest !== null && !workpaper.isLatest) && (
              <Box minHeight={28} minWidth={28}>
                <Tooltip
                  display='inline-block'
                  direction={TooltipPosition.RIGHT}
                  tooltipContent={t('Pages_Content_Library_PipelineWarningTooltip_OutdatedWorkpaper')}
                  showOnHover
                >
                  <Icon type={IconTypes.WARNING} height={28} width={28} color='yellow' />
                </Tooltip>
              </Box>
            )}

            {pipeline.workpapersInformation.some(workpaper => workpaper.status === WP_STATUS.DEACTIVATED) && (
              <Box mh={28} mw={28}>
                <Tooltip
                  display='inline-block'
                  direction={TooltipPosition.RIGHT}
                  tooltipContent={t('Pages_Content_Library_PipelineWarningTooltip_DeactivatedWorkpaper')}
                  showOnHover
                >
                  <Icon type={IconTypes.WARNING} height={28} width={28} color='yellow' />
                </Tooltip>
              </Box>
            )}
          </Flex>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_Workpapers'),
        key: 'workpapersInformation',
        render: (workpapers, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-workpapers`}
          >
            {workpapers && workpapers.length === 0 && t('Pages_Content_Library_PipelinesListing_Pipeline_NoWorkpapers')}
            {workpapers && workpapers.length === 1 && (
              <Link
                external={row.pipelineSource !== PIPELINE_TYPE.TRIFACTA}
                to={
                  row.pipelineSource === PIPELINE_TYPE.TRIFACTA
                    ? `/workpapers/${workpapers[0].id}`
                    : `${env.ANALYTICSUI_URL}/workpapers/${workpapers[0].id}/data`
                }
              >
                {workpapers[0].name}
              </Link>
            )}
            {workpapers && workpapers.length > 1 && (
              <ListPopover
                title={t('Pages_Content_Library_PipelinesListing_Pipeline_WorkpapersListTitle')}
                sumarizeContent={`${workpapers[0].name},+${workpapers.length - 1}`}
              >
                {workpapers.map(workpaper => (
                  <Text
                    type={TextTypes.BODY}
                    key={`${COMPONENT_NAME}-pipeline-${row.id}-workpaper-${workpaper.id}-text`}
                  >
                    <Link
                      key={`${COMPONENT_NAME}-pipeline-${row.id}-workpaper-${workpaper.id}`}
                      external={row.pipelineSource !== PIPELINE_TYPE.TRIFACTA}
                      to={
                        row.pipelineSource === PIPELINE_TYPE.TRIFACTA
                          ? `/workpapers/${workpapers[0].id}`
                          : `${env.ANALYTICSUI_URL}/workpapers/${workpapers[0].id}/data`
                      }
                    >
                      {workpaper.name}
                    </Link>
                  </Text>
                ))}
              </ListPopover>
            )}
          </Box>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_Description'),
        key: 'pipelineDescription',
        render: (description, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-description`}
          >
            <Text charLimit={30}>{description}</Text>
          </Box>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_Status'),
        key: 'status',
        render: (description, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-status`}
          >
            <Text charLimit={30}>{description}</Text>
          </Box>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_Availability'),
        key: 'clients',
        render: (clients, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-availability`}
          >
            {clients && clients.length === 0 && t('Pages_Content_Library_PipelinesListing_Pipeline_AllClients')}
            {clients && clients.length === 1 && <Link to={`/clients/${clients[0].id}`}>{clients[0].name}</Link>}
            {clients && clients.length > 1 && (
              <ListPopover
                title={t('Pages_Content_Library_PipelinesListing_Pipeline_ClientsListTitle')}
                sumarizeContent={`${clients[0].name},+${clients.length - 1}`}
              >
                {clients.map(workpaper => (
                  <Text type={TextTypes.BODY} key={`${COMPONENT_NAME}-pipeline-${row.id}-clients-${workpaper.id}-text`}>
                    <Link
                      key={`${COMPONENT_NAME}-pipeline-${row.id}-clients-${workpaper.id}`}
                      to={`/clients/${workpaper.id}`}
                    >
                      {workpaper.name}
                    </Link>
                  </Text>
                ))}
              </ListPopover>
            )}
          </Box>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_ReleaseVersion'),
        key: 'versionNumber',
        render: (versionNumber, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-versionNumber`}
          >
            <Text charLimit={30}>{versionNumber}</Text>
          </Box>
        ),
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Headers_LastUpdate'),
        key: 'modifiedDate',
        render: (modifiedDate, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-modifiedDate`}
          >
            <LocalizedDate date={modifiedDate || row.createdDate} />
          </Box>
        ),
      },
      {
        key: '',
        render: (value, row) => (
          <Flex
            justifyContent='flex-end'
            cursor='pointer'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-moreMenu`}
          >
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              dataInstance={`${COMPONENT_NAME}`}
              onClick={e => handleContextButton(e, row)}
            />
          </Flex>
        ),
      },
    ]);
  }, [t, handleContextButton, navigateToPipeline]);

  useEffect(() => {
    if (!isCLPipelineUpdating) {
      setIsPipelineFormModalShown(false);
      setIsPipelineSubmitFormModalShown(false);
    }
  }, [isCLPipelineUpdating]);

  useEffect(() => {
    if (isCLPipelinesRefreshNeeded || status) {
      dispatch(getCLPipelines(status));
    }
  }, [dispatch, isCLPipelinesRefreshNeeded, status]);

  useEffect(() => {
    setCLPipelinesFiltered(
      (CLPipelines || []).filter(
        x =>
          (x.pipelineName || '')
            .trim()
            .toLowerCase()
            .indexOf((searchText || '').trim().toLowerCase()) > -1
      )
    );
  }, [CLPipelines, searchText]);

  const emptyStateText =
    (searchText || '').length > 0
      ? t('Pages_Content_Library_PipelinesListing_NoSearchResults')
      : t('Pages_Content_Library_PipelinesListing_NoWorkpapers');

  const deleteCLPipelineOption = () => {
    dispatch(deleteCLPipeline(selectedPipeline));
  };

  const switchPipelineBackToDraftOption = () => {
    dispatch(switchPipelineBackToDraft({ ...selectedPipeline, status: STATUS.BACK_TO_DRAFT }));
  };

  const switchPipelinePublishedToDraft = async () => {
    const isPublished = selectedPipeline?.status === STATUS.PUBLISHED;
    const result = await dispatch(switchPipelineBackToDraft({ ...selectedPipeline, status: STATUS.BACK_TO_DRAFT }));
    setSelectedPipeline(result);
    if (isPublished && result) {
      setIsPublishedEditModalOpen(true);
    }
  };

  const switchPipelineRejectedToDraft = async () => {
    const isRejected = selectedPipeline?.status === STATUS.REJECTED;
    const result = await dispatch(switchPipelineBackToDraft({ ...selectedPipeline, status: STATUS.BACK_TO_DRAFT }));
    if (isRejected && result) {
      setIsRejectedEditModalOpen(true);
    }
  };

  const switchPipelineReadyReviewToDraft = async () => {
    const isSubmitForReview = selectedPipeline?.status === STATUS.SUBMIT_REVIEW;
    const result = await dispatch(switchPipelineBackToDraft({ ...selectedPipeline, status: STATUS.BACK_TO_DRAFT }));
    if (isSubmitForReview && result) {
      setIsSubmitReviewEditModalOpen(true);
    }
  };

  const approveCLpipeline = () => {
    dispatch(approvePipeline(selectedPipeline));
  };

  const handleOptionClick = option => {
    setIsMenuOpen(false);
    switch (option.id) {
      case CONTEXT_MENU_OPTIONS.EDIT:
        const pipelineStatus = selectedPipeline?.status;
        if (pipelineStatus === STATUS.PUBLISHED) {
          showWarningModal(
            t('Pages_Content_Library_PipelinesListing_Edit_PublishedWarning'),
            switchPipelinePublishedToDraft
          );
        } else if (pipelineStatus === STATUS.REJECTED) {
          showWarningModal(
            t('Pages_Content_Library_PipelinesListing_Edit_RejectedWarning'),
            switchPipelineRejectedToDraft
          );
        } else if (pipelineStatus === STATUS.SUBMIT_REVIEW) {
          showWarningModal(
            t('Pages_Content_Library_PipelinesListing_Edit_ReadyForReviewWarning'),
            switchPipelineReadyReviewToDraft
          );
        } else {
          setIsPipelineFormModalShown(true);
        }

        break;
      case CONTEXT_MENU_OPTIONS.DELETE:
        showWarningModal(t('Pages_Content_Library_PipelinesListing_DeleteWarning'), deleteCLPipelineOption);
        break;
      case CONTEXT_MENU_OPTIONS.BACK_TO_DRAFT:
        showWarningModal(
          t('Pages_Content_Library_PipelinesListing_SwitchDraftWarning'),
          switchPipelineBackToDraftOption
        );
        break;
      case CONTEXT_MENU_OPTIONS.SUBMIT_REVIEW:
        setIsPipelineSubmitFormModalShown(true);
        break;
      case CONTEXT_MENU_OPTIONS.APPROVE:
        showWarningModal(t('Pages_Content_Library_PipelinesListing_ApproveWarning'), approveCLpipeline);
        break;
      case CONTEXT_MENU_OPTIONS.REJECT:
        setIsRejectFormModalShown(true);
        break;
      default:
        break;
    }
  };

  const renderContextMenu = () => {
    const pipelinePublishState = status;
    const allowedActionsByPipelineStatus = {
      ReadyForReview: pipelinePublishState
        ? [CONTEXT_MENU_OPTIONS.APPROVE, CONTEXT_MENU_OPTIONS.REJECT]
        : [CONTEXT_MENU_OPTIONS.EDIT, CONTEXT_MENU_OPTIONS.BACK_TO_DRAFT],
      Published: pipelinePublishState ? [] : [CONTEXT_MENU_OPTIONS.EDIT, CONTEXT_MENU_OPTIONS.BACK_TO_DRAFT],
      Rejected: [CONTEXT_MENU_OPTIONS.EDIT, CONTEXT_MENU_OPTIONS.BACK_TO_DRAFT],
      Draft: [CONTEXT_MENU_OPTIONS.EDIT, CONTEXT_MENU_OPTIONS.SUBMIT_REVIEW, CONTEXT_MENU_OPTIONS.DELETE],
    };
    const filteredOptions = options.filter(
      opt =>
        allowedActionsByPipelineStatus[selectedPipeline?.status]?.indexOf(opt.id) !== -1 &&
        checkPermissions(permissions, opt.permission.permission, opt.permission.action)
    );

    return (
      <ContextMenu
        options={filteredOptions}
        onOptionClicked={handleOptionClick}
        dataInstance={`${COMPONENT_NAME}`}
        cursor='pointer'
      />
    );
  };

  const handleAddModalClose = () => {
    setIsPipelineFormModalShown(false);
    setIsPipelineSubmitFormModalShown(false);
    setIsRejectFormModalShown(false);
    setIsPublishedEditModalOpen(false);
    setIsRejectedEditModalOpen(false);
    setIsSubmitReviewEditModalOpen(false);
  };

  return (
    <Container dataInstance={`${COMPONENT_NAME}-PipelinesListing`} pb={80}>
      {!status ? (
        <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray' mb={5}>
          {t('Pages_Content_Library_PipelinesListing_Label')}
        </Text>
      ) : null}
      <Box dataInstance={`${COMPONENT_NAME}-PipelinesListing-Table-Container`} backgroundColor='white'>
        <Spinner spinning={isCLPipelineFetching} dataInstance={`${COMPONENT_NAME}-PipelineListing-Table`}>
          {CLPipelines?.length > 0 && (
            <Table headers={headers} rows={CLPipelinesFiltered} dataInstance={`${COMPONENT_NAME}-PipelinesListing`} />
          )}
          {CLPipelines?.length <= 0 && (
            <StateView title={emptyStateText} dataInstance={`${COMPONENT_NAME}-PipelinesListing-NoRecords`} />
          )}
          <Popover
            isOpen={isMenuOpen}
            anchorRef={contextButtonRef}
            anchorOriginX={PopoverOrigin.START}
            anchorOriginY={PopoverOrigin.START}
            originX={PopoverOrigin.END}
            originY={PopoverOrigin.START}
            onClose={() => setIsMenuOpen(false)}
            width={200}
            mt={7}
            dataInstance={`${COMPONENT_NAME}-Menu`}
            cursor='pointer'
          >
            {renderContextMenu()}
          </Popover>
          <PipelineFormModal
            isEditModal
            isOpen={
              isPipelineFormModalShown ||
              isPublishedEditModalOpen ||
              isRejectedEditModalOpen ||
              isSubmitReviewEditModalOpen
            }
            onClose={handleAddModalClose}
            formValueProp={selectedPipeline}
            dataInstance={`${COMPONENT_NAME}-Form`}
          />
          <PipelineSubmitFormModal
            isOpen={isPipelineSubmitFormModalShown}
            onClose={handleAddModalClose}
            formValueProp={selectedPipeline}
            dataInstance={`${COMPONENT_NAME}-SubmitForm`}
          />
          <PipelineRejectFormModal
            isOpen={isRejectFormModalShown}
            onClose={handleAddModalClose}
            selectedPipeline={selectedPipeline}
            dataInstance={`${COMPONENT_NAME}-SubmitForm`}
          />
          {renderWarningModal()}
        </Spinner>
      </Box>
    </Container>
  );
};

export default PipelineList;
