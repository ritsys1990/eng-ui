import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from '../../../../hooks/useTranslation';
import { Table, Text, TextTypes } from 'cortex-look-book';
import { TRANSLATION_KEY_ACTIVE_ENTITIES } from './constants/constants';
import { getActiveEntitiesTableHeaders } from './utils/Entities.utils';

const COMPONENT_NAME = 'ActiveEntitiesTable';

const ActiveEntitiesTable = ({ entities }) => {
  const [headers, setHeaders] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    setHeaders(getActiveEntitiesTableHeaders(t));
  }, [t]);

  return (
    <>
      <Text type={TextTypes.h4} fontWeight='m' mb={4}>
        {t(TRANSLATION_KEY_ACTIVE_ENTITIES)}
      </Text>
      <Table headers={headers} rows={entities || []} dataInstance={`${COMPONENT_NAME}`} />
    </>
  );
};

ActiveEntitiesTable.propTypes = {
  entities: PropTypes.array.isRequired,
};

export default ActiveEntitiesTable;
