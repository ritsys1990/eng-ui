import React, { useCallback, useEffect, useState } from 'react';
import { Button, ButtonTypes, IconTypes, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { clientSelectors } from 'src/store/client/selectors';
import { getClientDataSources } from 'src/store/client/actions';
import { ComponentNames, TRANSLATION_KEY } from './constants';
import useTranslation from 'src/hooks/useTranslation';
import DataSourcesTable from './DataSourcesTable';
import DataSourceManager from './DataSourceManager';
import useCheckAuth from 'src/hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

const { MAIN: COMPONENT_NAME } = ComponentNames;

const DataSources = props => {
  const { clientId } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const dataSources = useSelector(clientSelectors.selectDataSources);
  const isFetchingDataSources = useSelector(clientSelectors.selectIsFetchingDataSources);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const { permissions } = useCheckAuth({ useClientPermissions: true });

  useEffect(() => {
    dispatch(getClientDataSources(clientId));
  }, [dispatch, clientId]);

  const addDataSourceButtonHandler = useCallback(() => {
    setIsManageOpen(true);
  }, [setIsManageOpen]);

  const managerCloseHandler = useCallback(() => {
    setIsManageOpen(false);
  }, [setIsManageOpen]);

  return (
    <Spinner dataInstance={COMPONENT_NAME} spinning={isFetchingDataSources} pl={90}>
      <Text color='gray' mb={8}>
        {t(`${TRANSLATION_KEY}Instructions`)}
      </Text>
      {dataSources?.length > 0 ? (
        <DataSourcesTable dataInstance={`${COMPONENT_NAME}-Table`} dataSources={dataSources} />
      ) : (
        <Text dataInstance={`${COMPONENT_NAME}-EmptyState`} textAlign='center' p={8}>
          {t(`${TRANSLATION_KEY}Empty`)}
        </Text>
      )}
      <Button
        type={ButtonTypes.LINK}
        icon={IconTypes.PLUS}
        iconWidth={20}
        onClick={addDataSourceButtonHandler}
        dataInstance={`${COMPONENT_NAME}-AddDataSourceButton`}
        disabled={!checkPermissions(permissions, Permissions.DATA_SOURCES, Actions.ADD)}
        mt={8}
      >
        <Text type={TextTypes.H3}>{t(`${TRANSLATION_KEY}AddDataSource`)}</Text>
      </Button>
      <DataSourceManager isOpen={isManageOpen} onClose={managerCloseHandler} />
    </Spinner>
  );
};

export default DataSources;
