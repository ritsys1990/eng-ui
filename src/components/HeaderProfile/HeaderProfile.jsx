import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Button, ButtonTypes, ContextMenu, Popover, PopoverOrigin } from 'cortex-look-book';
import env from 'env';
import { securitySelectors } from '../../store/security/selectors';
import useTranslation from 'src/hooks/useTranslation';
import LanguageSelect from '../LanguageSelect/LanguageSelect';
import MenuHeader from './MenuHeader';
import { logoutWrapper } from '../../utils/logoutHelper';

const COMPONENT_NAME = 'HeaderProfile';

const HeaderProfile = props => {
  const { ...extraProps } = props;
  const { t } = useTranslation();
  const containerRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [initials, setInitials] = useState('');
  const [menuOptions, setMenuOptions] = useState([]);
  const [languageSelectIsOpen, setLanguageSelectIsOpen] = useState(false);

  const me = useSelector(securitySelectors.selectMe);

  useEffect(() => {
    const firstName = me.firstName || '';
    const lastName = me.lastName || '';
    setInitials(`${firstName[0] || ''}${lastName[0] || ''}`);
  }, [me]);

  useEffect(() => {
    setMenuOptions([
      { id: 'profile', text: t('Components_HeaderProfile_MenuOption_Profile') },
      { id: 'language', text: <LanguageSelect setLanguageSelectIsOpen={setLanguageSelectIsOpen} /> },
      { id: 'logout', text: t('Components_HeaderProfile_LogOut') },
    ]);
  }, [t]);

  const handleButtonClick = () => {
    setIsOpen(true);
  };

  /**
   * Consider adding ADFS logout.
   */
  const logout = () => {
    logoutWrapper();
  };

  const handleOptionClicked = option => {
    switch (option.id) {
      case 'profile':
        window.location.href = `${env.EXTRACTIONUI_URL}/profile`;
        break;
      case 'logout':
        logout();
        break;
      case 'language':
        setLanguageSelectIsOpen(!languageSelectIsOpen);
        break;
      default:
    }
  };

  const handlePopoverClose = () => {
    if (!languageSelectIsOpen) {
      setIsOpen(false);
    }
    setLanguageSelectIsOpen(false);
  };

  return (
    <Box {...extraProps}>
      <div ref={containerRef}>
        <Button type={ButtonTypes.FLAT} onClick={() => handleButtonClick()} dataInstance={COMPONENT_NAME}>
          <Avatar backgroundColor='blue' overlayOpacity={0.6} size={30}>
            {initials}
          </Avatar>
        </Button>
      </div>

      <Popover
        isOpen={isOpen}
        anchorRef={containerRef}
        anchorOriginX={PopoverOrigin.END}
        anchorOriginY={PopoverOrigin.END}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.START}
        onClose={handlePopoverClose}
        mt={5}
        width={200}
        dataInstance={COMPONENT_NAME}
      >
        <ContextMenu
          options={menuOptions}
          header={<MenuHeader />}
          onOptionClicked={handleOptionClicked}
          dataInstance={COMPONENT_NAME}
        />
      </Popover>
    </Box>
  );
};

export default HeaderProfile;
