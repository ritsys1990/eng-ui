import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  ButtonTypes,
  ContextMenu,
  Flex,
  Icon,
  IconTypes,
  Popover,
  PopoverOrigin,
  Table,
  Text,
  TextTypes,
  Tooltip,
  TooltipPosition,
} from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import LocalizedDate from '../../../../../components/LocalizedDate/LocalizedDate';
import { engagementSelectors } from '../../../../../store/engagement/selectors';
import { ContextMenuOptions, EngagementStatus } from '../constants/engagment.constants';
import EditEngagementModal from './EditEngagementModal';
import EngagementIntegratedApps from './EngagementIntegratedApps';
import { Actions, checkPermissions, Permissions } from '../../../../../utils/permissionsHelper';
import DeleteEngagementModal from './DeleteEngagementModal';
import useCheckAuth from '../../../../../hooks/useCheckAuth';

const COMPONENT_NAME = 'Client_Setup_Engagement_Table';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Table';

const EngagementTable = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [headers, setHeaders] = useState([]);
  const [contextMenuOptions, setContextMenuOptions] = useState([]);

  const { permissions } = useCheckAuth({ useClientPermissions: true });
  const engagementList = useSelector(engagementSelectors.selectClientEngagementList);
  const { t } = useTranslation();

  const handleContextMenuClick = option => {
    switch (option.id) {
      case ContextMenuOptions.EDIT:
        setShowEditModal(true);
        setIsMenuOpen(false);
        break;
      case ContextMenuOptions.DELETE:
        setShowDeleteModal(true);
        setIsMenuOpen(false);
        break;
      default:
        break;
    }
  };

  // selectClientEngagementList
  const handleContextMenuButtonClick = (e, row) => {
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setSelectedEngagement(row);
    setIsMenuOpen(true);
  };

  useEffect(() => {
    setHeaders([
      {
        title: t(`${TRANSLATION_KEY}_Header1`),
        key: 'name',
        render: (name, row) => (
          <Text type={TextTypes.BODY} display='flex' alignItems='center'>
            {name}
            {row?.rollForwardStatus === EngagementStatus.IN_PROGRESS && (
              <Tooltip
                display='inline-block'
                direction={TooltipPosition.TOP}
                tooltipContent={t(`${TRANSLATION_KEY}_RollforwardInProgressTooltip`)}
                width='250px'
                showOnHover
              >
                <Icon type={IconTypes.INFO} height={24} width={24} ml={2} color='green' />
              </Tooltip>
            )}
          </Text>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Header2`),
        key: 'matId',
        render: (id, row) => <Text>{row?.matNumber || '-'}</Text>,
      },
      {
        title: t(`${TRANSLATION_KEY}_Header3`),
        key: 'fiscalYearEnd',
        render: (id, row) => <LocalizedDate date={row?.fiscalYearEnd} />,
      },
      {
        title: t(`${TRANSLATION_KEY}_Header4`),
        key: 'entityIds',
        render: (id, row) => <Text>{row?.entityIds.length || '0'}</Text>,
      },
      {
        title: t(`${TRANSLATION_KEY}_Header5`),
        key: 'integratedApps',
        render: (id, row) => {
          const isConnectedToMAT = !!row?.matId;
          const isConnectedToGlobalscape = !!(row.efT_EXT_EngagementLink && row.efT_INT_EngagementLink);
          const isConnectedToOmnia = !!row?.linkedOmniaEngagements.length > 0;

          return (
            <EngagementIntegratedApps
              isConnectedToMAT={isConnectedToMAT}
              isConnectedToGlobalscape={isConnectedToGlobalscape}
              isConnectedToOmnia={isConnectedToOmnia}
              cortexEngagementId={row.id}
            />
          );
        },
      },
      {
        key: 'id',
        render: (id, row) =>
          contextMenuOptions.length > 0 && (
            <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${COMPONENT_NAME}-${row.id}`}>
              <Button
                p={2}
                type={ButtonTypes.FLAT}
                icon={IconTypes.ELLIPSIS_Y}
                iconWidth={18}
                onClick={e => handleContextMenuButtonClick(e, row)}
                dataInstance={`${COMPONENT_NAME}-Context-${row.id}`}
              />
            </Flex>
          ),
      },
    ]);
  }, [contextMenuOptions]);

  const updateEditShowEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    const options = [];

    if (checkPermissions(permissions, Permissions.ENGAGEMENTS, Actions.UPDATE)) {
      options.push({
        id: ContextMenuOptions.EDIT,
        text: t(`${TRANSLATION_KEY}_ContextMenu_Option1`),
      });
    }

    if (checkPermissions(permissions, Permissions.ENGAGEMENTS, Actions.DELETE)) {
      options.push({
        id: ContextMenuOptions.DELETE,
        text: t(`${TRANSLATION_KEY}_ContextMenu_Option2`),
      });
    }

    setContextMenuOptions(options);
  }, [permissions, t]);

  return (
    <Box dataInstance={`${COMPONENT_NAME}_Main`}>
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
        <ContextMenu
          options={contextMenuOptions}
          onOptionClicked={handleContextMenuClick}
          dataInstance={COMPONENT_NAME}
        />
      </Popover>
      {showEditModal && (
        <EditEngagementModal
          selectedEngagement={selectedEngagement}
          isOpen={showEditModal}
          updateEditShowEditModal={updateEditShowEditModal}
          dataInstance={`${COMPONENT_NAME}_Edit_Modal`}
        />
      )}
      <DeleteEngagementModal
        selectedEngagement={selectedEngagement}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        dataInstance={`${COMPONENT_NAME}_Delete_Modal`}
      />
      <Table headers={headers} rows={engagementList} mb={5} dataInstance={`${COMPONENT_NAME}_Table`} />
    </Box>
  );
};

export default EngagementTable;
