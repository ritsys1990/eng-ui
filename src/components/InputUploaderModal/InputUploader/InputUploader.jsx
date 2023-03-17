import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, RadioGroup as RadioGroupObj, Text, TextTypes, Input, Select, Tabs } from 'cortex-look-book';
import useConfig from '../../WorkPaperProcess/hooks/useConfig';
import { COMPONENT_NAME } from './constants';
import { noop } from '../../../utils/errorHelper';
import useTranslation from '../../../hooks/useTranslation';
import { WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';
import useCheckAuth from '../../../hooks/useCheckAuth';
import { INPUT_UPLOADER_TYPES } from '../constants/constants';
import { CreateDataRequestTab } from '../components/CreateDataRequestTab/CreateDataRequestTab';
import { PagePermissions } from '../../../utils/permissionsHelper';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const InputUploader = props => {
  const { t } = useTranslation();
  const {
    value,
    onSelected,
    isNewUpload,
    dataTableNameAssign,
    shouldClean,
    canvasType,
    selectedInput,
    selectedDataSources,
    setSelectedDataSources,
    onChangeBundleDataSource,
    onChangeBundleSourceSystem,
  } = props;

  const { config } = useConfig(canvasType);
  const [inputOptionValue, setInputOptionValue] = useState('');
  const [sourceSystemValue, setSourceSystemValue] = useState([
    {
      id: 0,
      name: t('Components_InputUploaderModal_Source_System_Placeholder'),
    },
  ]);
  const [sourceSystems, setSourceSystems] = useState([]);
  const [sourceSystemBundles, setSourceSystemBundles] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [sourceSystemTabs, setSourceSystemTabs] = useState([]);
  const permissions = useCheckAuth({ useEngagementPermissions: true });

  let options = config.step1.inputUploadModal.attachOptions;
  if (isNewUpload) {
    if (!selectedInput?.id) {
      options = config.step1.inputUploadModal.options;
    }
  } else if (!shouldClean) {
    if (selectedInput?.linkedBundles?.length > 0 && selectedInput?.dataSourceSubsribed?.length > 0) {
      options = config.step1.inputUploadModal.appendOptions;
      if (!permissions?.pagePermissions[PagePermissions.ENGAGEMENT_DATA_REQUEST]) {
        config.step1.inputUploadModal.appendOptions.map((option, i) => {
          if (option.value === INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST) {
            config.step1.inputUploadModal.appendOptions[i].isDisabled = true;
          }

          return config.step1.inputUploadModal.appendOptions[i];
        });
      }
    } else {
      if (config.step1.inputUploadModal.appendOptions.length > 2) {
        config.step1.inputUploadModal.appendOptions.pop();
      }
      options = config.step1.inputUploadModal.appendOptions;
    }
  }

  useEffect(() => {
    setInputOptionValue(selectedInput?.name);
    dataTableNameAssign(selectedInput?.name);
  }, [selectedInput]);

  const getSourceSystems = linkedBundles => {
    const sourceSystemName = [];
    linkedBundles?.forEach((bundle, index) => {
      sourceSystemName.push({ id: index + 1, sourceId: bundle.sourceId, name: bundle.sourceName });
    });
    setSourceSystems(sourceSystemName);
  };

  const getSourceSystemBundles = (linkedBundles, selectedSourceSystem) => {
    const bundleNames = [];
    linkedBundles?.forEach(linkedBundle => {
      if (linkedBundle.sourceId === selectedSourceSystem[0]?.sourceId) {
        linkedBundle?.bundles?.forEach(bundle => {
          bundleNames.push({
            id: bundle.bundleId,
            name: bundle.bundleName,
            dataSourceId: 0,
            sourceVersionId: bundle.sourceVersionId,
          });
        });
      }
    });
    setSourceSystemBundles(bundleNames);
  };

  const getDataSources = subscribedDataSources => {
    if (subscribedDataSources) {
      const dataSourcesList = [...subscribedDataSources];
      dataSourcesList.unshift({
        id: 0,
        name: t('Components_InputUploaderModal_Data_Source_Placeholder'),
      });

      setDataSources(dataSourcesList);
    }
  };

  const dataSourceSubsribed = [];
  selectedInput?.dataSourceSubsribed?.forEach(subscribed => {
    subscribed?.subscribedDataSources?.forEach(subcribedDS => {
      dataSourceSubsribed.push(subcribedDS);
    });
  });

  const onChangeSourceSystem = systemValue => {
    setSourceSystemValue(systemValue);
    getSourceSystemBundles(selectedInput?.linkedBundles, systemValue);
    getDataSources(dataSourceSubsribed);
    onChangeBundleSourceSystem();
  };

  const onChangeDataSource = (selectedSourceSystemBundle, selectedDataSource) => {
    const newSourceSystemBundles = sourceSystemBundles?.map(sourceSystemBundle => {
      const newSourceSystemBundle = { ...sourceSystemBundle };
      if (sourceSystemBundle?.id === selectedSourceSystemBundle?.id && selectedDataSource?.[0]?.id) {
        newSourceSystemBundle.dataSourceId = selectedDataSource?.[0]?.id;
      }

      if (
        selectedDataSources.filter(dataSource => dataSource.dataSourceId === newSourceSystemBundle.dataSourceId)
          .length < 1
      ) {
        const lists = selectedDataSources.filter(dataSource => {
          return dataSource.id !== newSourceSystemBundle.id;
        });
        setSelectedDataSources([...lists, newSourceSystemBundle]);
      }

      return newSourceSystemBundle;
    });

    setSourceSystemBundles(newSourceSystemBundles);
    onChangeBundleDataSource(newSourceSystemBundles);
  };

  useEffect(() => {
    if (value === INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST && sourceSystems.length === 0) {
      getSourceSystems(selectedInput?.linkedBundles);
      setSourceSystemTabs([
        {
          id: 'createNewDataRequest',
          label: t('Components_InputUploaderModal_Create_New_Data_Request'),
        },
      ]);
    }
  }, [value, selectedInput]);

  return (
    <Box width='100%' dataInstance={`${COMPONENT_NAME}-Model`}>
      <Flex>
        <Text type={TextTypes.H2} fontWeight='s'>
          {isNewUpload ? t('Pages_WorkpaperProcess_Step1_Add_DT') : t('Components_InputUploaderModal_Title')}
        </Text>
        <Text type={TextTypes.H2} fontWeight='s' pl={2} color='gray'>
          {t('Components_InputUploaderModal_Summary')}
        </Text>
      </Flex>
      {isNewUpload && (
        <Box width='100%'>
          {value !== INPUT_UPLOADER_TYPES.DATA_MODEL && canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS && (
            <Box my={10}>
              <Flex>
                <Input
                  label={t('Components_WOPROCESSSTEP1_DATATBLE_NAME_INPUT_TITLE')}
                  value={inputOptionValue}
                  onChange={event => {
                    setInputOptionValue(event.target.value);
                    dataTableNameAssign(event.target.value);
                  }}
                  placeholder={t('Components_WOPROCESSSTEP1_DATATBLE_NAME')}
                  dataInstance={`${COMPONENT_NAME}-DataTable`}
                />
              </Flex>
            </Box>
          )}
          <Box mt={8}>
            <Flex>
              <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
                {t('Components_InputUploaderModal_Sub_Title')}
              </Text>
            </Flex>
          </Box>
        </Box>
      )}

      <Box my={8}>
        <RadioGroupObj
          fontWeight='s'
          name='uploader'
          options={options}
          selectedValue={value || ''}
          py={8}
          borderColor='lightGray'
          borderTop={1}
          borderBottom={0}
          onOptionChange={onSelected}
          dataInstance={`${COMPONENT_NAME}-Uploader`}
        />

        {value === INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST && (
          <Box mt={8}>
            <Select
              width='20%'
              label={t('Components_InputUploaderModal_Source_System_Label')}
              options={sourceSystems}
              value={sourceSystemValue}
              onChange={onChangeSourceSystem}
              optionValueKey='id'
              optionTextKey='name'
              customRenderSelected={(option, index) => (
                <Text key={index} type={TextTypes.BODY}>
                  {option.name}
                </Text>
              )}
              dataInstance={`${COMPONENT_NAME}-Source-System`}
            />

            {sourceSystemValue[0]?.id !== 0 && (
              <Box
                sx={{ border: '1px solid lightGray' }}
                mt={8}
                pb={3}
                dataInstance={`${COMPONENT_NAME}-Create-Data-Request`}
              >
                <Tabs activeTab='createNewDataRequest' tabs={sourceSystemTabs} onTabClicked={() => {}} />
                <CreateDataRequestTab
                  sourceSystemBundles={sourceSystemBundles}
                  dataSources={dataSources}
                  onChangeDataSource={onChangeDataSource}
                  dataInstance={`${COMPONENT_NAME}-Create-Data-Request-tab`}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

InputUploader.propTypes = {
  value: PropTypes.string,
  onSelected: PropTypes.func,
  onChangeBundleDataSource: PropTypes.func.isRequired,
  onChangeBundleSourceSystem: PropTypes.func.isRequired,
};

InputUploader.defaultProps = {
  value: '',
  onSelected: noop,
};
