import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, Popover, PopoverOrigin } from 'cortex-look-book';
import { getSubOrgContextMenuOptions } from '../utils/utils';
import { ContextMenuOptions } from '../constants/constants';
import useTranslation from '../../../../../hooks/useTranslation';
import { useDispatch } from 'react-redux';
import { generateToken } from '../../../../../store/client/actions';
import useCheckAuth from '../../../../../hooks/useCheckAuth';

const COMPONENT_NAME = 'SubOrgContextMenu';

const SubOrgContextMenu = ({
  orgId,
  isOpen,
  buttonRef,
  onClose,
  onEditSubOrgMenu,
  onDeleteSubOrgMenu,
  onRegnerateToken,
  row,
}) => {
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { permissions } = useCheckAuth({ useClientPermissions: true });

  useEffect(() => {
    const contextMenu = getSubOrgContextMenuOptions(t, row, permissions);
    setOptions(contextMenu);
  }, [t, row, permissions]);

  const regenerateToken = () => {
    dispatch(generateToken(row.id, orgId, true));
    onRegnerateToken(row);
  };

  const handleOptionClick = option => {
    if (option.id === ContextMenuOptions.DELETE) {
      onDeleteSubOrgMenu(row);
    }

    if (option.id === ContextMenuOptions.REGENERATE) {
      regenerateToken();
    }

    if (option.id === ContextMenuOptions.EDIT) {
      onEditSubOrgMenu(row);
    }
  };

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
      <ContextMenu options={options} onOptionClicked={handleOptionClick} dataInstance={`${COMPONENT_NAME}_Menu`} />
    </Popover>
  );
};

SubOrgContextMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
};

export default SubOrgContextMenu;
