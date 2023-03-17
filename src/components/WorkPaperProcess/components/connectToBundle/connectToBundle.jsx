import React, { useState, useEffect } from 'react';
import { difference } from 'lodash';
import useTranslation from 'src/hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Tabs,
  Flex,
  Tree,
  Text,
  Search,
  Spinner,
  AlertHub,
  TextTypes,
  StateView,
  Button,
  ButtonTypes,
} from 'cortex-look-book';

import { getTabs } from './connectToBundleUtils';
import { COMPONENT_NAME, TABS_OPTION, ICON_TYPE } from './connectToBundleConstants';
import { getTrifactaBundles, setBundleToInput } from '../../../../store/workpaperProcess/step1/actions';
import { deleteconnectToBundleError } from '../../../../store/errors/actions';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { errorsSelectors } from '../../../../store/errors/selectors';

const ConnectToBundle = props => {
  const {
    connectedBundle,
    disablePrimaryButton,
    callConnectBundle,
    setCallConnectBundle,
    selectedInputId,
    workpaperId,
    onCloseInputOptions,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetchingBundles = useSelector(wpStep1Selectors.isFetchingBundles);
  const allTrifactaBundles = useSelector(wpStep1Selectors.allTrifactaBundles);
  const connectTrifactBundles = useSelector(wpStep1Selectors.connectTrifactBundles);
  const allConnectBundleErrors = useSelector(errorsSelectors.selectConnectToBundleErrors);

  const [bundlesTreeData, SetBundlesTreeData] = useState({});
  const [activeBundlesIds, setActiveBundlesIds] = useState([]);
  const [preSelectedBundlesIds, setPreSelectedBundlesIds] = useState([]);
  const [activeBundlesData, setActiveBundlesData] = useState([]); // data of all selected bundles
  const [selectedBundlesData, setSelectedBundlesData] = useState([]); // shallow copy of data of all selected bundles to render
  const [activeTab, setActiveTab] = useState(TABS_OPTION.BUNDLES_LIST);
  const [clearSearch, setClearSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    // trigger connect to bundle
    if (callConnectBundle) {
      dispatch(setBundleToInput(workpaperId, selectedInputId, activeBundlesData)).then(res => {
        if (res) {
          setCallConnectBundle(false);
          onCloseInputOptions();
        }
      });
    }
  }, [callConnectBundle]);

  useEffect(() => {
    // gets bundle list on componentDidMount
    dispatch(getTrifactaBundles());
  }, []);

  useEffect(() => {
    // set the list to display in Bundle List tab
    SetBundlesTreeData({ ...allTrifactaBundles });
  }, [allTrifactaBundles]);

  useEffect(() => {
    // For pre-connected bundle input, Sort the data accordingly
    if (connectedBundle?.length > 0) {
      const filteredBundles = [];
      const filteredActiveBundlesIds = [];

      [...connectedBundle].forEach(eachConnectedBundle => {
        const bundleData = [...eachConnectedBundle.bundles].map(eachNode => {
          filteredActiveBundlesIds.push(eachNode.bundleId);

          return {
            ...eachNode,
            sourceSystemName: eachConnectedBundle.sourceName,
            sourceSystemId: eachConnectedBundle.sourceId,
            name: eachNode.bundleName,
            id: eachNode.bundleId,
          };
        });
        filteredBundles.push(...bundleData);
      });

      setActiveBundlesData([...filteredBundles]);
      setActiveBundlesIds([...filteredActiveBundlesIds]);
      setPreSelectedBundlesIds([...filteredActiveBundlesIds]);
    }
  }, [connectedBundle]);

  const onErrorClose = errorKey => {
    return dispatch(deleteconnectToBundleError(errorKey));
  };

  const getSpinnerLabel = () => {
    if (isFetchingBundles) {
      return t('Components_AddWorkpaperModal_Step1_ConnectToBundle_Spinner_Label_Fetching');
    } else if (connectTrifactBundles) {
      return t('Components_AddWorkpaperModal_Step1_ConnectToBundle_Spinner_Label_Connecting');
    }

    return '';
  };

  const changeTab = tabId => {
    setSearchText('');
    setClearSearch(true);
    setActiveTab(tabId);
  };

  const deleteActiveBundlesData = currentNode => {
    setActiveBundlesIds([...activeBundlesIds].filter(eachId => eachId !== currentNode.id));
    setActiveBundlesData([...activeBundlesData].filter(eachBundle => eachBundle.id !== currentNode.id));
  };

  const onPreviewClickHandler = (id, label, currentNode, activeIds, isChecked) => {
    if (isChecked) {
      setActiveBundlesIds([...activeIds]);
      setActiveBundlesData([...activeBundlesData, currentNode]);
    } else {
      deleteActiveBundlesData(currentNode);
    }
  };

  const setExpandedNodes = node => {
    const allExpandedKey = [...expandedKeys];
    const indexOfNode = allExpandedKey.indexOf(node);
    if (indexOfNode === -1) {
      allExpandedKey.push(node);
    } else {
      allExpandedKey.splice(indexOfNode, 1);
    }

    setExpandedKeys([...allExpandedKey]);
  };

  const getBundleTree = () => {
    if (Object.keys(bundlesTreeData).length < 1) {
      return (
        <StateView
          title={t('Components_AddWorkpaperModal_Step1_ConnectToBundle_No_Bundle_Found')}
          dataInstance={`${COMPONENT_NAME}-bundle-Tree-NoRecords`}
        />
      );
    }

    return (
      <Tree
        nodes={bundlesTreeData}
        onItemClick={setExpandedNodes}
        onPreviewClick={onPreviewClickHandler}
        iconType={ICON_TYPE}
        iconStyle={{ width: 22, height: 22 }}
        dataInstance={`${COMPONENT_NAME}-bundle-Tree`}
        multiSelect
        checkable
        checkedNodes={activeBundlesData.map(eachBundle => eachBundle.id)}
        defaultExpandedKeys={expandedKeys}
      />
    );
  };

  const getSelectedBundles = () => {
    if (selectedBundlesData.length < 1) {
      return (
        <StateView
          title={t('Components_AddWorkpaperModal_Step1_ConnectToBundle_No_Bundle_Found')}
          dataInstance={`${COMPONENT_NAME}-selectedBundles-NoRecords`}
        />
      );
    }

    return (
      <Box width='100%' dataInstance={`${COMPONENT_NAME}-selectedBundles-Parent`}>
        {[...selectedBundlesData].map(eachBundle => {
          return (
            <Flex
              key={eachBundle.id}
              dataInstance={`${COMPONENT_NAME}-selectedBundles-Wrapper-${eachBundle.id}`}
              minWidth='100%'
              flexDirection='row'
              justifyContent='space-between'
              pb='1%'
              pr='1.5%'
              mt='1%'
              borderBottomWidth={1}
              borderBottomColor='lightGray'
              borderBottomStyle='solid'
            >
              <Flex
                flexDirection='column'
                dataInstance={`${COMPONENT_NAME}-selectedBundles-Detail-Wrapper-${eachBundle.id}`}
              >
                <Text
                  type={TextTypes.BODY}
                  fontWeight='m'
                  mb='1%'
                  dataInstance={`${COMPONENT_NAME}-selectedBundles-BundleName-${eachBundle.id}`}
                >
                  {t('Components_AddWorkpaperModal_Step1_ConnectToBundle_Bundle_Name').replace(
                    'bname',
                    eachBundle.name
                  )}
                </Text>

                <Text
                  type={TextTypes.H4}
                  color='gray'
                  dataInstance={`${COMPONENT_NAME}-selectedBundles-Desc-${eachBundle.id}`}
                >
                  {t('Components_AddWorkpaperModal_Step1_ConnectToBundle_SourceSystem_SourceVersion_Name')
                    .replace('ssName', eachBundle.sourceSystemName)
                    .replace('svName', eachBundle.sourceVersionName)}
                </Text>
              </Flex>

              <Flex
                dataInstance={`${COMPONENT_NAME}-selectedBundles-Delete-Wrapper-${eachBundle.id}`}
                alignSelf='center'
                alignItems='center'
                mr='2%'
              >
                <Button
                  dataInstance={`${COMPONENT_NAME}-selectedBundles-Delete-${eachBundle.id}`}
                  onClick={() => deleteActiveBundlesData(eachBundle)}
                  type={ButtonTypes.LINK}
                  fontSize='s'
                  fontWeight='m'
                >
                  {t('Components_AddWorkpaperModal_Step1_ConnectToBundle_Delete_Text')}
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Box>
    );
  };

  const searchValuesInBundles = (bundleNode, loweredInputText) => {
    const sortedBundles = {};
    [...bundleNode].forEach(eachBundle => {
      if (eachBundle.name.toLowerCase().includes(loweredInputText)) {
        sortedBundles[`${eachBundle.id}`] = {
          ...eachBundle,
        };
      }
    });

    return sortedBundles;
  };

  const searchValuesInSV = (svNodes, loweredInputText) => {
    const sortedSV = {};
    [...svNodes].forEach(eachSourceVersion => {
      if (eachSourceVersion.name.toLowerCase().includes(loweredInputText)) {
        sortedSV[`${eachSourceVersion.id}`] = {
          ...eachSourceVersion,
        };
      } else {
        // send nodes --> return values to be inserted
        const filteredBundle = {
          ...searchValuesInBundles(Object.values({ ...eachSourceVersion.nodes }), loweredInputText),
        };

        if (Object.keys(filteredBundle).length) {
          sortedSV[`${eachSourceVersion.id}`] = {
            ...eachSourceVersion,
            nodes: { ...filteredBundle },
          };
        }
      }
    });

    return sortedSV;
  };

  const searchBundleList = loweredInputText => {
    const filteredSS = {};

    Object.values({ ...allTrifactaBundles }).forEach(eachSourceSystem => {
      if (eachSourceSystem.name.toLowerCase().includes(loweredInputText)) {
        filteredSS[`${eachSourceSystem.id}`] = { ...eachSourceSystem };
      } else {
        const filteredSV = { ...searchValuesInSV(Object.values({ ...eachSourceSystem.nodes }), loweredInputText) };
        if (Object.keys(filteredSV).length) {
          filteredSS[`${eachSourceSystem.id}`] = { ...eachSourceSystem, nodes: { ...filteredSV } };
        }
      }
    });
    SetBundlesTreeData({ ...filteredSS });
  };

  const searchSelectedBundles = loweredInputText => {
    const filteredSelectedBundlesData = [...activeBundlesData].filter(
      eachNode =>
        eachNode.name.toLowerCase().includes(loweredInputText) ||
        eachNode.sourceSystemName.toLowerCase().includes(loweredInputText) ||
        eachNode.sourceVersionName.toLowerCase().includes(loweredInputText)
    );
    setSelectedBundlesData([...filteredSelectedBundlesData]);
  };
  const handleOnchangeSearch = inputText => {
    setSearchText(inputText);
    setClearSearch(false);
    if (inputText?.trim()) {
      const loweredInputText = inputText.toLowerCase();
      if (activeTab === TABS_OPTION.BUNDLES_LIST) {
        searchBundleList(loweredInputText);
      } else if (activeTab === TABS_OPTION.SELECTED_BUNDLES) {
        searchSelectedBundles(loweredInputText);
      }
    } else {
      SetBundlesTreeData({ ...allTrifactaBundles });
      setSelectedBundlesData([...activeBundlesData]);
    }
  };

  useEffect(() => {
    // set the list to display in selected bundles tab
    if (activeTab === TABS_OPTION.SELECTED_BUNDLES) {
      handleOnchangeSearch(searchText);
    } else {
      setSelectedBundlesData([...activeBundlesData]);
    }
    // set primary button disablePrimaryButton
    if (activeBundlesData.length !== preSelectedBundlesIds.length) {
      disablePrimaryButton(false);
    } else if (difference(preSelectedBundlesIds, activeBundlesIds).length > 0) {
      disablePrimaryButton(false);
    } else {
      disablePrimaryButton(true);
    }
  }, [activeBundlesData]);

  return (
    <Box dataInstance={`${COMPONENT_NAME}-parent`}>
      <AlertHub alerts={allConnectBundleErrors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}-Alerts`} />
      <Flex
        dataInstance={`${COMPONENT_NAME}-header`}
        minWidth='100%'
        flexDirection='row'
        justifyContent='space-between'
      >
        <Tabs
          activeTab={activeTab}
          tabs={getTabs(t)}
          onTabClicked={tabId => changeTab(tabId)}
          dataInstance={`${COMPONENT_NAME}-${activeTab}-tabs`}
        />

        <Flex
          alignItems='flex-end'
          minWidth='30%'
          maxWidth='30%'
          mr={10}
          dataInstance={`${COMPONENT_NAME}-search-Bundle-Wrapper`}
        >
          <Search
            dataInstance={`${COMPONENT_NAME}-Search-Bundle`}
            maxWidth='100%'
            data={[]}
            onChange={handleOnchangeSearch}
            placeholder={t('Components_AddWorkpaperModal_Step1_ConnectToBundle_Search_Placeholder')}
            clearSearch={clearSearch}
          />
        </Flex>
      </Flex>
      <Spinner
        spinning={isFetchingBundles || connectTrifactBundles}
        label={getSpinnerLabel()}
        dataInstance={`${COMPONENT_NAME}-body-Spinner`}
      >
        <Flex dataInstance={`${COMPONENT_NAME}-body`} minWidth='100%' mt='1%' mb='2%'>
          {activeTab === TABS_OPTION.BUNDLES_LIST && (
            <Flex
              dataInstance={`${COMPONENT_NAME}-body-bundlesList`}
              minWidth='100%'
              maxWidth='100%'
              overflowY='auto'
              minHeight='300px'
              maxHeight='65vh'
            >
              <Flex dataInstance={`${COMPONENT_NAME}-bundle-Tree-wrapper`} minWidth='100%' maxWidth='100%'>
                {getBundleTree()}
              </Flex>
            </Flex>
          )}
          {activeTab === TABS_OPTION.SELECTED_BUNDLES && (
            <Flex dataInstance={`${COMPONENT_NAME}-body-Selectedbundles`} minWidth='100%' maxWidth='100%'>
              <Flex
                dataInstance={`${COMPONENT_NAME}-selected-Bunldes-List-Parent`}
                minWidth='100%'
                maxWidth='100%'
                overflowY='auto'
                minHeight='300px'
                maxHeight='65vh'
              >
                {getSelectedBundles()}
              </Flex>
            </Flex>
          )}
        </Flex>
      </Spinner>
    </Box>
  );
};

export default ConnectToBundle;
