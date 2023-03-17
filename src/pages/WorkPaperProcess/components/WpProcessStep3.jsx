import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  ButtonTypes,
  GapSizes,
  GridView,
  IconCard,
  IconTypes,
  Intent,
  Link,
  Spinner,
  Tag,
  Text,
  TextTypes,
  Icon,
  Tooltip,
  TooltipPosition,
  Flex,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { cloneWorkbooks, getWorkPaperOutputs, getAllOutputs } from '../../../store/workpaperProcess/step3/actions';
import PropTypes from 'prop-types';
import env from 'env';
import { wpStep3Selectors } from '../../../store/workpaperProcess/step3/selectors';
import { ThemeContext } from 'styled-components';
import { jeStatus } from '../../WorkPaperOutput/constants/WorkPaperOutput.constants';
import { getJeStatusIcon, getJeStatusColor } from '../../WorkPaperOutput/utils/WorkPaperOutput.utils';
import { COMPONENT_NAME } from '../constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';

const WpProcessStep3List = ({ title, itemDescription, list, workpaperId, workpaper, dqc }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleSaveAll = () => {
    dispatch(getAllOutputs(workpaperId, workpaper.name));
  };
  const { t } = useTranslation();

  return (
    !!list.length && (
      <Box>
        <Flex>
          <Text type={TextTypes.BODY} color='gray' mb={5}>
            {title}
          </Text>
          {dqc && (
            <Tooltip
              type='default'
              tooltipContent={t('Pages_WorkpaperProcess_Step3_DownloadAllDCQs')}
              showOnHover
              dataInstance={COMPONENT_NAME}
            >
              <Button
                type={ButtonTypes.LINK}
                iconWidth={20}
                icon={IconTypes.UPLOAD}
                onClick={handleSaveAll}
                // dataInstance={`${PAGE_NAME}-SaveCSV`}
              />
            </Tooltip>
          )}
        </Flex>
        <GridView
          gap={GapSizes.LARGE}
          itemsPerRow={4}
          width='100%'
          pt={5}
          mb={9}
          dataInstance={`${COMPONENT_NAME}-Outputs`}
        >
          {list.map((item, index) => (
            <Link
              key={item.id}
              to={
                workpaper?.engagementId
                  ? `/workpapers/${workpaperId}/outputs/${item.id}`
                  : `/library/workpapers/${workpaperId}/outputs/${item.id}`
              }
            >
              <IconCard key={item.id} iconType={IconTypes.XLS} dataInstance={`${COMPONENT_NAME}-${index}`}>
                <Box>
                  <Flex width='100%'>
                    <Tooltip showOnHover tooltipContent={item.name} display='grid'>
                      <Text color='black' type={TextTypes.BODY} fontWeight={theme.fontWeights.m} ellipsis>
                        {item.name}
                      </Text>
                    </Tooltip>
                    {item?.jeStatus && (
                      <Box ml={1} minWidth='20px'>
                        <Tooltip
                          display='inline-block'
                          direction={TooltipPosition.INFO}
                          tooltipContent={`${item?.jeStatus?.type}: ${
                            item?.jeStatus?.status === jeStatus.FAILED && item?.jeStatus?.errorMessage != null
                              ? item?.jeStatus?.errorMessage
                              : item?.jeStatus?.status
                          }`}
                          showOnHover
                        >
                          <Icon
                            type={getJeStatusIcon(item?.jeStatus?.status)}
                            height={20}
                            width={20}
                            color={getJeStatusColor(item?.jeStatus?.status)}
                          />
                        </Tooltip>
                      </Box>
                    )}
                  </Flex>
                  <Text type={TextTypes.BODY} color='gray' ellipsis>
                    {itemDescription}
                  </Text>
                </Box>
              </IconCard>
            </Link>
          ))}
        </GridView>
      </Box>
    )
  );
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const WpProcessStep3 = ({ workpaperId, template, workpaper }) => {
  const dispatch = useDispatch();
  const [clonedError, setClonedError] = useState(false);

  const loading = useSelector(wpStep3Selectors.selectLoading);
  const cloning = useSelector(wpStep3Selectors.selectCloning);
  const ready = useSelector(wpStep3Selectors.selectReady);
  const cloningState = useSelector(wpStep3Selectors.selectCloningState);
  const outputsData = useSelector(wpStep3Selectors.selectOutputs(workpaperId));
  const isFetchingOutputsDetail = useSelector(wpStep3Selectors.selectIsFetchingOutputsDetail);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getWorkPaperOutputs(workpaperId));
  }, [workpaperId]);

  useEffect(() => {
    // eslint-disable-next-line camelcase
    if (ready && outputsData && outputsData?.tableau?.length && !outputsData?.tableau_cloned) {
      dispatch(cloneWorkbooks(workpaperId));
    }
    // eslint-disable-next-line camelcase
  }, [ready, workpaperId]);

  const onTableauOpen = () => {
    // Redirecting the user always to design tab for now.
    // In the future if clone is true, it should go to analysis.
    const tab = 'design';
    window.open(`${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/${tab}`, '_blank');
  };

  const renderLists = () => (
    <Box>
      <WpProcessStep3List
        workpaper={workpaper}
        title={t('Pages_WorkpaperProcess_Step3_DataQualityCheckOutputs')}
        itemDescription={t('Pages_WorkpaperProcess_Step3_DataTable')}
        list={outputsData.dqc}
        dqc
        workpaperId={workpaperId}
      />

      <WpProcessStep3List
        workpaper={workpaper}
        title={t('Pages_WorkpaperProcess_Step3_DataTableOutputs')}
        itemDescription={t('Pages_WorkpaperProcess_Step3_DataTable')}
        list={outputsData.dataTable}
        workpaperId={workpaperId}
      />

      {!!outputsData?.tableau?.length && (
        <Box>
          <Text type={TextTypes.BODY} color='gray' mb={5}>
            {t('Pages_WorkpaperProcess_Step3_TableauOutputs')}
          </Text>
          {cloningState === Intent.ERROR && !clonedError && (
            <Alert
              type={Intent.INFO}
              message={t('Pages_WorkpaperProcess_Step3_ManualCloneMessage')}
              onClose={() => setClonedError(true)}
              dataInstance={COMPONENT_NAME}
            />
          )}
          <GridView
            gap={GapSizes.LARGE}
            itemsPerRow={4}
            width='100%'
            pt={5}
            mb={9}
            dataInstance={`${COMPONENT_NAME}-Tableau`}
          >
            {outputsData?.tableau?.map(item => (
              <Box key={`${item.id}${item.name}`} onClick={() => onTableauOpen()}>
                <IconCard
                  // eslint-disable-next-line camelcase
                  disabled={cloningState ? false : !outputsData?.tableau_cloned}
                  title={item.name}
                  iconType={IconTypes.ADD_FILE}
                  description={t('Pages_WorkpaperProcess_Step3_Tableau')}
                  state={cloningState === Intent.ERROR ? null : cloningState}
                  loading={cloning}
                />
              </Box>
            ))}
          </GridView>
        </Box>
      )}
    </Box>
  );

  return (
    <Spinner
      spinning={loading || isFetchingOutputsDetail}
      label={isFetchingOutputsDetail ? t('Pages_WorkpaperProcess_Step3_SpinnerLabel_DownloadingDQX') : undefined}
    >
      <Box pl={90}>
        <Box mb={20}>
          <Text type={TextTypes.BODY} mb={3} color='gray'>
            {t('Pages_WorkpaperProcess_Step3_AnalyticTemplate')}
          </Text>
          <Tag>{template?.name}</Tag>
        </Box>
        {outputsData && renderLists()}
      </Box>
    </Spinner>
  );
};

WpProcessStep3.propTypes = {
  template: PropTypes.object,
  workpaperId: PropTypes.string,
};

WpProcessStep3.defaultProps = {
  template: {},
  workpaperId: '',
};

export default WpProcessStep3;
