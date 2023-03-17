import React, { useEffect, useState, useCallback } from 'react';
import { Search, Table, Box, Flex, Text, Checkbox, Spinner } from 'cortex-look-book';
import { useSelector, useDispatch } from 'react-redux';
import { getClientList } from '../../store/client/actions';
import { clientSelectors } from '../../store/client/selectors';
import useTranslation from '../../hooks/useTranslation';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';
import useDebounce from 'src/hooks/useDebounce';

export const COMPONENT_NAME = 'CLIENT_TABLE';

const ClientTable = ({ onClientSelect, selectedClients }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const clients = useSelector(clientSelectors.selectList);
  const isFetchingClients = useSelector(clientSelectors.selectFetchingList);
  const [searchValue, setSearchValue] = useState('');
  const [headers, setHeaders] = useState([]);
  const [elementScrollRef, setElementScrollRef] = useState(null);
  const [containerScrollRef, setContainerScrollRef] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const debouncedInputValue = useDebounce(searchValue, 300);
  const PAGE_SIZE = 20;

  useEffect(() => {
    dispatch(getClientList(debouncedInputValue));
  }, [debouncedInputValue]);

  const handleInfiniteScroll = useCallback(() => {
    if (!isFetchingClients && filteredClients.length !== clients.totalCount) {
      dispatch(getClientList(searchValue, PAGE_SIZE, filteredClients.length || 0, true, true));
    }
  }, [clients.totalCount, filteredClients.length, isFetchingClients, searchValue, dispatch]);

  useInfiniteScroll(elementScrollRef, handleInfiniteScroll, 10, containerScrollRef);

  useEffect(() => {
    setHeaders([
      {
        key: '',
        width: '15%',
        render: (value, row) => {
          const isChecked = !!selectedClients.find(client => client === row.id);

          return (
            <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${COMPONENT_NAME}-${row.id}-check`}>
              <Checkbox
                dataInstance={`${COMPONENT_NAME}-${row.id}-checkbox`}
                isChecked={isChecked}
                onChange={() => {
                  onClientSelect(row.id, isChecked);
                }}
              />
            </Flex>
          );
        },
      },
      {
        title: t('Pages_Content_Library_PipelinesListing_Pipeline_ClientsListTitle'),
        key: 'name',
        width: '85%',
        render: (name, row) => (
          <Flex
            external
            cursor='pointer'
            position='relative'
            width='100%'
            alignItems='center'
            dataInstance={`${COMPONENT_NAME}-Client-${row.id}`}
          >
            <Text
              ellipsisTooltip
              tooltipWrapperWidth='inherit'
              fontWeight='m'
              dataInstance={`${COMPONENT_NAME}-Client-${row.id}-name`}
            >
              {name}
            </Text>
          </Flex>
        ),
      },
    ]);
  }, [t, onClientSelect, selectedClients]);

  const searchOnChange = value => {
    setSearchValue(value);
  };

  useEffect(() => {
    setFilteredClients(clients.items || []);
  }, [clients]);

  return (
    <Box pb={10} dataInstance={`${COMPONENT_NAME}-ClientListing`}>
      <Search data={clients.items || []} onChange={searchOnChange} useSearchKey searchKey='name' />
      <Spinner spinning={isFetchingClients} dataInstance={`${COMPONENT_NAME}-ClientListing-Table`}>
        <Table
          headers={headers}
          rows={filteredClients}
          dataInstance={`${COMPONENT_NAME}-ClientListing`}
          contentMaxHeight={300}
          setElementScrollRef={setElementScrollRef}
          setContainerScrollRef={setContainerScrollRef}
          emptyText={t('Components_ClientsListing_NoSearchResults')}
        />
      </Spinner>
    </Box>
  );
};

export default ClientTable;
