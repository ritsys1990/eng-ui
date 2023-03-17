import React, { useContext } from 'react';
import { GridView, GapSizes } from 'cortex-look-book';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { dataNavigationOptions } from '../../constants/dataManagementConstants';
import { ThemeContext } from 'styled-components';
import DataLinkItem from '../DataLinkItem/DataLinkItem';

const COMPONENT_NAME = 'DataLinks';

const DataLinksGrid = () => {
  const { pagePermissions } = useCheckAuth({ useEngagementPermissions: true });
  const theme = useContext(ThemeContext);

  return (
    <GridView
      itemsPerRow={3}
      gap={GapSizes.NONE}
      sx={{
        borderRadius: '2px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: theme.colors['gray2'],
      }}
      dataInstance={COMPONENT_NAME}
    >
      {dataNavigationOptions.map((option, index) => {
        return (
          <DataLinkItem
            key={index}
            disabled={option.permissions.find(permission => pagePermissions[permission])}
            option={option}
            index={index}
          />
        );
      })}
    </GridView>
  );
};

export default DataLinksGrid;
