import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  ContextMenu,
  Flex,
  Icon,
  IconTypes,
  Modal,
  ModalSizes,
  Popover,
  PopoverOrigin,
  Text,
  TextTypes,
  Spinner,
} from 'cortex-look-book';
import { engagementType, MenuOptions } from './constants/menu-options';
import { useDispatch } from 'react-redux';
import env from 'env';
import { initiateLegalhold, getMyEngagementsUserRole } from '../../../../store/engagement/actions';
import { checkPermissions, PagePermissions } from '../../../../utils/permissionsHelper';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { COMPONENT_NAME } from './constants/constants';
import useTranslation from 'src/hooks/useTranslation';

const EngagementSettings = props => {
  const { engagementId, clientId, closeoutStatus, legalHoldStatus } = props;
  const { t } = useTranslation();
  const containerRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isContextOpen, setContextOpen] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmButton, setIsConfirmButton] = useState(false);
  const [engagementOption, setEngageMentOption] = useState('');
  const permissions = useCheckAuth({ useEngagementPermissions: true });

  const dispatch = useDispatch();

  const closeout = () => (
    <Box mb={4}>
      <Text type={TextTypes.H2} fontWeight='l' mb={4}>
        {t('Components_Engagement_Settings_Closeout_Modal_Title')}
      </Text>
      <Text type={TextTypes.BODY} mt={4} mb={10}>
        {t('Components_Engagement_Settings_Closeout_Modal_Desc')}
      </Text>
    </Box>
  );

  const closeoutConfirm = () => (
    <Box mb={4}>
      <Text type={TextTypes.H2} fontWeight='l' mb={4} width='80%'>
        {t('Components_Engagement_Settings_Closeout_Confirm_Modal_Title')}
      </Text>
      <Text type={TextTypes.BODY} mt={4} mb={10}>
        {t('Components_Engagement_Settings_Closeout_Confirm_Modal_Desc')}
      </Text>
    </Box>
  );

  const legalhold = () => (
    <Box mb={4}>
      <Text type={TextTypes.H2} fontWeight='l' mb={4}>
        {t('Components_Engagement_Settings_Legalhold_Modal_Title')}
      </Text>
      <Text type={TextTypes.BODY} mt={4} mb={10}>
        {t('Components_Engagement_Settings_Legalhold_Modal_Desc')}
      </Text>
    </Box>
  );

  const handlePopoverOnClose = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setModalOpen(!isModalOpen);
  };

  const handleRedirect = option => {
    if (option === engagementType.CLOSE_OUT) {
      window.location.href = `${env.EXTRACTIONUI_URL}/closeout/${engagementId}/${clientId}`;
    } else {
      window.location.href = `${env.EXTRACTIONUI_URL}/legalhold/${engagementId}/${clientId}`;
    }
  };

  const handleLegalHold = () => {
    if (legalHoldStatus !== 'None') {
      handleRedirect(engagementType.LEGAL_HOLD);
    } else {
      setEngageMentOption(engagementType.LEGAL_HOLD);
      setIsConfirmButton(true);
      setContextOpen(!isContextOpen);
      setModalContent(legalhold);
      setModalOpen(!isModalOpen);
    }
  };

  const handleCloseout = () => {
    const engagementPPMDRole = 'PPMD';
    dispatch(getMyEngagementsUserRole(engagementId)).then(users => {
      const engagementUsersRoles = [];
      const usersList = users?.items || [];
      usersList.forEach(user => {
        const roles = user?.roles || [];
        roles.forEach(role => {
          engagementUsersRoles.push(role.name);
        });
      });

      setEngageMentOption(engagementType.CLOSE_OUT);
      if (engagementUsersRoles.indexOf(engagementPPMDRole) !== -1) {
        if (closeoutStatus !== 'None') {
          handleRedirect(engagementType.CLOSE_OUT);
        } else {
          setIsConfirmButton(true);
          setContextOpen(!isContextOpen);
          setModalContent(closeoutConfirm);
          setModalOpen(!isModalOpen);
        }
      } else {
        setIsConfirmButton(false);
        setContextOpen(!isContextOpen);
        setModalContent(closeout);
        setModalOpen(!isModalOpen);
      }
    });
  };

  const handleOptionClicked = option => {
    switch (option.id) {
      case engagementType.CLOSE_OUT:
        if (permissions.pagePermissions[PagePermissions.ENGAGEMENT_CLOSEOUT]) {
          handleCloseout();
        }
        break;
      case engagementType.LEGAL_HOLD:
        if (permissions.pagePermissions[PagePermissions.ENGAGEMENT_LEGAL_HOLD]) {
          handleLegalHold();
        }
        break;
      default:
    }
  };

  const handleModalOk = () => {
    switch (engagementOption) {
      case engagementType.LEGAL_HOLD:
        setIsLoading(true);
        dispatch(initiateLegalhold(engagementId)).then(success => {
          if (success) {
            handleRedirect(engagementType.LEGAL_HOLD);
          } else {
            setIsLoading(false);
            setModalOpen(false);
          }
        });
        break;
      case engagementType.CLOSE_OUT:
        if (isConfirmButton) {
          handleRedirect(engagementType.CLOSE_OUT);
        } else {
          setModalOpen(!isModalOpen);
        }
        break;
      default:
    }
  };

  const filteredMenu = MenuOptions.filter(option => {
    return checkPermissions(permissions.permissions, option.permission, option.action);
  }).map(data => {
    return { ...data, text: t(data.text) };
  });

  return (
    filteredMenu.length > 0 && (
      <Flex alignItems='center'>
        <div ref={containerRef}>
          <Button type={ButtonTypes.FLAT} onClick={() => setIsOpen(!isOpen)} dataInstance={COMPONENT_NAME}>
            <Icon type={IconTypes.ENGAGEMENT_RESOURCES} size={30} dataInstance={COMPONENT_NAME} />
          </Button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(!isModalOpen)}
          onClickOutside={() => setModalOpen(!isModalOpen)}
          {...(isConfirmButton && {
            onSecondaryButtonClick: handleClose,
          })}
          secondaryButtonText={t('Components_Engagement_Settings_Secondary_Button_Text')}
          onPrimaryButtonClick={handleModalOk}
          primaryButtonText={t('Components_Engagement_Settings_Primary_Button_Text')}
          size={ModalSizes.SMALL}
          disablePrimaryButton={isLoading}
          disableSecondaryButton={isLoading}
          dataInstance={COMPONENT_NAME}
        >
          <Spinner spinning={isLoading}>{modalContent}</Spinner>
        </Modal>

        <Popover
          isOpen={isOpen}
          anchorRef={containerRef}
          anchorOriginX={PopoverOrigin.END}
          anchorOriginY={PopoverOrigin.END}
          originX={PopoverOrigin.END}
          originY={PopoverOrigin.START}
          onClose={handlePopoverOnClose}
          width={100}
          mt={7}
          dataInstance={COMPONENT_NAME}
        >
          <ContextMenu options={filteredMenu} onOptionClicked={handleOptionClicked} dataInstance={COMPONENT_NAME} />
        </Popover>
      </Flex>
    )
  );
};
export default EngagementSettings;
