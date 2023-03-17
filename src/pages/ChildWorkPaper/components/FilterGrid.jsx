import React, { useState, useEffect, useCallback } from 'react';
import useTranslation from '../../../hooks/useTranslation';
import { Table, Box } from 'cortex-look-book';
import { getFilterHeaders } from '../Utils/Utils';
import { COMPONENT_NAME } from '../constants/constants';

const FilterGrid = props => {
  const { t } = useTranslation();
  const { filterData, setFilterData } = props;
  const [filterHeaders, setFilterHeaders] = useState([]);

  const deleteFilter = useCallback(
    rowId => {
      const childWpFilterData = { ...filterData };
      childWpFilterData.filters = filterData?.filters?.filter(item => item.id !== rowId);
      setFilterData(childWpFilterData);
    },
    [filterData]
  );

  useEffect(() => {
    setFilterHeaders(getFilterHeaders(t, deleteFilter));
  }, [t, deleteFilter]);

  return (
    <Box my={8} dataInstance={`${COMPONENT_NAME}_FilterGrid`}>
      {filterData?.filters?.length > 0 && (
        <Box py={8}>
          <Table headers={filterHeaders} rows={filterData?.filters} dataInstance={`${COMPONENT_NAME}_FilterGrid`} />
        </Box>
      )}
    </Box>
  );
};

export default FilterGrid;
