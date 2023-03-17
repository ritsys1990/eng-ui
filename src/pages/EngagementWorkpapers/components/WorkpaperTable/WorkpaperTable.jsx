import React, { useEffect, useCallback, useContext, useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  ContextMenu,
  Flex,
  Tooltip,
  TooltipPosition,
  Icon,
  IconTypes,
  Popover,
  PopoverOrigin,
  Table,
  Tabs,
  Tag,
  Text,
} from 'cortex-look-book';
import { useHistory } from 'react-router-dom';
import { flatMap } from 'lodash';
import WorkpaperHistoryModal from '../../../../components/WorkpaperHistoryModal/WorkpaperHistoryModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { WpActionModal } from '../WorkpaperActionModal/WpActionModal';
import env from '../../../../app/env';
import { useSelector, useDispatch } from 'react-redux';
import { getContextMenuOptions, getTabs } from '../../utils/workpaperTableHelper';
import { checkPermissions } from '../../../../utils/permissionsHelper';
import WorkPaperViewOutputs from '../../../../components/WorkpaperViewOutputs/WorkpaperViewOutputs';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { securitySelectors } from '../../../../store/security/selectors';
import { WorkpaperSource } from '../../../Engagement/components/AddWorkpaperModal/constants/new-workpaper';
import { ThemeContext } from 'styled-components';
import { COMPONENT_NAME, WORKPAPER_OPTIONS, COMPLETED, CLONING_STATUS, HALF_HOUR } from './constants';
import { getDMTDetails } from '../../../../store/engagement/actions';
import { getChildWorkpapersStatusByWorkpaperId } from '../../../../store/workpaper/actions';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_WorkpaperTable';

