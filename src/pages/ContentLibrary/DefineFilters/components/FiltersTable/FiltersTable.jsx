import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, ButtonTypes, Flex, IconTypes, StateView, Spinner, Table } from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';
import { bundlesSelectors } from 'src/store/bundles/selectors';
import FilterTableContextMenu from './FilterTableContextMenu';
import { COMPONENT_NAME, FILTER_TABLE_KEY, FILTER_TYPES } from './constants';

export const renderFilterOperation = (rowDetails, t) => {
  const allRowDetails = { ...rowDetails };
  const filterOperationList = [
    {
      title: '',
      key: 'isExpandableRow',
      width: '5%',
      iconHeight: 30,
      iconWidth: 30,
      collapseRow: false,
    },
    {
      title: t(`Pages_ContentLibrary_Filter_Table_Filter_Table`),
      key: FILTER_TABLE_KEY.TABLE_NAME,
    },
    {
      title: t(`Pages_ContentLibrary_Filter_Table_Filter_Field`),
      key: FILTER_TABLE_KEY.FIELD_NAME,
    },
    {
      title: t(`Pages_ContentLibrary_Filter_Table_Filter_Criteria`),
      key: FILTER_TABLE_KEY.OPERATION,
    },
    {
      title: t(`Pages_ContentLibrary_Filter_Table_Filter_Text_Example`),
      key: FILTER_TABLE_KEY.FILTER_VALUE,
    },
  ];

  if (allRowDetails.type === FILTER_TYPES.MANDATORY && allRowDetails?.filterOperations) {
    const modifiedFilterOperations = allRowDetails.filterOperations.map(eachRow => ({
      ...eachRow,
      defaultValue: allRowDetails.defaultValue,
    }));

    allRowDetails.filterOperations = [...modifiedFilterOperations];

    filterOperationList.push({
      title: t(`Pages_ContentLibrary_Filter_Table_Default_Value`),
      key: FILTER_TABLE_KEY.DEFAULT_VALUE,
    });
  }

  return (
    <Table
      headers={filterOperationList}
      rows={allRowDetails?.filterOperations}
      expandable
      isRowDisabled={currentRow => {
        return currentRow.id1 > 1;
      }}
      isRowExpandable={() => false}
    />
  );
};

const FiltersTable = props => {
  const { deleteFilterRow, editFilterRow, filterRows, isMenuOpen, setIsMenuOpen, isBundlePublished } = props;
  const { t } = useTranslation();
  const [outerRows, setOuterRows] = useState([]);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [selectedRow, setSeletedRow] = useState([]);
  const [filterListTable, setFilterListTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sourceVersionFilters = useSelector(bundlesSelectors?.selecteSourceVersionFilters);
  const isFetchingAllSourceVersionFilters = useSelector(bundlesSelectors?.selectIsFetchingAllSourceVersionFilters);
  const IsCreatingSourceVersionFilter = useSelector(bundlesSelectors.selectIsCreatingSourceVersionFilter);
  const isEditingSourceFilter = useSelector(bundlesSelectors.selectIsEditingSourceFilter);
  const isDeletingSourceFilter = useSelector(bundlesSelectors?.selectIsDeletingSourceFilter);

  const handleContexButtonClick = useCallback((event, row) => {
    setContextButtonRef({ current: event.target });
    setIsMenuOpen(true);
    setSeletedRow(row);
  }, []);

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setIsLoading(isFetchingAllSourceVersionFilters || isDeletingSourceFilter);
  }, [isFetchingAllSourceVersionFilters, IsCreatingSourceVersionFilter, isEditingSourceFilter, isDeletingSourceFilter]);

  useEffect(() => {
    setFilterListTable([
      {
        title: '',
        key: 'isExpandableRow',
        width: '10%',
        iconHeight: 30,
        iconWidth: 30,
        collapseRow: true,
      },
      {
        title: t(`Pages_ContentLibrary_Filter_Table_Filter_Name`),
        key: FILTER_TABLE_KEY.NAME,
      },
      {
        title: t(`Pages_ContentLibrary_Filter_Table_Filter_Description`),
        key: FILTER_TABLE_KEY.DESCRIPTION,
      },
      {
        title: t(`Pages_ContentLibrary_Filter_Table_Filter_Type`),
        key: FILTER_TABLE_KEY.TYPE,
      },
      {
        title: '',
        key: 'id',
        render: (_, row) => {
          return (
            !isBundlePublished && (
              <Flex justifyContent='flex-end'>
                <Button
                  p={2}
                  sourceVersionFilters={sourceVersionFilters}
                  type={ButtonTypes.FLAT}
                  icon={IconTypes.ELLIPSIS_Y}
                  iconWidth={18}
                  onClick={event => {
                    handleContexButtonClick(event, row);
                  }}
                  dataInstance={`${COMPONENT_NAME}-Filter-Table-Menu`}
                />
              </Flex>
            )
          );
        },
      },
    ]);
  }, [filterRows, sourceVersionFilters]);

  useEffect(() => {
    const filterOuterRows = filterRows?.map(row => {
      const filters = row?.filterOperations;
      const filterDetails = filters?.map((filter, index) => {
        return {
          tableId: row.tableId,
          tableName: index === 0 ? row.tableName : '',
          fieldName: index === 0 ? row.fieldName : '',
          operation: filter?.filterCriteria || '',
          filterValue: filter?.filterValue || '',
        };
      });

      return {
        id: row.id,
        name: row.name,
        description: row.description,
        type: row.type,
        filterOperations: filterDetails,
        tableId: row.tableId,
        fieldId: row.fieldId,
        tableName: row.tableName,
        fieldName: row.fieldName,
        defaultValue: row.defaultValue,
      };
    });
    setOuterRows(filterOuterRows);
  }, [filterRows, setOuterRows]);

  const emptyStateText = t('Pages_ContentLibrary_Define_Filters_No_Filters_Message');

  return (
    <Spinner pb={60} spinning={isLoading} overlayOpacity={0.7} dataInstance={`${COMPONENT_NAME}-spinner`}>
      {filterRows?.length > 0 ? (
        <Box>
          <FilterTableContextMenu
            deleteFilterRow={deleteFilterRow}
            editFilterRow={editFilterRow}
            isOpen={isMenuOpen}
            buttonRef={contextButtonRef}
            onClose={handleClose}
            selectedRow={selectedRow}
            dataInstance={`${COMPONENT_NAME}-Filter-Context-Menu`}
          />
          <Table
            headers={filterListTable}
            rows={outerRows}
            renderInnerTemplate={row => {
              return renderFilterOperation(row, t);
            }}
            isRowExpandable={() => true}
            isRowDisabled={() => false}
            isRowOpen={() => false}
            dataInstance={`${COMPONENT_NAME}-Filter-Table`}
          />
        </Box>
      ) : (
        <Box>
          <StateView title={emptyStateText} />;
        </Box>
      )}
    </Spinner>
  );
};

export default FiltersTable;
