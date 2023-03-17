import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, ButtonTypes, Flex, IconTypes, Popover, ContextMenu, PopoverOrigin } from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';
import { ComponentNames, CONNECTION_STATUS, TRANSLATION_KEY } from './constants';
import { testExistingConnection } from '../../../../store/client/actions';
import LocalizedDate from 'src/components/LocalizedDate/LocalizedDate';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

export const StatusField = ({ status, ...otherProps }) => {
  const { STATUS_FIELD: COMPONENT_NAME } = ComponentNames;
  const { t } = useTranslation();

  const onClickHandler = e => {
    // Needs revisit Table API, for now this workround is being tested.
    e?.currentTarget?.closest('tr')?.querySelector('td')?.firstChild?.click();
  };

  return (
    <Box dataInstance={COMPONENT_NAME} {...otherProps}>
      <Button type={ButtonTypes.LINK} py={2} onClick={onClickHandler}>
        {t(`Components_ClientSetupConnections_Status_${status}`)}
      </Button>
    </Box>
  );
};

export const AddConnectionButton = props => {
  const { onAddConnection, isExtractionScript = false } = props;
  const { ADD_CONNECTION_BUTTON: COMPONENT_NAME } = ComponentNames;
  const { t } = useTranslation();
  const { permissions } = useCheckAuth({ useClientPermissions: true });

  return (
    <Button
      p={2}
      type={ButtonTypes.LINK}
      icon={IconTypes.PLUS}
      onClick={onAddConnection}
      disabled={!checkPermissions(permissions, Permissions.CONNECTIONS, Actions.ADD)}
      iconWidth={20}
      dataInstance={`${COMPONENT_NAME}-AddConnection`}
    >
      {t(`${TRANSLATION_KEY}${isExtractionScript ? 'ConfigureExtraction' : 'AddConnection'}`)}
    </Button>
  );
};

export const CtaButton = props => {
  const { CTA_BUTTON: COMPONENT_NAME } = ComponentNames;

  return (
    <Button
      p={2}
      type={ButtonTypes.FLAT}
      icon={IconTypes.ELLIPSIS_Y}
      iconWidth={18}
      dataInstance={`${COMPONENT_NAME}-CtaButton`}
      {...props}
    />
  );
};

export const CtaMenu = props => {
  const { anchorRef, onClose, onOptionClicked, options, ...otherProps } = props;

  return (
    <Popover
      isOpen={!!anchorRef}
      anchorRef={anchorRef}
      anchorOriginX={PopoverOrigin.START}
      anchorOriginY={PopoverOrigin.START}
      originX={PopoverOrigin.END}
      originY={PopoverOrigin.START}
      onClose={onClose}
      minWidth={200}
      padding={2}
      {...otherProps}
    >
      <ContextMenu options={options} onOptionClicked={onOptionClicked} />
    </Popover>
  );
};

export const TestConnection = connectionData => {
  const { value } = connectionData;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const testConnection = () => {
    dispatch(testExistingConnection(connectionData?.props?.id)).then(result => {
      const title = result?.latestOnlineStatus
        ? t('Components_ClientSetupConnections_Test_Result_Success')
        : t('Components_ClientSetupConnections_Test_Result_Error');
      if (result?.latestTestMessage) {
        connectionData.setIsTestModal(true);
        connectionData.setResponse([title, result?.latestTestMessage]);
      }
    });
  };

  return (
    <Flex justifyContent='flex-start'>
      <Box width='65%'>
        {connectionData.status === CONNECTION_STATUS.NOT_CONFIGURED ? null : <LocalizedDate date={value} isTimeStamp />}
      </Box>
      <Button type={ButtonTypes.LINK} onClick={testConnection}>
        {t('Components_ClientSetupConnections_Test_Title')}
      </Button>
    </Flex>
  );
};
