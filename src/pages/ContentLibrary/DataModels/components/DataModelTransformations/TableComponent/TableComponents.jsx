import React from 'react';
import env from 'env';
import useTranslation from '../../../../../../hooks/useTranslation';
import {
  Text,
  Flex,
  Box,
  Table,
  Spinner,
  Tag,
  IconTypes,
  Icon,
  Button,
  ButtonTypes,
  PopoverOrigin,
  Popover,
  ContextMenu,
  Tooltip,
  TooltipPosition,
} from 'cortex-look-book';
import { useSelector } from 'react-redux';
import { getPublishedBundlesList, getBundleTransformationStatus } from '../../../../../../store/bundles/actions';
import { getSBTIngestionStatus } from '../../../../../../store/contentLibrary/datamodels/actions';
import { configureTrifactaBundleTransformation } from '../../../../../../store/workpaper/actions';
import {
  BUNDLE_TRANSFORMATION_INGESTION_STATUS,
  STANDARD_BUNDLES_CONTEXT_MENU,
  TRIFACTA_TRANSFORMATION_STATUS,
} from '../../../constants/constants';
import { bundlesSelectors } from '../../../../../../store/bundles/selectors';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { getSBContextMenuOption } from '../../../utils/DataModelsHelper';

const PAGE_NAME = 'CL_DATAMODEL_TRANSFORMATIONS';

export const BundleHeaders = tagsList => {
  const { t } = useTranslation();

  const renderTags = tagIds => {
    const tagNames = (tagsList || []).filter(x => (tagIds || []).indexOf(x?.id) > -1).map(x => x?.name);

    return (
      <>
        {tagNames.map((name, index) => (
          <Tag key={index}>{name}</Tag>
        ))}
      </>
    );
  };

  const bundleHeaders = [
    {
      title: '',
      key: 'isExpandableRow',
      width: '5%',
      iconHeight: 30,
      iconWidth: 30,
      collapseRow: true,
    },
    {
      title: t('Pages_Content_Library_DataModelBundles_Headers_Bundle'),
      key: 'bundleBaseName',
      render: (name, row) => (
        <Flex
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-SBT-${row.id}-bundleBaseName`}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-SBT-${row.id}-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelBundles_Headers_Description'),
      key: 'description',
      render: (description, row) => (
        <Box minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-SBT-${row.id}-description`}>
          <Text charLimit={40}>{description}</Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModelBundles_Headers_Tags'),
      key: 'tagIds',
      render: (value, row) => (
        <Box minHeight={30} dataInstance={`${PAGE_NAME}-SBT-${row.id}-tagIds`}>
          {renderTags(value)}
        </Box>
      ),
    },
  ];

  return [...bundleHeaders];
};

export const SourceSystemHeaders = t => {
  const sourceSystemHeaders = [
    {
      title: '',
      key: 'isExpandableRow',
      width: '5%',
      iconHeight: 30,
      iconWidth: 30,
      collapseRow: true,
    },
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Headers_Name'),
      key: 'name',
      render: (name, row) => (
        <Flex
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-SST-${row.id}-Flex-name`}
        >
          <Text
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-SST-${row.id}-Text-name`}
          >
            {name}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Headers_VersionCount'),
      key: 'sourceVersionsCount',
      render: (versionNumber, row) => (
        <Box minHeight={16} width='100%' dataInstance={`${PAGE_NAME}-SST-${row.id}-sourceVersionsCount`}>
          <Text charLimit={40}>{versionNumber}</Text>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Headers_StandardConfig'),
      key: 'standardConfig',
      render: (value, row) => (
        <Box minHeight={30} dataInstance={`${PAGE_NAME}-SST-${row.id}-standardConfig`}>
          <Text charLimit={40}>-</Text>
        </Box>
      ),
    },
  ];

  return [...sourceSystemHeaders];
};

const refreshAction = (row, dispatch) => {
  dispatch(getBundleTransformationStatus(row.id)).then(res => {
    if (res.trifactaTransformationStatus === TRIFACTA_TRANSFORMATION_STATUS.COMPLETED && res.trifactaTransformationId) {
      const redirectURL = env.REDIRECT_URI?.replace(
        `clients`,
        `library/bundleTransformations/${res.trifactaTransformationId}`
      );
      window.location.href = redirectURL;
    } else if (res.trifactaTransformationStatus === TRIFACTA_TRANSFORMATION_STATUS.FAILED) {
      dispatch(getPublishedBundlesList(row?.bundleBaseId));
    }
  });
};

