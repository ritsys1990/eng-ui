import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../hooks/useTranslation';
import { getAllEntitiesTableHeaders } from './utils/Entities.utils';
import AllEntitiesContextMenu from './AllEntitiesContextMenu';

const COMPONENT_NAME = 'AllEntitiesTable';

const AllEntitiesTable = ({ entities, onEditEntity, onDeleteEntity }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [headers, setHeaders] = useState([]);

  const { t } = useTranslation();

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleContextMenuClick = useCallback((event, entity) => {
    setContextButtonRef({ current: event.target });
    setSelectedEntity(entity);
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    setHeaders(getAllEntitiesTableHeaders(t, handleContextMenuClick));
  }, [t, handleContextMenuClick]);

  return (
    <>
      <AllEntitiesContextMenu
        isOpen={isMenuOpen}
        buttonRef={contextButtonRef}
        onClose={handleMenuClose}
        entity={selectedEntity}
        dataInstance={COMPONENT_NAME}
        onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
      />
      <Text type={TextTypes.h4} fontWeight='m' mb={4}>
        {t('Pages_Client_Setup_Step2_All_Entities')}
      </Text>
      <Table headers={headers} rows={entities} dataInstance={COMPONENT_NAME} />
    </>
  );
};

AllEntitiesTable.propTypes = {
  entities: PropTypes.array.isRequired,
};

export default AllEntitiesTable;
