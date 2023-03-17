import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Radio,
  Search,
  Spinner,
  StateView,
  Table,
  Text,
  TextTypes,
  Tooltip,
  Icon,
  IconTypes,
  TooltipPosition,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { debounce } from 'lodash';
import ListPopover from '../../../ContentLibrary/Pipelines/components/ListPopover/ListPopover';
import { getCLPipelineList, setAddPipelineSelected } from '../../../../store/engagement/pipelines/actions';
import { EngPipelinesSelectors } from '../../../../store/engagement/pipelines/selectors';
import { PipelineSource } from './constants/new-pipeline';
import useTranslation from 'src/hooks/useTranslation';
import LocalizedDate from '../../../../components/LocalizedDate/LocalizedDate';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';

const COMPONENT_NAME = 'ChoosePipelineForm';
const TRANSLATION_KEY = 'Components_AddPipelineModal_Step1';
const PAGE_SIZE = 20;

const ChoosePipelineForm = props => {
  const { clientId } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [elementScrollRef, setElementScrollRef] = useState(null);
  const [containerScrollRef, setContainerScrollRef] = useState(null);

  const clPipelines = useSelector(EngPipelinesSelectors.clPipelines);
  const isCLPipelineFetching = useSelector(EngPipelinesSelectors.isCLPipelineFetching);
  const selectedPipeline = useSelector(EngPipelinesSelectors.selectAddPipelineSelected);

  const handleInfiniteScroll = useCallback(() => {
    if (!isCLPipelineFetching && clPipelines.items.length < clPipelines.totalCount) {
      dispatch(getCLPipelineList(clientId, searchValue, PAGE_SIZE, clPipelines.items.length));
    }
  }, [clPipelines.items, clPipelines.totalCount, isCLPipelineFetching, searchValue, clientId, dispatch]);

  useInfiniteScroll(elementScrollRef, handleInfiniteScroll, 10, containerScrollRef);

  const handlePipelineSelected = pipelineId => {
    dispatch(setAddPipelineSelected(clPipelines.items.find(pipelines => pipelines.id === pipelineId) || null));
  };

  const handlePipelineSearch = debounce(value => {
    setSearchValue(value);
    dispatch(getCLPipelineList(clientId, value, PAGE_SIZE, 0));
  }, 750);

  const parsePipelines = useCallback(pipelinesToParse => {
    if (!pipelinesToParse || !pipelinesToParse.items) return [];

    return pipelinesToParse.items.map(pipeline => {
      const lastModified = <LocalizedDate date={pipeline.modifiedDate} />;

      return {
        name: pipeline.pipelineName,
        workpapersInformation: pipeline.workpapersInformation,
        id: pipeline.id,
        lastModified,
        pipelineSource: pipeline.pipelineSource,
      };
    });
  }, []);

  useEffect(() => {
    setRows(parsePipelines(clPipelines));
    if (clPipelines.items && clPipelines.items.length > 0) {
      dispatch(setAddPipelineSelected(clPipelines.items[0]));
    } else {
      dispatch(setAddPipelineSelected(''));
    }
  }, [dispatch, clPipelines, parsePipelines]);

  useEffect(() => {
    dispatch(setAddPipelineSelected(''));
  }, [dispatch]);

  const headers = [
    {
      title: t(`${TRANSLATION_KEY}_TableCLPipelines`),
      key: 'name',
      width: '35%',
      render: (name, row) => (
        <Box>
          <Radio
            dataInstance={COMPONENT_NAME}
            name='add-pipeline'
            label={
              <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={32} fontWeight='m'>
                {name}
              </Text>
            }
            value={row.id}
            checked={row.id === selectedPipeline.id}
            onOptionSelected={handlePipelineSelected}
            fontWeight='m'
          />
        </Box>
      ),
    },
    {
      title: t(`${TRANSLATION_KEY}_CLWorkpapers`),
      key: 'workpapersInformation',
      width: '40%',
      render: (workpapersInformation, row) => (
        <Box
          cursor='pointer'
          minHeight={16}
          width='100%'
          dataInstance={`${COMPONENT_NAME}-Pipeline-${row.id}-workpapers`}
        >
          {workpapersInformation &&
            workpapersInformation.length === 0 &&
            t('Pages_Content_Library_PipelinesListing_Pipeline_NoWorkpapers')}
          {workpapersInformation && workpapersInformation.length === 1 && <p>{workpapersInformation[0].name}</p>}
          {workpapersInformation && workpapersInformation.length > 1 && (
            <ListPopover
              title={t('Pages_Content_Library_PipelinesListing_Pipeline_WorkpapersListTitle')}
              sumarizeContent={`${workpapersInformation[0].name},+${workpapersInformation.length - 1}`}
            >
              {workpapersInformation.map(workpaper => (
                <Text type={TextTypes.BODY} key={`${COMPONENT_NAME}-pipeline-${row.id}-workpaper-${workpaper.id}-text`}>
                  <p>{workpaper.name}</p>
                </Text>
              ))}
            </ListPopover>
          )}
        </Box>
      ),
    },
    {
      title: t(`${TRANSLATION_KEY}_LastModified`),
      key: 'lastModified',
      width: '15%',
    },
    {
      title: '',
      key: 'pipelineSource',
      render: pipelineSource => {
        return (
          pipelineSource === PipelineSource.TRIFACTA && (
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.TOP}
              tooltipContent={t('Pages_Engagement_PipelinesListing_TrifactaTooltip')}
              showOnHover
            >
              <Icon type={IconTypes.AUTO_CONNECTOR_ON} height={28} width={28} color='black' />
            </Tooltip>
          )
        );
      },
    },
  ];

  const renderTable = () => {
    return clPipelines.items.length ? (
      <Table
        headers={headers}
        rows={rows}
        mb={11}
        contentMaxHeight={475}
        minHeight={475}
        setElementScrollRef={setElementScrollRef}
        setContainerScrollRef={setContainerScrollRef}
        dataInstance={`${COMPONENT_NAME}-CLTable`}
      />
    ) : (
      <StateView title={t(`${TRANSLATION_KEY}_NoSearchResultsPipelines`)} />
    );
  };

  return (
    <Box width='100%'>
      <Flex
        theme={theme}
        mt={8}
        mb={9}
        justifyContent='space-between'
        alignItems='center'
        dataInstance={`${COMPONENT_NAME}-ChoosePipeline`}
      >
        <Text type={TextTypes.H2} fontWeight='l'>
          {t(`${TRANSLATION_KEY}_PipelineTitle`)}
        </Text>
        <Search
          data={[]}
          onChange={handlePipelineSearch}
          maxWidth='225px'
          manualFiltering
          dataInstance={COMPONENT_NAME}
          placeholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
        />
      </Flex>
      <Spinner spinning={isCLPipelineFetching}>{renderTable()}</Spinner>
    </Box>
  );
};

export default ChoosePipelineForm;