export const SourceSystemVersionHeaders = (
  dmtDetails,
  t,
  handleContextButton,
  dispatch,
  setIngestReportOpen,
  setActiveSB
) => {
  const getIngestStatusIcon = (bundleTransformIngestStatus, handleRefreshIcon) => {
    switch (bundleTransformIngestStatus) {
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.INPROGRESS:
        return handleRefreshIcon ? IconTypes.REFRESHCONTINUOUS : IconTypes.REFRESH;
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.SUCCESS:
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.FAILED:
        return IconTypes.WARNING;
      default:
        return IconTypes.MINUS;
    }
  };

  const getIngestStatusIconColor = bundleTransformIngestStatus => {
    switch (bundleTransformIngestStatus) {
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.INPROGRESS:
        return 'yellow';
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.SUCCESS:
        return 'green';
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.FAILED:
        return 'red';
      default:
        return 'black';
    }
  };

  const getIngestStatusTooltip = bundleTransformIngestStatus => {
    switch (bundleTransformIngestStatus) {
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.INPROGRESS:
        return t('Pages_Content_Library_StandardBundleList_Ingest_Status_Tooltip_Inprogess');
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.SUCCESS:
        return t('Pages_Content_Library_StandardBundleList_Ingest_Status_Tooltip_Completed');
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.FAILED:
        return t('Pages_Content_Library_StandardBundleList_Ingest_Status_Tooltip_Failed');
      default:
        return t('Pages_Content_Library_StandardBundleList_Ingest_Status_Tooltip_Default');
    }
  };

  const fetchLatestIngestStatus = row => {
    dispatch(getSBTIngestionStatus(dmtDetails?.selectedDMTRow?.id, true)).then(res => {
      if (
        [BUNDLE_TRANSFORMATION_INGESTION_STATUS.SUCCESS, BUNDLE_TRANSFORMATION_INGESTION_STATUS.FAILED].includes(
          res.status
        )
      ) {
        dispatch(getPublishedBundlesList(row?.bundleBaseId));
      }
    });
  };

  const handleIngestStatusClick = (row, bundleBaseNameDetail) => {
    switch (row.bundleTransformIngestStatus) {
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.INPROGRESS:
        fetchLatestIngestStatus(row);
        break;
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.SUCCESS:
      case BUNDLE_TRANSFORMATION_INGESTION_STATUS.FAILED:
        setIngestReportOpen(true);
        setActiveSB({ ...row, bundleBaseName: bundleBaseNameDetail });
        break;
      default:
      // no default needed bypass eslint error
    }
  };

  const sourceSystemVersionHeaders = [
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Version_Headers_VersionName'),
      key: 'sourceVersionName',
      render: (versionName, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          width='100%'
          alignItems='center'
          dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-sourceVersionName`}
        >
          <Text
            color='blue'
            pt={1}
            ellipsisTooltip
            tooltipWrapperWidth='inherit'
            charLimit={32}
            fontWeight='m'
            dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Text-sourceVersionName`}
            onClick={() => {
              window.location.href = `${env.ANALYTICSUI_URL}/bundleTransformations/${row.id}/data`;
            }}
          >
            {versionName}
          </Text>
        </Flex>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Version_Headers_LegacyConfig'),
      key: 'action',
      render: (value, row) => (
        <Box cursor='pointer' minHeight={30} dataInstance={`${PAGE_NAME}-SSVT-${row.id}-action`}>
          <Flex
            cursor='pointer'
            dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-action`}
            onClick={() => {
              window.location.href = `${env.ANALYTICSUI_URL}/bundleTransformations/${row.id}/data`;
            }}
          >
            <Icon cursor='pointer' type={IconTypes?.PLUS_CIRCLE} size={22} color='blue' />
            <Text cursor='pointer' color='blue' pt={1}>
              {t('Pages_Content_Library_StandardBundleList_Configure')}
            </Text>
          </Flex>
        </Box>
      ),
    },
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Version_Headers_TrifactaConfig'),
      key: 'action',
      render: (value, row) => {
        const getTrifactaConfigBTIds = useSelector(bundlesSelectors.getTrifactaConfigBTIds);

        return (
          <Box cursor='pointer' minHeight={30} dataInstance={`${PAGE_NAME}-SSVT-${row.id}-action`}>
            <Flex taInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-TrifactaConfig-Wrapper`} alignItems='center'>
              <Flex
                cursor='pointer'
                dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-action`}
                onClick={() => {
                  if (
                    row?.trifactaTransformationStatus === TRIFACTA_TRANSFORMATION_STATUS.COMPLETED &&
                    row?.trifactaTransformationId
                  ) {
                    const redirectURL = env.REDIRECT_URI?.replace(
                      `clients`,
                      `library/bundleTransformations/${row.trifactaTransformationId}`
                    );
                    window.location.href = redirectURL;
                  } else {
                    dispatch(configureTrifactaBundleTransformation(row?.id, row?.name)).then(res => {
                      if (res) {
                        dispatch(getPublishedBundlesList(row?.bundleBaseId));
                      }
                    });
                  }
                }}
              >
                <Button
                  disabled={
                    row.trifactaTransformationStatus === TRIFACTA_TRANSFORMATION_STATUS.INPROGRESS ||
                    row.bundleTransformIngestStatus === BUNDLE_TRANSFORMATION_INGESTION_STATUS.INPROGRESS
                  }
                  type={ButtonTypes.LINK}
                  icon={IconTypes.PLUS_CIRCLE}
                  iconWidth={20}
                  dataInstance={`${PAGE_NAME}-trifactConfigure-Button`}
                >
                  {t('Pages_Content_Library_StandardBundleList_Configure')}
                </Button>
              </Flex>
              {row.trifactaTransformationStatus === TRIFACTA_TRANSFORMATION_STATUS.INPROGRESS && (
                <Flex ml={6} cursor='pointer' dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus`}>
                  <Tooltip
                    display='inline-block'
                    direction={TooltipPosition.TOP}
                    showOnHover
                    tooltipContent={t('Pages_Content_Library_StandardBundleList_Configure_Status_Tooltip')}
                    dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus-Tooltip`}
                  >
                    <Icon
                      cursor='text'
                      type={IconTypes?.WARNING}
                      size={26}
                      color='yellow'
                      mr={2}
                      dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus-Icon`}
                    />
                  </Tooltip>
                  <Icon
                    cursor='pointer'
                    type={getTrifactaConfigBTIds?.includes(row.id) ? IconTypes?.REFRESHCONTINUOUS : IconTypes?.REFRESH}
                    size={28}
                    dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus-Refresh-Icon`}
                    onClick={() => refreshAction(row, dispatch)}
                  />
                </Flex>
              )}
              {row.trifactaTransformationStatus === TRIFACTA_TRANSFORMATION_STATUS.FAILED && (
                <Flex cursor='pointer' dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus`}>
                  <Tooltip
                    display='inline-block'
                    direction={TooltipPosition.TOP}
                    showOnHover
                    tooltipContent={t('Pages_Content_Library_StandardBundleList_Configure_Status_Tooltip_Failed')}
                    dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus-Tooltip`}
                  >
                    <Icon
                      cursor='text'
                      type={IconTypes?.WARNING}
                      size={26}
                      color='red'
                      mr={2}
                      dataInstance={`${PAGE_NAME}-SSVT-${row.id}-Flex-configStatus-Icon`}
                    />
                  </Tooltip>
                </Flex>
              )}
            </Flex>
          </Box>
        );
      },
    },
    {
      title: t('Pages_Content_Library_DataModel_SourceSystem_Version_Headers_Ingest_Status'),
      key: 'Ingest Status',
      render: (value, row) => {
        const handleRefreshIcon = useSelector(contentLibraryDMSelectors.handleRefreshIcon);

        return (
          <Flex cursor='pointer' dataInstance={`${PAGE_NAME}-ingest-status-${row.id}`}>
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.TOP}
              showOnHover
              tooltipContent={getIngestStatusTooltip(row.bundleTransformIngestStatus)}
              dataInstance={`${PAGE_NAME}-ingest-status-${row.id}-Flex-Tooltip`}
            >
              <Icon
                cursor={!row.bundleTransformIngestStatus ? 'auto' : 'pointer'}
                type={getIngestStatusIcon(row.bundleTransformIngestStatus, handleRefreshIcon)}
                size={!row.bundleTransformIngestStatus ? 12 : 28}
                color={getIngestStatusIconColor(row.bundleTransformIngestStatus)}
                dataInstance={`${PAGE_NAME}-ingest-status-${row.id}-Flex-Refresh-Icon`}
                onClick={() => handleIngestStatusClick(row, dmtDetails.bundleBaseName)}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
    {
      key: '',
      render: (value, row) => (
        <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${PAGE_NAME}-SSVT-${row.id}-moreMenu`}>
          <Button
            p={2}
            type={ButtonTypes.FLAT}
            icon={IconTypes.ELLIPSIS_Y}
            iconWidth={18}
            dataInstance={`${PAGE_NAME}-SSVT-moreOption-${row.id}`}
            onClick={e => handleContextButton(e, row)}
          />
        </Flex>
      ),
    },
  ];

  return [...sourceSystemVersionHeaders];
};
export const renderSourceVersions = (
  eachRow,
  dmtDetails,
  dispatch,
  t,
  handleContextButton,
  isMenuOpen,
  contextButtonRef,
  handleIngestDMTModal,
  setIsMenuOpen,
  setIngestReportOpen,
  setActiveSB
) => {
  const renderContextMenu = () => {
    const handleOptionClicked = option => {
      if (option.id === STANDARD_BUNDLES_CONTEXT_MENU[0].id) {
        const activeDMT = {
          bundleName: dmtDetails.bundleBaseName,
          sourceSystemName: eachRow?.name,
          sourceVersionId: dmtDetails?.selectedDMTRow?.sourceVersionId,
          sourceVersionName: dmtDetails?.selectedDMTRow?.sourceVersionName,
          bundleId: dmtDetails?.selectedDMTRow?.id,
          bundleBaseId: dmtDetails?.selectedDMTRow?.bundleBaseId,
        };
        handleIngestDMTModal(true, activeDMT);
      }
    };

    return (
      <ContextMenu
        options={getSBContextMenuOption(t)}
        onOptionClicked={handleOptionClicked}
        dataInstance={`${PAGE_NAME}-ContextMenu`}
        cursor='pointer'
      />
    );
  };

  if (eachRow?.bundles?.length) {
    return (
      <Box>
        <Table
          headers={SourceSystemVersionHeaders(
            dmtDetails,
            t,
            handleContextButton,
            dispatch,
            setIngestReportOpen,
            setActiveSB
          )}
          rows={eachRow.bundles}
          dataInstance={`${PAGE_NAME}-SourceSystemListVersioList-Table`}
          isRowExpandable={() => {
            return true;
          }}
          renderInnerTemplate={() => {
            return renderSourceVersions(eachRow, dispatch);
          }}
        />
        {isMenuOpen &&
          eachRow.bundles[0].bundleBaseId === dmtDetails.selectedDMTRow.bundleBaseId &&
          eachRow.bundles.some(eachValue => eachValue.id === dmtDetails.selectedDMTRow.id) && (
            <Popover
              isOpen={isMenuOpen}
              anchorRef={contextButtonRef}
              anchorOriginX={PopoverOrigin.START}
              anchorOriginY={PopoverOrigin.START}
              originX={PopoverOrigin.END}
              originY={PopoverOrigin.START}
              onClose={() => setIsMenuOpen(false)}
              width={200}
              mt={7}
              dataInstance={`${PAGE_NAME}-MenuOpover-${dmtDetails?.selectedDMTRow?.sourceVersionId || ''}`}
              cursor='pointer'
            >
              {renderContextMenu()}
            </Popover>
          )}
      </Box>
    );
  }

  return null;
};

