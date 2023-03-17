import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  ClientCard,
  Container,
  ContextMenu,
  GapSizes,
  GridView,
  HeaderBar,
  IconTypes,
  ListView,
  Popover,
  PopoverOrigin,
  Spinner,
  StateView,
  Text,
  TextTypes,
  ViewTypes,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEmpty } from 'lodash';
import { getClientList } from 'src/store/client/actions';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';
import AddClientModal from './components/AddClientModal/AddClientModal';
import AuditDisclaimer from 'src/components/AuditDisclaimer/AuditDisclaimer';
import useCheckAuth from 'src/hooks/useCheckAuth';
import { isAutoProvision } from 'src/utils/securityHelper';
import { useHistory } from 'react-router-dom';
import { Actions, checkPermissions, PagePermissions, Permissions } from '../../utils/permissionsHelper';
import { securitySelectors } from '../../store/security/selectors';
import { clientSelectors } from '../../store/client/selectors';
import { getContextMenuOptions } from './utils/clientsHelper';
import DeleteClientModal from './components/DeleteClientModal/DeleteClientModal';
import { Flex } from 'reflexbox';
import { ContextMenuOptions } from './constants/clients.constants';
import useTranslation from 'src/hooks/useTranslation';

const PAGE_NAME = 'Clients';

// eslint-disable-next-line sonarjs/cognitive-complexity
const Clients = () => {
  const [clientsToShow, setClientsToShow] = useState([]);
  const [prevClientsLength, setPrevClientsLength] = useState(0);
  const [contentType, setContentType] = useState(ViewTypes.TILE_VIEW);
  const [searchValue, setSearchValue] = useState('');
  const [addClientIsOpen, setAddClientIsOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const { pagePermissions } = useCheckAuth();
  const history = useHistory();

  const dispatch = useDispatch();
  const clients = useSelector(clientSelectors.selectList);
  const isFetchingClients = useSelector(clientSelectors.selectFetchingList);
  const roles = useSelector(securitySelectors.selectMeRoles);
  const me = useSelector(securitySelectors.selectMe);
  const permissions = useCheckAuth();

  const refContainer = useRef();

  const PAGE_SIZE = 20;
  const MANUAL_CLIENT_LABEL = 'MANUAL_CLIENT_LABEL';
  const { t } = useTranslation();

  const hasPagePermissions = () => {
    if (isEmpty(roles) || isEmpty(pagePermissions)) {
      return false;
    }

    return (
      isAutoProvision(roles, me) ||
      pagePermissions[PagePermissions.CLIENT_VIEW] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_LIST]
    );
  };

  const handleSearchChange = debounce(value => {
    setSearchValue(value);
  }, 300);

  const handleAddClientModal = isOpen => {
    setAddClientIsOpen(isOpen);
  };

  const handleGoToClient = clientId => {
    history.push(`/clients/${clientId}`);
  };

  const handleInfiniteScroll = useCallback(() => {
    if (!isFetchingClients && clientsToShow.length !== clients.totalCount) {
      dispatch(getClientList(searchValue, PAGE_SIZE, clientsToShow.length || 0, true, true));
    }
  }, [clients.totalCount, clientsToShow.length, isFetchingClients, searchValue, dispatch]);

  const handleContexButtonClick = (event, clientId) => {
    setContextButtonRef({ current: event.target });
    setSelectedClientId(clientId);
    setIsMenuOpen(true);
  };

  const handleOptionClick = option => {
    switch (option.id) {
      case ContextMenuOptions.DELETE:
        setIsDeleteClientModalOpen(true);
        break;
      case ContextMenuOptions.EDIT:
      default:
        history.push(`/clients/${selectedClientId}/setup`);
    }
  };

  const getClientContextMenuOptions = client => {
    return getContextMenuOptions(t).filter(opt => {
      const hasPermission = checkPermissions(permissions.permissions, opt.permission.permission, opt.permission.action);
      let extraChecks = true;

      switch (opt.id) {
        case ContextMenuOptions.DELETE:
          extraChecks = !(client?.viewEngagementsCounts ? client?.viewEngagementsCounts.total : 0);
          break;
        case ContextMenuOptions.EDIT:
        default:
      }

      return hasPermission && extraChecks;
    });
  };

  const renderContextMenu = () => {
    const client = clientsToShow.find(element => element.id === selectedClientId);
    const options = getClientContextMenuOptions(client);

    return <ContextMenu options={options} onOptionClicked={handleOptionClick} dataInstance={PAGE_NAME} />;
  };

  const handleShowAddClientButton = () => {
    if (isEmpty(roles) || isEmpty(permissions?.permissions)) {
      return null;
    }

    if (isAutoProvision(roles, me) || checkPermissions(permissions.permissions, Permissions.CLIENT, Actions.ADD)) {
      return () => handleAddClientModal(true);
    }

    return null;
  };

  /**
   * Added this hook for handling legacy login redirect url.
   */
  useEffect(() => {
    const path = window.location.pathname.split('/');
    if (window.opener && path.indexOf('clients') > 0) {
      window.location.replace('/legacy-login?popup=true');
    }
  }, []);

  useEffect(() => {
    document.title = `${t('PageTitle_MyClients')} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
  }, [clients]);

  useEffect(() => {
    setClientsToShow(clients.items || []);
  }, [clients]);

  useEffect(() => {
    if (
      clientsToShow.length &&
      prevClientsLength !== clientsToShow.length &&
      document.querySelector('body').clientHeight === window.innerHeight
    ) {
      handleInfiniteScroll();
    }
    setPrevClientsLength(clientsToShow.length);
  }, [clientsToShow, prevClientsLength, handleInfiniteScroll]);

  useEffect(() => {
    dispatch(getClientList(searchValue));
  }, [searchValue, dispatch]);

  useInfiniteScroll(refContainer, handleInfiniteScroll, 100);

  const headers = [
    {
      title: t('Pages_Clients_ClientName'),
      key: 'clientName',
      render: (name, row) => {
        return (
          <div>
            <Text
              ellipsisTooltip
              type={TextTypes.H3}
              tooltipWrapperWidth='inherit'
              charLimit={82}
              fontWeight='m'
              onClick={() => handleGoToClient(row.id)}
            >
              {row.name}
            </Text>
          </div>
        );
      },
    },
    {
      title: t('Pages_Clients_ClientID'),
      key: 'clientId',
      render: (name, row) => (
        <Text cursor='pointer' onClick={() => handleGoToClient(row.id)}>
          {row?.matCustomerNumber || t(MANUAL_CLIENT_LABEL)}
        </Text>
      ),
      id: 2,
    },
    {
      title: t('Pages_Clients_Country'),
      key: 'country',
      render: (name, row) => (
        <Text cursor='pointer' onClick={() => handleGoToClient(row.id)}>
          {row.countries}
        </Text>
      ),
      id: 3,
    },
    {
      title: '',
      key: 'id',
      render: (clientId, row) =>
        getClientContextMenuOptions(row).length > 0 && (
          <Flex justifyContent='flex-end'>
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                handleContexButtonClick(event, clientId);
              }}
            />
          </Flex>
        ),
      id: 2,
    },
  ];

  const renderClientsList = () => {
    if (isFetchingClients && clientsToShow.length === 0) {
      return <Spinner spinning hideOverlay />;
    } else if (clientsToShow.length > 0) {
      if (contentType === ViewTypes.TILE_VIEW) {
        return (
          <div ref={refContainer}>
            <GridView gap={GapSizes.EXTRA_LARGE} itemsPerRow={3} itemsPerRowMd={4} mb={9} dataInstance={PAGE_NAME}>
              {clientsToShow.map(client => (
                <ClientCard
                  dataInstance={`${PAGE_NAME}-${client.id}`}
                  id={client.id}
                  key={client.id}
                  clientLink={`/clients/${client.id}`}
                  name={
                    <Text
                      forwardedAs='span'
                      ellipsisTooltip
                      tooltipWrapperWidth='inherit'
                      charLimit={28}
                      fontWeight='m'
                    >
                      {client.name}
                    </Text>
                  }
                  properties={[
                    {
                      key: t('Pages_Clients_ClientCard_ClientID'),
                      value: client?.matCustomerNumber || t(MANUAL_CLIENT_LABEL),
                    },
                    {
                      key: t('Pages_Clients_CountryName'),
                      value: client.countries,
                    },
                  ]}
                  handleContextButton={getClientContextMenuOptions(client).length > 0 ? handleContexButtonClick : null}
                />
              ))}
            </GridView>
            {isFetchingClients ? <Spinner spinning hideOverlay /> : null}
          </div>
        );
      }

      return (
        <div ref={refContainer}>
          <ListView headers={headers} rows={clientsToShow} dataInstance={PAGE_NAME} />
          {isFetchingClients ? <Spinner spinning hideOverlay /> : null}
        </div>
      );
    }

    return <StateView title={t('Pages_Clients_NoClientsFound')} dataInstance={`${PAGE_NAME}_NoClientsFound`} />;
  };

  return (
    <>
      {hasPagePermissions() ? (
        <>
          <HeaderBar
            currentView={contentType}
            hideViewChange={false}
            onViewChange={type => setContentType(type)}
            title={t('Pages_Clients_HeaderBar_Title')}
            searchData={clients.items || []}
            onPrimaryButtonClick={handleShowAddClientButton()}
            onSearchChange={handleSearchChange}
            primaryButtonText={t('Pages_Clients_HeaderBar_PrimButtonText')}
            searchKey='name'
            useSearchKey
            dataInstance={PAGE_NAME}
            searchPlaceholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
          />
          <AddClientModal isOpen={addClientIsOpen} handleClose={() => handleAddClientModal(false)} />
          <Box pt={12}>
            <Container>
              {renderClientsList()}
              <Box py={12}>
                <AuditDisclaimer />
              </Box>
              <Popover
                isOpen={isMenuOpen}
                anchorRef={contextButtonRef}
                anchorOriginX={PopoverOrigin.START}
                anchorOriginY={PopoverOrigin.START}
                originX={PopoverOrigin.END}
                originY={PopoverOrigin.START}
                onClose={() => setIsMenuOpen(false)}
                width={125}
                mt={7}
                dataInstance={PAGE_NAME}
              >
                {renderContextMenu()}
              </Popover>
              <DeleteClientModal
                isOpen={isDeleteClientModalOpen}
                onClose={() => {
                  setIsDeleteClientModalOpen(false);
                }}
                clientId={selectedClientId}
                data-instance={PAGE_NAME}
              />
            </Container>
          </Box>
        </>
      ) : (
        <Box pt={12}>
          <Container>
            <Text>{t('Pages_Clients_NoPermissions')}</Text>
          </Container>
        </Box>
      )}
    </>
  );
};

export default Clients;
