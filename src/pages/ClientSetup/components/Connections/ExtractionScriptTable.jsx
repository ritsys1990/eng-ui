import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Table } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY, ExtractionScriptContextMenuOptions } from './constants';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { CtaButton, CtaMenu } from './TableFields';
import ExtractionScriptModal from './ExtractionScriptModal';
import DeleteExtractionScriptModal from './DeleteExtractionScriptModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

const { EXTRACTION_SCRIPT_TABLE: COMPONENT_NAME } = ComponentNames;

export const renderCTA = (row, clickHandler, menuOptions) => {
  return (
    menuOptions.length > 0 && (
      <Flex justifyContent='flex-end' cursor='pointer'>
        <CtaButton
          onClick={e => {
            clickHandler(e, row);
          }}
          dataInstance={`${COMPONENT_NAME}-MoreOptions-${row?.id}`}
        />
      </Flex>
    )
  );
};

const ExtractionScriptTable = ({ dataSourceId, scripts, ...otherProps }) => {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [isExtractionScriptModalOpen, setIsExtractionScriptModalOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [ctaRef, setCtaRef] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  const handleExtractionScriptModalClose = () => {
    setIsExtractionScriptModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const ctaMenuCloseHandler = () => {
    setCtaRef(null);
  };

  const ctaOptionHandler = option => {
    switch (option.id) {
      case ExtractionScriptContextMenuOptions.EDIT:
        setIsExtractionScriptModalOpen(true);
        break;
      case ExtractionScriptContextMenuOptions.DELETE:
      default:
        setIsDeleteModalOpen(true);
        break;
    }
    setCtaRef(null);
  };

  const ctaClickHandler = useCallback((e, connection) => {
    setSelectedConnection(connection);
    setCtaRef({ current: e.currentTarget });
  }, []);

  useEffect(() => {
    const options = [];

    if (checkPermissions(permissions, Permissions.CONNECTIONS, Actions.UPDATE)) {
      options.push({
        id: ExtractionScriptContextMenuOptions.EDIT,
        text: t(`Edit`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL),
      });
    }
    if (checkPermissions(permissions, Permissions.CONNECTIONS, Actions.DELETE)) {
      options.push({
        id: ExtractionScriptContextMenuOptions.DELETE,
        text: t(`Delete`, nameSpaces.TRANSLATE_NAMESPACE_GENERAL),
      });
    }

    setMenuOptions(options);
  }, [t, permissions]);

  useEffect(() => {
    setHeaders([
      { key: 'databaseType', title: t(`${TRANSLATION_KEY}ExtrTableHeader1`) },
      { key: 'schemaName', title: t(`${TRANSLATION_KEY}ExtrTableHeader2`) },
      {
        key: '#cta',
        title: '',
        render: (_, row) => {
          return renderCTA(row, ctaClickHandler, menuOptions);
        },
      },
    ]);
  }, [t, ctaClickHandler, menuOptions]);

  return (
    <Box dataInstance={COMPONENT_NAME}>
      <Table {...otherProps} headers={headers} rows={scripts} emptyText={t(`${TRANSLATION_KEY}ExtrTableEmpty`)} />
      <CtaMenu
        anchorRef={ctaRef}
        onClose={ctaMenuCloseHandler}
        options={menuOptions}
        onOptionClicked={ctaOptionHandler}
        dataInstance={COMPONENT_NAME}
      />
      <ExtractionScriptModal
        isOpen={isExtractionScriptModalOpen}
        handleClose={handleExtractionScriptModalClose}
        dataSourceId={dataSourceId}
        dataInstance={`${COMPONENT_NAME}`}
        extractionScriptData={selectedConnection}
        isEdit
      />
      <DeleteExtractionScriptModal
        isOpen={isDeleteModalOpen}
        handleClose={handleDeleteModalClose}
        dataSourceId={dataSourceId}
        dataInstance={COMPONENT_NAME}
      />
    </Box>
  );
};

ExtractionScriptTable.propTypes = {
  /**
   * Id of the Data Source that has this extraction scripts
   */
  dataSourceId: PropTypes.string.isRequired,

  /**
   * Array of the config scripts for the Data Sources
   */
  scripts: PropTypes.array,
};

ExtractionScriptTable.defaultProps = {
  scripts: [],
};

export default ExtractionScriptTable;