export const renderSourceSystem = (
  rowDetails,
  selectedDMTRow,
  dispatch,
  existingPublishedBundleList,
  t,
  handleContextButton,
  isMenuOpen,
  contextButtonRef,
  handleIngestDMTModal,
  setIsMenuOpen,
  setIngestReportOpen,
  setActiveSB
) => {
  if (
    Object.prototype.hasOwnProperty.call(existingPublishedBundleList, rowDetails.bundleBaseId) &&
    !existingPublishedBundleList?.[rowDetails.bundleBaseId]?.isFetching
  ) {
    return (
      <Table
        headers={SourceSystemHeaders(t)}
        rows={existingPublishedBundleList[rowDetails.bundleBaseId]}
        dataInstance={`${PAGE_NAME}-SourceSystemList-Table`}
        isRowExpandable={() => {
          return rowDetails.bundlesCount;
        }}
        renderInnerTemplate={eachRow => {
          return renderSourceVersions(
            eachRow,
            { bundleBaseName: rowDetails.bundleBaseName, selectedDMTRow },
            dispatch,
            t,
            handleContextButton,
            isMenuOpen,
            contextButtonRef,
            handleIngestDMTModal,
            setIsMenuOpen,
            setIngestReportOpen,
            setActiveSB
          );
        }}
      />
    );
  }
  if (!existingPublishedBundleList?.[rowDetails.bundleBaseId]?.['isFetching']) {
    dispatch(getPublishedBundlesList(rowDetails.bundleBaseId));
  }

  return <Spinner spinning hideOverlay />;
};
