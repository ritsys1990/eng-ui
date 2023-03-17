import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, ButtonTypes, IconTypes, Flex, Table, Tag } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY, DataSourceOptions } from './constants';
import SubscriptionsTable from './SubscriptionsTable';
import { SubsStatusesField, CtaMenu } from './TableFields';
import DataSourceManager from './DataSourceManager';
import useTranslation from '../../../../hooks/useTranslation';
import DeleteDataSourceModal from './DeleteDataSourceModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

const { TABLE: COMPONENT_NAME } = ComponentNames;

const DataSourcesTable = ({ dataSources, ...otherProps }) => {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [ctaRef, setCtaRef] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isDeleteDataSourceModalOpen, setIsDeleteDataSourceModalOpen] = useState(false);

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  /* ===== Cta Functionality ===== */
  const ctaClickHandler = useCallback(
    (e, dataSource) => {
      setSelectedRow({ ...dataSource });
      setCtaRef({ current: e.currentTarget });
    },
    [setCtaRef, setSelectedRow]
  );

  const ctaMenuCloseHandler = useCallback(() => {
    setCtaRef(null);
  }, [setCtaRef]);

  const ctaOptionHandler = useCallback(
    option => {
      switch (option.id) {
        case DataSourceOptions.EDIT:
          setIsManageOpen(true);
          break;
        case DataSourceOptions.DELETE:
          setIsDeleteDataSourceModalOpen(true);
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn('Option handler not implemented', option, selectedRow); // will be removed
      }
      setCtaRef(null);
    },
    [setIsManageOpen, setCtaRef]
  );

  /* ===== Table Fields Functionality ===== */

  const renderStatuses = useCallback((_, row) => <SubsStatusesField subscriptions={row?.subscriptions} />, []);

  const renderCTA = useCallback(
    (_, row) =>
      menuOptions.length > 0 && (
        <Flex justifyContent='flex-end' cursor='pointer'>
          <Button
            p={2}
            type={ButtonTypes.FLAT}
            icon={IconTypes.ELLIPSIS_Y}
            iconWidth={18}
            onClick={e => ctaClickHandler(e, row)}
            dataInstance={`${COMPONENT_NAME}-ContextButton`}
          />
        </Flex>
      ),
    [ctaClickHandler, menuOptions]
  );

  const renderEntities = useCallback(
    entities => (
      <Box>
        {entities &&
          entities.map(x => (
            <Tag key={x.id} dataInstance={`${COMPONENT_NAME}-EntityName`}>
              {x.name}
            </Tag>
          ))}
      </Box>
    ),
    []
  );

  const isRowExpandable = useCallback(row => row?.subscriptions?.length > 0, []);

  const renderSubsTable = useCallback(row => {
    if (!row?.subscriptions) {
      return null;
    }

    return <SubscriptionsTable subscriptions={row.subscriptions} dataSource={row} />;
  }, []);

  const renderSourceVersion = useCallback((_, row) => {
    return [row.sourceName, row.sourceVersion].filter(x => !!x).join(' - ');
  }, []);

  /* ===== Others ===== */
  const managerCloseHandler = useCallback(() => {
    setIsManageOpen(false);
  }, [setIsManageOpen]);

  const managerDidCloseHandler = useCallback(() => {
    setSelectedRow(null);
  }, [setSelectedRow]);

  const deleteModalCloseHandler = useCallback(() => {
    setIsDeleteDataSourceModalOpen(false);
  }, [setIsDeleteDataSourceModalOpen]);

  const deleteModalDidCloseHandler = useCallback(() => {
    setSelectedRow(null);
  }, [setSelectedRow]);

  /**
   * Sets up the table meta-data.
   */
  useEffect(() => {
    setHeaders([
      {
        title: '',
        key: 'isExpandableRow',
        width: '40',
        iconHeight: 30,
        iconWidth: 30,
        collapseRow: true,
      },
      { key: 'name', title: t(`${TRANSLATION_KEY}TableHeader1`) },
      {
        key: 'type',
        title: t(`${TRANSLATION_KEY}TableHeader2`),
        render: type => {
          return t(`${TRANSLATION_KEY}DS_${type}`);
        },
      },
      {
        key: 'fileTransferMode',
        title: t(`${TRANSLATION_KEY}TableHeader3`),
        render: fileTransferMode => {
          return t(`${TRANSLATION_KEY}FTM_${fileTransferMode}`);
        },
      },
      { key: 'sourceVersion', title: t(`${TRANSLATION_KEY}TableHeader4`), render: renderSourceVersion },
      { key: 'entities', title: t(`${TRANSLATION_KEY}TableHeader5`), render: renderEntities },
      { key: '#subscription_status', title: t(`${TRANSLATION_KEY}TableHeader6`), render: renderStatuses },
      { key: '#cta', title: '', render: renderCTA },
    ]);
  }, [t, renderStatuses, renderEntities, renderSourceVersion]);

  useEffect(() => {
    const options = [];
    if (checkPermissions(permissions, Permissions.DATA_SOURCES, Actions.UPDATE)) {
      options.push({ id: DataSourceOptions.EDIT, text: t(`${TRANSLATION_KEY}DataSource_Options_Edit`) });
    }
    if (checkPermissions(permissions, Permissions.DATA_SOURCES, Actions.DELETE)) {
      options.push({ id: DataSourceOptions.DELETE, text: t(`${TRANSLATION_KEY}DataSource_Options_Delete`) });
    }
    setMenuOptions(options);
  }, [permissions, t]);

  return (
    <Box dataInstance={COMPONENT_NAME}>
      <Table
        {...otherProps}
        headers={headers}
        rows={dataSources}
        renderInnerTemplate={renderSubsTable}
        isRowExpandable={isRowExpandable}
        expandable
        dataInstance={`${COMPONENT_NAME}-Table`}
      />
      <CtaMenu
        anchorRef={ctaRef}
        onClose={ctaMenuCloseHandler}
        options={menuOptions}
        onOptionClicked={ctaOptionHandler}
        dataInstance={`${COMPONENT_NAME}-CtaMenu`}
      />
      <DataSourceManager
        isOpen={isManageOpen && !!selectedRow}
        onClose={managerCloseHandler}
        onDidClose={managerDidCloseHandler}
        dataSource={selectedRow}
        dataInstance={`${COMPONENT_NAME}-Manager`}
      />
      <DeleteDataSourceModal
        isOpen={isDeleteDataSourceModalOpen && !!selectedRow}
        onClose={deleteModalCloseHandler}
        onRemoveFromDom={deleteModalDidCloseHandler}
        dataInstance={`${COMPONENT_NAME}-DeleteModal`}
        dataSource={selectedRow}
      />
    </Box>
  );
};

export default DataSourcesTable;
