import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  Flex,
  IconTypes,
  Table,
  Text,
  ContextMenu,
  Popover,
  PopoverOrigin,
  Checkbox,
} from 'cortex-look-book';
import { useHistory } from 'react-router-dom';
import useTranslation from '../../../../hooks/useTranslation';
import { COMPONENT_NAME, contextMenuOptions } from './constants';
import { CHILD_WORKPAPER_STATUS } from '../../constants/constants';
import { MoreActions } from './moreActionsEnum';
import DeleteChildWorkpaperModal from './DeleteChildWorkpaperModal';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_ChildWorkpaperTable';

const ChildWorkpaperTable = props => {
  const { t } = useTranslation();
  const history = useHistory();
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedWp, setSelectedWp] = useState(null);

  const {
    rows,
    setFiltersOpen,
    setEditChildWPClick,
    setEditChildWPDetails,
    onChildWpChecked,
    selectedChildWps,
    hideGenerateOutputErrorMessage,
    editElpsisEnable,
    onCheckboxAllChecked,
    selectCheckAll,
  } = props;

  const options = [
    {
      id: MoreActions.Edit,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Edit`),
    },
    {
      id: MoreActions.Delete,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Delete`),
    },
  ];

  const handleContextButton = (e, workpaper) => {
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setSelectedWp(workpaper);
    setIsMenuOpen(true);
  };

  const onLinkHandler = (workpaperId, childWpStatus) => {
    if (workpaperId && childWpStatus.toLowerCase() === CHILD_WORKPAPER_STATUS.COMPLETED) {
      history.push(`/workpapers/${workpaperId}`);
    }
  };

  const splitByCapital = text => (text || '').split(/(?=[A-Z])/).join(' ');

  const isRowEnable = row => {
    return (
      row.childWorkPaperStatus?.replace(/\s+/g, '').toLowerCase() === CHILD_WORKPAPER_STATUS.SUBMITTED ||
      row.childWorkPaperStatus?.replace(/\s+/g, '').toLowerCase() === CHILD_WORKPAPER_STATUS.INPROGRESS
    );
  };

  const checkboxAll = () => {
    return (
      <Flex
        justifyContent='flex-end'
        width='100%'
        alignItems='center'
        cursor='pointer'
        dataInstance={`${COMPONENT_NAME}-checkboxAll_0`}
      >
        <Checkbox
          dataInstance={`${COMPONENT_NAME}-checkboxAll`}
          onChange={() => {
            onCheckboxAllChecked(!selectCheckAll);
          }}
          isChecked={selectCheckAll}
        />
      </Flex>
    );
  };
  useEffect(() => {
    setHeaders([
      {
        title: checkboxAll(),
        key: 'checkAll',
        width: '5%',
        render: (value, row) => {
          const isChecked = !!selectedChildWps.find(wp => wp === row.id);

          return (
            <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${COMPONENT_NAME}-${row.id}-checkbox`}>
              <Checkbox
                dataInstance={`${COMPONENT_NAME}-${row.id}-checkbox`}
                isChecked={isChecked}
                onChange={() => {
                  onChildWpChecked(row, isChecked);
                }}
                disabled={isRowEnable(row)}
              />
            </Flex>
          );
        },
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_Workpaper`),
        key: 'childWorkPaperName',
        render: (name, row) => (
          <Flex
            cursor='pointer'
            width='100%'
            onClick={() => onLinkHandler(row?.childWorkPaperId, row.childWorkPaperStatus)}
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
          <Box cursor='pointer' minHeight={16} width='100%' dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}>
            <Text charLimit={40}>{description}</Text>
          </Box>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_Headers_ChildStatus`),
        key: 'childWorkPaperStatus',
        render: (name, row) => (
          <Box cursor='pointer' dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}>
            <Text>{splitByCapital(row.childWorkPaperStatus)}</Text>
          </Box>
        ),
      },
      {
        key: 'id',
        render: (id, row) => (
          <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${COMPONENT_NAME}-Workpaper-${row.id}`}>
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              onClick={e => handleContextButton(e, row)}
              dataInstance={`${COMPONENT_NAME}-Context`}
              disabled={isRowEnable(row)}
            />
          </Flex>
        ),
      },
    ]);
  }, [rows, selectedChildWps, selectCheckAll]);
  const handleOptionClick = option => {
    switch (option.id) {
      case contextMenuOptions.DELETE:
        setIsMenuOpen(false);
        setIsActionModalOpen(true);
        hideGenerateOutputErrorMessage();
        break;
      case contextMenuOptions.EDIT:
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        setFiltersOpen(true);
        setEditChildWPClick(true);
        setEditChildWPDetails(selectedWp);

        break;
      default:
        break;
    }
  };
  const renderContextMenu = () => {
    return (
      <ContextMenu
        options={options}
        onOptionClicked={handleOptionClick}
        dataInstance={`${COMPONENT_NAME}-ContextMenu`}
      />
    );
  };

  return (
    <Box backgroundColor='white' mt={8}>
      <Table headers={headers} rows={rows} dataInstance={`${COMPONENT_NAME}`} />
      <Popover
        isOpen={isMenuOpen}
        anchorRef={contextButtonRef}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.END}
        onClose={() => setIsMenuOpen(false)}
        width={200}
        mb={7}
        dataInstance={`${COMPONENT_NAME}-PopoverMenu`}
        disabled={editElpsisEnable}
      >
        {renderContextMenu()}
      </Popover>
      <DeleteChildWorkpaperModal
        workpaper={selectedWp}
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
        }}
        dataInstance={`${COMPONENT_NAME}_Delete_Modal`}
      />
    </Box>
  );
};

export default ChildWorkpaperTable;
