import React, { useEffect, useState, useCallback } from 'react';
import env from 'env';
import { useSelector, useDispatch } from 'react-redux';
import useTranslation from '../../hooks/useTranslation';
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
  useInterval,
} from 'cortex-look-book';
import {
  PIPELINE_TYPE,
  CONTEXT_MENU_OPTIONS,
  PIPELINE_INITIAL_STATE,
  PIPELINE_FORM_STATE,
  PIPELINE_DETAILS,
  CLONING_STATUS,
} from './constants/constants';
import { EngPipelinesSelectors } from '../../store/engagement/pipelines/selectors';
import { getPipelineList, removePipeline } from '../../store/engagement/pipelines/actions';
import LocalizedDate from '../../components/LocalizedDate/LocalizedDate';
import PipelineEditModal from './PipelineEditModal';
import ListPopover from '../ContentLibrary/Pipelines/components/ListPopover/ListPopover';
import { getContextMenuOptions } from './utils/pipelinesHelper';
import { checkPermissions } from '../../utils/permissionsHelper';
import useCheckAuth from '../../hooks/useCheckAuth';
import useWarningModal from '../../hooks/useWarningModal';

export const COMPONENT_NAME = 'ENG_PIPELINES_LIST';
const REFRESH_INTERVAL = 30 * 1000;

