import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Link,
  List,
  ListTypes,
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
import {
  getAddWorkpaperModalList,
  getWorkpaperLinks,
  setAddWorkpaperSelected,
} from '../../../../store/workpaper/actions';
import { fetchOnlyPublishedTagsWithGroups } from '../../../../store/bundles/actions';
import { getFlatTagsById } from '../../../../utils/tagsHelper';
import { ThemeContext } from 'styled-components';
import { debounce } from 'lodash';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { bundlesSelectors } from '../../../../store/bundles/selectors';
import { addAddWorkpaperError } from '../../../../store/errors/actions';
import { COMPONENT_NAME } from './constants/constants';
import { WorkpaperSource } from './constants/new-workpaper';
import useTranslation from 'src/hooks/useTranslation';
import LocalizedDate from '../../../../components/LocalizedDate/LocalizedDate';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';

const TRANSLATION_KEY = 'Components_AddWorkpaperModal_Step1';
const PAGE_SIZE = 20;

const ChooseWorkpaperForm = props => {
  const { clientId } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [elementScrollRef, setElementScrollRef] = useState(null);
  const [containerScrollRef, setContainerScrollRef] = useState(null);

  const selectedWorkpaper = useSelector(workpaperSelectors.selectAddWorkpaperSelected);
  const isLoading = useSelector(workpaperSelectors.selectIsLoadingChooseWorkpaper);
  const workpapers = useSelector(workpaperSelectors.selectAddWorkpaperList);
  const links = useSelector(workpaperSelectors.selectLinkList);
  const tags = useSelector(bundlesSelectors.selectTagsPublishedList);

  const headerListFields = {
    tags: t(`${TRANSLATION_KEY}_Tags`),
    data: t(`${TRANSLATION_KEY}_Data`),
    design: t(`${TRANSLATION_KEY}_Design`),
  };

  const handleInfiniteScroll = useCallback(() => {
    if (!isLoading && workpapers.items.length < workpapers.totalCount) {
      dispatch(getAddWorkpaperModalList(searchValue, clientId, PAGE_SIZE, workpapers.items.length));
    }
  }, [workpapers.items, workpapers.totalCount, isLoading, searchValue, clientId, dispatch]);

  useInfiniteScroll(elementScrollRef, handleInfiniteScroll, 10, containerScrollRef);

  const handleWorkpaperSelected = workpaperId => {
    dispatch(setAddWorkpaperSelected(workpapers.items.find(workpaper => workpaper.id === workpaperId) || null));
  };

  const handleWorkpaperSearch = debounce(value => {
    setSearchValue(value);
    dispatch(getAddWorkpaperModalList(value, clientId, PAGE_SIZE, 0));
  }, 750);

  const parseWorkpapers = useCallback((workpapersToParse, linksToParse, tagsToParse) => {
    if (!workpapersToParse || !workpapersToParse.items) {
      return [];
    }

    const publishedTags = getFlatTagsById(tagsToParse.items || []);

    return workpapersToParse.items.map(workpaper => {
      const link = linksToParse.find(element => element.url === workpaper.url);
      const lastModified = <LocalizedDate date={workpaper.lastUpdated} />;
      const workpaperTags = (workpaper.tagIds || [])
        .filter(tagId => publishedTags[tagId])
        .map(tagId => {
          return publishedTags[tagId];
        });

      return {
        name: workpaper.name,
        description: workpaper.description,
        id: workpaper.id,
        link,
        lastModified,
        workpaperSource: workpaper.workpaperSource,
        overview: {
          inputs: workpaper?.info?.inputs,
          outputs: workpaper?.info?.outputs,
          pages: workpaper?.info?.pages,
          steps: workpaper?.info?.steps,
          tags: workpaperTags,
          transformations: workpaper?.info?.transformations,
          workbooks: workpaper?.info?.workbooks,
        },
      };
    });
  }, []);

  useEffect(() => {
    dispatch(getWorkpaperLinks(addAddWorkpaperError));
    dispatch(fetchOnlyPublishedTagsWithGroups());
  }, [dispatch, clientId]);

  useEffect(() => {
    setRows(parseWorkpapers(workpapers, links, tags));

    if (workpapers.items && workpapers.items.length > 0) {
      dispatch(setAddWorkpaperSelected(workpapers.items[0]));
    } else {
      dispatch(setAddWorkpaperSelected(''));
    }
  }, [dispatch, workpapers, parseWorkpapers, links, tags]);

  useEffect(() => {
    dispatch(setAddWorkpaperSelected(''));
  }, [dispatch]);

  const headers = [
    {
      title: t(`${TRANSLATION_KEY}_TableWorkpapers`),
      key: 'name',
      width: '39.5%',
      render: (name, row) => (
        <Box>
          <Radio
            dataInstance={COMPONENT_NAME}
            name='add-workpaper'
            label={
              <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={32} fontWeight='m'>
                {name}
              </Text>
            }
            value={row.id}
            checked={row.id === selectedWorkpaper.id}
            onOptionSelected={handleWorkpaperSelected}
            fontWeight='m'
          />
          <Text forwardedAs='p' type={TextTypes.BODY} color='gray' ml={10}>
            {row.description}
          </Text>
          {row.link && (
            <Text forwardedAs='p' type={TextTypes.BODY} color='gray' ml={10}>
              <Link forwardedAs='span' external to={row.link.url}>
                {row.link.name || t(`${TRANSLATION_KEY}_ViewDetails`)}
              </Link>
            </Text>
          )}
        </Box>
      ),
    },
    {
      title: t(`${TRANSLATION_KEY}_TableOverview`),
      key: 'overview',
      width: '39.5%',
      render: overview => {
        const listDatasource = {
          tags: overview.tags.map(tag => tag.name).join(', '),
          data: `${overview.inputs ? `${overview.inputs} ${t(`${TRANSLATION_KEY}_InputSources`)}, ` : ''}${
            overview.transformations
              ? `${overview.transformations} ${t(`${TRANSLATION_KEY}_TransformationTables`)}, `
              : ''
          }${overview.steps ? `${overview.steps} ${t(`${TRANSLATION_KEY}_TransformationSteps`)}, ` : ''}${
            overview.outputs ? `${overview.outputs} ${t(`${TRANSLATION_KEY}_Outputs`)}, ` : ''
          }`,
          design: `${overview.pages ? `${overview.pages} ${t(`${TRANSLATION_KEY}_DesignPages`)}, ` : ''}${
            overview.workbooks ? `${overview.workbooks} ${t(`${TRANSLATION_KEY}_DesignWorkbooks`)}, ` : ''
          }`,
        };

        return <List type={ListTypes.PROPERTIES} fields={headerListFields} dataSource={listDatasource} />;
      },
    },
    {
      title: t(`${TRANSLATION_KEY}_TableLastModified`),
      key: 'lastModified',
      width: '21%',
    },
    {
      title: '',
      key: 'workpaperSource',
      render: workpaperSource => {
        return (
          workpaperSource === WorkpaperSource.TRIFACTA && (
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.TOP}
              tooltipContent={t('Pages_EngagementWorkpapers_TrifactaTooltip')}
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
    if (workpapers && workpapers.items && workpapers.items.length > 0) {
      return (
        <Table
          headers={headers}
          rows={rows}
          mb={11}
          contentMaxHeight={475}
          minHeight={475}
          setElementScrollRef={setElementScrollRef}
          setContainerScrollRef={setContainerScrollRef}
          dataInstance={COMPONENT_NAME}
        />
      );
    } else if (isLoading) {
      return <Box minHeight={475} width='100%' />;
    }

    return <StateView title={t(`${TRANSLATION_KEY}_NoSearchResults`)} />;
  };

  return (
    <Box width='100%'>
      <Flex
        theme={theme}
        mt={8}
        mb={9}
        justifyContent='space-between'
        alignItems='center'
        dataInstance={`${COMPONENT_NAME}-ChooseWorkpaper`}
      >
        <Text type={TextTypes.H2} fontWeight='l'>
          {t(`${TRANSLATION_KEY}_Title`)}
        </Text>
        <Search
          data={workpapers.items || []}
          onChange={handleWorkpaperSearch}
          maxWidth='225px'
          manualFiltering
          dataInstance={COMPONENT_NAME}
          placeholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
        />
      </Flex>
      <Spinner spinning={isLoading}>{renderTable()}</Spinner>
    </Box>
  );
};

export default ChooseWorkpaperForm;
