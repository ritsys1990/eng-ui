import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, Popover, PopoverOrigin } from 'cortex-look-book';
import { getAllEntitiesContextMenuOptions } from './utils/Entities.utils';
import useTranslation from '../../../../hooks/useTranslation';
import { ContextMenuOptions } from './constants/constants';

const COMPONENT_NAME = 'AllEntitiesContextMenu';

const AllEntitiesContextMenu = ({ entity, isOpen, buttonRef, onClose, onEditEntity, onDeleteEntity }) => {
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setOptions(getAllEntitiesContextMenuOptions(t, entity));
  }, [t, entity]);

  const onOptionClicked = option => {
    if (option.id === ContextMenuOptions.EDIT && onEditEntity) {
      onEditEntity(entity);
    }
    if (option.id === ContextMenuOptions.DELETE && onDeleteEntity) {
      onDeleteEntity(entity);
    }
  };

  return (
    options.length > 0 && (
      <Popover
        isOpen={isOpen}
        anchorRef={buttonRef}
        anchorOriginX={PopoverOrigin.START}
        anchorOriginY={PopoverOrigin.START}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.START}
        onClose={onClose}
        width={200}
        mt={7}
        dataInstance={`${COMPONENT_NAME}`}
      >
        <ContextMenu options={options} onOptionClicked={onOptionClicked} dataInstance={COMPONENT_NAME} />
      </Popover>
    )
  );
};

AllEntitiesContextMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
};

export default AllEntitiesContextMenu;