// eslint-disable-next-line sonarjs/cognitive-complexity
const PipelineList = ({ searchText, engagementId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const pipelines = useSelector(EngPipelinesSelectors.pipelines);
  const isPipelineFetching = useSelector(EngPipelinesSelectors.isPipelineFetching);
  const isPipelinesRefreshNeeded = useSelector(EngPipelinesSelectors.isPipelinesRefreshNeeded);
  const [pipelinesFiltered, setPipelinesFiltered] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formValue, setFormValue] = useState(PIPELINE_INITIAL_STATE);
  const [formState, setFormState] = useState(PIPELINE_FORM_STATE);
  const [isPipelineEditModalShown, setIsPipelineEditModalShown] = useState(false);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const options = getContextMenuOptions(t);
  const { permissions } = useCheckAuth();
  const [headers, setHeaders] = useState([]);
  const isCloningStatus = pipelines.some(pipeline => pipeline.cloningStatus === CLONING_STATUS.INPROGRESS);

  const navigateToPipeline = useCallback(pipeline => {
    if (pipeline.cloningStatus !== CLONING_STATUS.INPROGRESS) {
      window.location.href = `${env.ANALYTICSUI_URL}/engagement/${pipeline.engagementId}/pipeline/${pipeline.id}`;
    }
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
                tooltipContent={t('Pages_Engagement_PipelinesListing_TrifactaTooltip')}
                showOnHover
              >
                <Icon type={IconTypes.AUTO_CONNECTOR_ON} height={28} width={28} color='black' />
              </Tooltip>
            )}
          </Flex>
        ),
      },
      {
        title: t('Pages_Engagement_PipelinesListing_Headers_Pipeline'),
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
        title: t('Pages_Engagement_PipelinesListing_Headers_Workpapers'),
        key: 'workpapersInformation',
        render: (workpapers, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-workpapers`}
          >
            {workpapers &&
              workpapers.length === 0 &&
              row.cloningStatus !== CLONING_STATUS.INPROGRESS &&
              t('Pages_Engagement_PipelinesListing_Pipeline_NoWorkpapers')}
            {row.cloningStatus === CLONING_STATUS.INPROGRESS &&
              t('Pages_Engagement_PipelinesListing_Cloning_InProgress')}
            {workpapers && workpapers.length === 1 && (
              <Link external={false} to={`/workpapers/${workpapers[0].id}`}>
                {workpapers[0].name}
              </Link>
            )}
            {workpapers && workpapers.length > 1 && (
              <ListPopover
                title={t('Pages_Engagement_PipelinesListing_Pipeline_PipelineListTitle')}
                sumarizeContent={`${workpapers[0].name},+${workpapers.length - 1}`}
              >
                {workpapers.map(workpaper => (
                  <Text
                    type={TextTypes.BODY}
                    key={`${COMPONENT_NAME}-pipeline-${row.id}-workpaper-${workpaper.id}-text`}
                  >
                    <Link
                      key={`${COMPONENT_NAME}-pipeline-${row.id}-workpaper-${workpaper.id}`}
                      external={false}
                      to={`/workpapers/${workpaper.id}`}
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
        title: t('Pages_Engagement_PipelinesListing_Headers_Description'),
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
        title: t('Pages_Engagement_PipelinesListing_Headers_Mode'),
        key: 'isAutoMode',
        render: (isAutoMode, row) => (
          <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-mode`}>
            <Text>
              {isAutoMode
                ? t('Pages_Engagement_PipelinesListing_Headers_Mode_Commit')
                : t('Pages_Engagement_PipelinesListing_Headers_Mode_Edit')}
            </Text>
          </Box>
        ),
      },
      {
        title: t('Pages_Engagement_PipelinesListing_Headers_LastUpdate'),
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
              disabled={row.cloningStatus === CLONING_STATUS.INPROGRESS}
              iconWidth={18}
              dataInstance={`${COMPONENT_NAME}`}
              onClick={e => handleContextButton(e, row)}
            />
          </Flex>
        ),
      },
    ]);
  }, [t, handleContextButton, navigateToPipeline]);

  useInterval(
    () => {
      if (isCloningStatus) {
        dispatch(getPipelineList(engagementId));
      }
    },
    isCloningStatus ? REFRESH_INTERVAL : null
  );

  useEffect(() => {
    if (engagementId && isPipelinesRefreshNeeded) {
      dispatch(getPipelineList(engagementId));
    }
  }, [dispatch, isPipelinesRefreshNeeded, engagementId]);

  useEffect(() => {
    setPipelinesFiltered(
      (pipelines || []).filter(
        x =>
          (x.pipelineName || '')
            .trim()
            .toLowerCase()
            .indexOf((searchText || '').trim().toLowerCase()) > -1
      )
    );
  }, [pipelines, searchText]);

  const emptyStateText =
    (searchText || '').length > 0
      ? t('Pages_Engagement_PipelinesListing_NoSearchResults')
      : t('Pages_Engagement_PipelinesListing_NoPipeline');

  const deletePipelineOption = () => {
    dispatch(removePipeline(engagementId, selectedPipeline.id));
  };

  const handleOptionClick = option => {
    setIsMenuOpen(false);
    switch (option.id) {
      case CONTEXT_MENU_OPTIONS.OPEN:
        navigateToPipeline(selectedPipeline);
        break;
      case CONTEXT_MENU_OPTIONS.EDIT:
        setIsPipelineEditModalShown(true);

        const { pipelineName, pipelineDescription, pipelineSource, id } = selectedPipeline;

        setFormState({
          ...formState,
          invalid: false,
          value: { pipelineName, pipelineDescription, pipelineSource, id },
        });

        const formValues = {
          [PIPELINE_DETAILS.NAME]: (pipelineName || '').trim(),
          [PIPELINE_DETAILS.DESCRIPTION]: (pipelineDescription || '').trim(),
          [PIPELINE_DETAILS.SOURCE]: (pipelineSource || '').trim(),
          [PIPELINE_DETAILS.ID]: (id || '').trim(),
        };

        setFormValue(formValues);
        break;
      case CONTEXT_MENU_OPTIONS.DELETE:
        showWarningModal(t('Pages_Engagement_PipelinesListing_DeleteWarning'), deletePipelineOption);
        break;
      default:
        break;
    }
  };

  const renderContextMenu = () => {
    const filteredOptions = options.filter(opt =>
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

  return (
    <Container dataInstance={`${COMPONENT_NAME}-PipelinesListing`} pb={110} pt={12}>
      <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray'>
        {t('Pages_Engagement_PipelinesListing_Label')}
      </Text>
      <Box dataInstance={`${COMPONENT_NAME}-PipelinesListing-Table-Container`} backgroundColor='white' mt={5}>
        <Spinner spinning={isPipelineFetching} dataInstance={`${COMPONENT_NAME}-PipelineListing-Table`}>
          {pipelines?.length > 0 && (
            <Table headers={headers} rows={pipelinesFiltered} dataInstance={`${COMPONENT_NAME}-PipelinesListing`} />
          )}
          {pipelinesFiltered?.length <= 0 && (
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
          {renderWarningModal()}
          <PipelineEditModal
            isModalOpen={isPipelineEditModalShown}
            handleClose={() => setIsPipelineEditModalShown(false)}
            formState={formState}
            formValue={formValue}
            updateFormValue={setFormValue}
            updateFormState={setFormState}
            engagementId={engagementId}
          />
        </Spinner>
      </Box>
    </Container>
  );
};

export default PipelineList;
