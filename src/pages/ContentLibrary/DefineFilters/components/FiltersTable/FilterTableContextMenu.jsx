import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, Popover, PopoverOrigin } from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';
import { ContextMenuOptions, getContextMenuOptions } from '../../constants/constants';

const COMPONENT_NAME = 'FilterTableContextMenu';

const FilterTableContextMenu = ({ isOpen, buttonRef, deleteFilterRow, editFilterRow, onClose, selectedRow }) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);

  const onOptionClicked = option => {
    switch (option.id) {
      case ContextMenuOptions.EDIT:
        return editFilterRow(selectedRow);
      case ContextMenuOptions.DELETE:
        return deleteFilterRow(selectedRow);
      default:
        return null;
    }
  };

  useEffect(() => {
    const menuOptions = getContextMenuOptions(t);
    setOptions(menuOptions);
  }, [t]);

  return (
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
      <ContextMenu
        options={options}
        onOptionClicked={onOptionClicked}
        dataInstance={`${COMPONENT_NAME}-Context-Menu`}
      />
    </Popover>
  );
};

FilterTableContextMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
};

export default FilterTableContextMenu;
