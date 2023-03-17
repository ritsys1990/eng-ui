import React, { useEffect, useState } from 'react';
import { Search, Table, Box, Flex, Text, Spinner, Radio, Alert, AlertTypes } from 'cortex-look-book';
import useTranslation from '../../../hooks/useTranslation';
import { useDispatch } from 'react-redux';
import { getNotebookWorkpapers } from '../../../store/notebookWorkpaperProcess/actions';

export const COMPONENT_NAME = 'NOTEBOOK_WORKPAPER';

const AddDatabrickNotebookWPModal = ({
  onNoteBookSelect,
  selectedNotebook,
  workpaperData,
  showExistingReplaceNotification,
  setShowExistingReplaceNotification,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [notebookData, setNotebookData] = useState({});
  const [showNoti, setShowNoti] = useState('');

  const headerStyle = {
    fontSize: 13,
    backgroundColor: '#F6F6F6',
  };

  useEffect(() => {
    setShowNoti(showExistingReplaceNotification);
  }, [showExistingReplaceNotification]);

  useEffect(() => {
    dispatch(getNotebookWorkpapers()).then(response => {
      if (response.length) {
        response.forEach(data => {
          if (data.sourceAppId === selectedNotebook.sourceAppId) {
            onNoteBookSelect(data);
          }
        });
        setTableData(response);
        setFilteredData(response);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (headers.length) {
      document
        .querySelector('[data-instance="NOTEBOOK_WORKPAPER-Notebook-Table_Table_th-1"]')
        // eslint-disable-next-line sonarjs/no-duplicate-string
        .style.setProperty('font-weight', '700', 'important');
    }
  }, [headers]);

  useEffect(() => {
    if (workpaperData.notebook !== null) {
      setNotebookData(workpaperData.notebook);
    }
  }, [workpaperData.notebook]);

  const clearNotification = () => {
    setShowNoti('');
    setShowExistingReplaceNotification('');
  };

  const radioBtnClick = row => {
    if (notebookData.sourceAppId !== row.sourceAppId) {
      clearNotification();
    }
    onNoteBookSelect(row);
    setNotebookData(row);
  };

  useEffect(() => {
    setHeaders([
      {
        key: '',
        width: '5%',
        headerStyles: headerStyle,
        render: (value, row) => {
          return (
            <Flex
              justifyContent='flex-end'
              cursor='pointer'
              dataInstance={`${COMPONENT_NAME}-${row.sourceAppId}-check`}
            >
              <Radio
                type='radio'
                id={row.sourceAppId}
                value={row.sourceAppId}
                name='workpaper-options'
                checked={notebookData.sourceAppId === row.sourceAppId}
                onClick={() => radioBtnClick(row)}
              />
            </Flex>
          );
        },
      },
      {
        title: t('Notebook_Name'),
        key: 'notebookTitle',
        width: '100%',
        headerStyles: headerStyle,
        render: (notebookTitle, row) => (
          <Flex
            external
            cursor='pointer'
            position='relative'
            width='100%'
            alignItems='center'
            dataInstance={`${COMPONENT_NAME}-Analytic-${row.sourceAppId}`}
          >
            <Text
              dataInstance={`${COMPONENT_NAME}-Analytic-${row.sourceAppId}-name`}
              onClick={() => radioBtnClick(row)}
            >
              {notebookTitle}
            </Text>
          </Flex>
        ),
      },
    ]);
  }, [t, onNoteBookSelect, notebookData]);

  const searchOnChange = value => {
    const newFilteredData = tableData.filter(data =>
      data.notebookTitle.replace(/ /g, '').toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(newFilteredData);
    // setSearchValue(value);
  };

  return (
    <Box pb={10} pt={25} pr={5} dataInstance={`${COMPONENT_NAME}-ClientListing`}>
      {showNoti && <Alert message={showNoti} type={AlertTypes.WARNING} mb={7} onClose={() => clearNotification()} />}
      <Flex mb={20}>
        <Text style={{ fontSize: '20px' }}>{t('Databricks_Notebook_List')}</Text>
        <Box width='40%' ml='auto'>
          <Search
            data={filteredData}
            useSearchKey
            searchKey='notebookTitle'
            onChange={searchOnChange}
            placeholder={t('Search_Notebooks')}
          />
        </Box>
      </Flex>
      <Text style={{ alignSelf: 'center', fontSize: '12px', position: 'relative', top: '-30px' }}>
        {t('Databricks_Notebook_Sub_Header')}
      </Text>
      <Spinner dataInstance={`${COMPONENT_NAME}-Notebook-Table`}>
        <Table
          headers={headers}
          rows={filteredData}
          dataInstance={`${COMPONENT_NAME}-Notebook-Table`}
          contentMaxHeight={300}
          emptyText={t('Notebook_NoResults')}
        />
      </Spinner>
    </Box>
  );
};

export default AddDatabrickNotebookWPModal;