const WorkpaperTable = props => {
  const { t, exists } = useTranslation();
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [activeTab, setActiveTab] = useState('workpapers');
  const [selectedWp, setSelectedWp] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedWpAction, setSelectedWpAction] = useState(null);
  const { permissions } = useCheckAuth({ useEngagementPermissions: true });
  const dispatch = useDispatch();
  const [childWPStaus, setChildWPStatus] = useState(false);
  const [headers, setHeaders] = useState([]);
  const { tags: origTags } = props;
  const rows = props.rows.filter(item => {
    return !item.parentWorkpaperId;
  });
  const tags = flatMap(origTags || [], x => x.tags);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const me = useSelector(securitySelectors.selectMe);

  const tabs = getTabs(t);
  const options = getContextMenuOptions(t);

  const renderTags = tagIds => {
    const tagNames = tags
      .filter(x => tagIds?.indexOf(x.id) > -1)
      .map(x => {
        return exists(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
          ? t(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
          : x.name;
      });

    return (
      <>
        {tagNames.map((name, index) => (
          <Tag key={index}>{name}</Tag>
        ))}
      </>
    );
  };

  const handleContextButton = useCallback((e, workpaper) => {
    e.stopPropagation();
    if (workpaper?.workpaperSource === WORKPAPER_TYPES.TRIFACTA) {
      dispatch(getChildWorkpapersStatusByWorkpaperId(workpaper.id)).then(resp => {
        if (resp) {
          setChildWPStatus(resp);
        }
      });
    }
    setContextButtonRef({ current: e.target });
    setSelectedWp(workpaper);
    setIsMenuOpen(true);
  }, []);

  const handleOptionClick = option => {
    setSelectedWpAction(option.id);
    setIsMenuOpen(false);
    setIsActionModalOpen(true);
  };

  const handleHistoryClick = useCallback((workpaper, e) => {
    e.stopPropagation();
    setSelectedWp(workpaper);
    setIsHistoryOpen(true);
  }, []);

  const onLinkHandler = useCallback((workpaperId, templateId, isTrifacta, isCloningInProgress) => {
    if (isCloningInProgress !== CLONING_STATUS.INPROGRESS) {
      if (isTrifacta) {
        history.push(`/workpapers/${workpaperId}`);
      } else if (templateId) {
        dispatch(getDMTDetails(workpaperId)).then(inputs => {
          if (inputs?.some(input => input.dataSourceSubsribed?.length > 0 || input.linkedBundles?.length > 0)) {
            window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/lineage`;
          } else {
            history.push(`/workpapers/${workpaperId}`);
          }
        });
      } else {
        window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/data`;
      }
    }
  }, []);

  const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');
  const DEFAULT_STATUS = 'InProgress';

  useEffect(() => {
    setHeaders([
      {
        title: '',
        key: 'workpaperSource',
        headerStyles: {
          paddingRight: theme.space[4],
          paddingLeft: theme.space[4],
        },
        render: (workpaperSource, row) => (
          <Flex>
            {workpaperSource === WorkpaperSource.TRIFACTA && (
              <Tooltip
                display='inline-block'
                direction={TooltipPosition.RIGHT}
                tooltipContent={t('Pages_EngagementWorkpapers_TrifactaTooltip')}
                showOnHover
              >
                <Icon type={IconTypes.AUTO_CONNECTOR_ON} height={28} width={28} color='black' />
              </Tooltip>
            )}
            {row?.templateId && row?.isOutdatedAnalytic === true && (
              <Tooltip
                type='default'
                tooltipContent={t('Pages_EngagementWorkpapers_OutdatedVersion')}
                direction={TooltipPosition.RIGHT}
                showOnHover
              >
                <Icon type={IconTypes.WARNING_NO_CIRCLE} height={28} width={28} />
              </Tooltip>
            )}
          </Flex>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_Workpaper`),
        key: 'name',
        render: (name, row) => (
          <Flex
            cursor='pointer'
            width='100%'
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            alignItems='center'
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={32} fontWeight='m'>
              {name}
            </Text>
          </Flex>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_Description`),
        key: 'description',
        render: (description, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            width='100%'
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            {row?.workpaperWorkflowCloneStatus === CLONING_STATUS.INPROGRESS ? (
              t('Pages_Engagement_PipelinesListing_Cloning_InProgress')
            ) : (
              <Text charLimit={40}>{description}</Text>
            )}
          </Box>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_Tags`),
        key: 'tagIds',
        render: (value, row) => (
          <Box
            cursor='pointer'
            minHeight={30}
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            {row?.workpaperWorkflowCloneStatus !== CLONING_STATUS.INPROGRESS ? renderTags(value) : ''}
          </Box>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_ReleaseVersion`),
        key: 'versionNumber',
        render: (value, row) => (
          <Box
            cursor='pointer'
            minHeight={16}
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            {row?.workpaperWorkflowCloneStatus !== CLONING_STATUS.INPROGRESS && value ? `Version ${value}` : ''}
          </Box>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_Status`),
        key: 'status',
        render: (name, row) => (
          <Box
            cursor='pointer'
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            <Text>
              {row?.workpaperWorkflowCloneStatus !== CLONING_STATUS.INPROGRESS
                ? splitByCapital(row.reviewStatus || DEFAULT_STATUS)
                : ''}
            </Text>
          </Box>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_History`),
        key: 'id',
        render: (id, row) => (
          <Box
            cursor='pointer'
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            {row?.workpaperWorkflowCloneStatus !== CLONING_STATUS.INPROGRESS && (
              <Button
                p={2}
                type={ButtonTypes.FLAT}
                icon={IconTypes.CLOCK}
                iconWidth={22}
                iconColor='blue'
                disabled={row?.workpaperWorkflowCloneStatus === CLONING_STATUS.INPROGRESS}
                onClick={e => handleHistoryClick(row, e)}
                dataInstance={`${COMPONENT_NAME}-History`}
              />
            )}
          </Box>
        ),
      },
      {
        key: 'id',
        render: (id, row) => (
          <Flex
            justifyContent='flex-end'
            cursor='pointer'
            // eslint-disable-next-line sonarjs/no-identical-functions
            onClick={() =>
              onLinkHandler(
                row?.id,
                row?.templateId,
                row?.workpaperSource === 'Trifacta',
                row?.workpaperWorkflowCloneStatus
              )
            }
            dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}
          >
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              disabled={
                new Date() - new Date(row?.creationDate) < HALF_HOUR &&
                row?.workpaperWorkflowCloneStatus === CLONING_STATUS.INPROGRESS
              }
              onClick={e => handleContextButton(e, row)}
              dataInstance={`${COMPONENT_NAME}-Context`}
            />
          </Flex>
        ),
      },
    ]);
  }, [t, handleContextButton, handleHistoryClick, onLinkHandler]);

  const renderContextMenu = () => {
    let workpaperReviewStatus = DEFAULT_STATUS;
    if (selectedWp?.reviewStatus) {
      workpaperReviewStatus = selectedWp.reviewStatus;
    } else if (childWPStaus) {
      workpaperReviewStatus = COMPLETED;
    }
    const notAllowedActionsByWpStatus = {
      InProgress: [WORKPAPER_OPTIONS.RETURNTOPREPARER, WORKPAPER_OPTIONS.REVERTTOPROGRESS, WORKPAPER_OPTIONS.COMPLETE],
      SubmittedForReview: [WORKPAPER_OPTIONS.SUBMITTOREVIEW, WORKPAPER_OPTIONS.REVERTTOPROGRESS],
      Completed: childWPStaus
        ? [
            WORKPAPER_OPTIONS.EDIT,
            WORKPAPER_OPTIONS.SUBMITTOREVIEW,
            WORKPAPER_OPTIONS.RETURNTOPREPARER,
            WORKPAPER_OPTIONS.COMPLETE,
            WORKPAPER_OPTIONS.REVERTTOPROGRESS,
            WORKPAPER_OPTIONS.DELETE,
          ]
        : [
            WORKPAPER_OPTIONS.EDIT,
            WORKPAPER_OPTIONS.SUBMITTOREVIEW,
            WORKPAPER_OPTIONS.RETURNTOPREPARER,
            WORKPAPER_OPTIONS.COMPLETE,
          ],
    };

    // Below options are disabled so that author is restricted from reviewing their own submission
    const optionsRestrictedForAuthor =
      selectedWp?.reviewStatusUpdater && selectedWp?.reviewStatusUpdater === me.email
        ? [WORKPAPER_OPTIONS.RETURNTOPREPARER, WORKPAPER_OPTIONS.COMPLETE]
        : [];

    const filteredOptions = options.filter(
      opt =>
        notAllowedActionsByWpStatus[workpaperReviewStatus].indexOf(opt.id) === -1 &&
        checkPermissions(permissions, opt.permission.permission, opt.permission.action) &&
        optionsRestrictedForAuthor.indexOf(opt.id) === -1
    );

    return <ContextMenu options={filteredOptions} onOptionClicked={handleOptionClick} dataInstance={COMPONENT_NAME} />;
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'workpapers':
        return <Table headers={headers} rows={rows} dataInstance={`${COMPONENT_NAME}-WorkpaperTable`} />;
      case 'outputs':
        return <WorkPaperViewOutputs id={engagement.id} />;
      default:
        return null;
    }
  };

  return (
    <Box backgroundColor='white' mt={8}>
      <Tabs activeTab={activeTab} onTabClicked={setActiveTab} tabs={tabs} dataInstance={`${COMPONENT_NAME}-Tabs`} />
      {renderTabContent()}
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
        dataInstance={`${COMPONENT_NAME}`}
      >
        {renderContextMenu()}
      </Popover>
      <WpActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        action={selectedWpAction}
        workpaper={selectedWp}
        data-instance={`${COMPONENT_NAME}-Action`}
      />

      {isHistoryOpen && (
        <WorkpaperHistoryModal
          workpaper={selectedWp}
          onClose={() => setIsHistoryOpen(false)}
          data-instance={`${COMPONENT_NAME}-History`}
        />
      )}
    </Box>
  );
};

export default WorkpaperTable;
