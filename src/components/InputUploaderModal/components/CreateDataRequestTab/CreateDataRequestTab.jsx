import React from 'react';
import { Flex, Text, TextTypes, Select, Box } from 'cortex-look-book';
import PropTypes from 'prop-types';
import useTranslation from '../../../../hooks/useTranslation';
import { COMPONENT_NAME } from './constants';

export const CreateDataRequestTab = props => {
  const { sourceSystemBundles, dataSources, onChangeDataSource } = props;
  const { t } = useTranslation();

  const getDataSourceValue = selectedSourceSystemBundle => {
    return [dataSources?.find(dataSource => dataSource.id === selectedSourceSystemBundle?.dataSourceId)];
  };

  const getDataSources = () => {
    return dataSources?.filter(
      dataSource => dataSource.id !== 0 && sourceSystemBundles[0].sourceVersionId === dataSource.sourceId
    );
  };

  return (
    <Box dataInstance={COMPONENT_NAME}>
      <Text type={TextTypes.BODY} fontWeight='s' py={10} pl={5}>
        {t('Components_CreateDataRequestTab_Instructions')}
      </Text>

      <Flex pl={5} pb={5}>
        <Text type={TextTypes.BODY} fontWeight='s' width='25%'>
          {t('Components_CreateDataRequestTab_Bundle_Header')}
        </Text>
        <Text type={TextTypes.BODY} fontWeight='s' width='25%'>
          {t('Components_CreateDataRequestTab_Data_Source_Header')}
        </Text>
      </Flex>

      {sourceSystemBundles?.map(sourceSystemBundle => (
        <Flex
          key={sourceSystemBundle.id}
          pl={5}
          pb={5}
          alignItems='center'
          dataInstance={`${COMPONENT_NAME}-SourceSystemBundle-${sourceSystemBundle.id}`}
        >
          <Text type={TextTypes.BODY} fontWeight='s' width='25%'>
            {sourceSystemBundle.name}
          </Text>
          <Select
            dataInstance={`${COMPONENT_NAME}-DataSourceSelector-${sourceSystemBundle.id}`}
            width='25%'
            value={getDataSourceValue(sourceSystemBundle)}
            onChange={value => onChangeDataSource(sourceSystemBundle, value)}
            options={getDataSources()}
            optionValueKey='id'
            optionTextKey='name'
            customRenderSelected={(option, index) => (
              <Text key={index} type={TextTypes.BODY}>
                {option.name}
              </Text>
            )}
          />
        </Flex>
      ))}
    </Box>
  );
};

CreateDataRequestTab.propTypes = {
  sourceSystemBundles: PropTypes.array,
  dataSources: PropTypes.array,
  onChangeDataSource: PropTypes.func.isRequired,
};

CreateDataRequestTab.defaultProps = {
  sourceSystemBundles: [],
  dataSources: [],
};
