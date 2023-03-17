import { useSelector, useDispatch } from 'react-redux';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';
import useTranslation from '../../../../../hooks/useTranslation';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BundleHeaders, renderSourceSystem } from './TableComponent/TableComponents';
import { isActiveStandardBundleTab, isActiveDataModelsTab, isTableEmpty } from '../../utils/DataModelsHelper';
import { bundlesSelectors } from '../../../../../store/bundles/selectors';
import { getPublishedBundleBaseList } from '../../../../../store/bundles/actions';
import { workpaperSelectors } from '../../../../../store/workpaper/selectors';
import { getEnvironments } from '../../../../../store/contentLibrary/datamodels/actions';
import { resetIngestDMTError } from '../../../../../store/errors/actions';
import ModalIngestDmt from './ModalIngestDMT/ModalIngestDMT';
import { Box, Table, Spinner, StateView } from 'cortex-look-book';
import { contentLibraryDMSelectors } from '../../../../../store/contentLibrary/datamodels/selectors';
import FromDataModelsList from './FromDataModelsList/FromDataModelsList';
import { INGEST_TYPES } from '../../constants/constants';
import IngestStatusModal from './IngestStatusModal/IngestStatusModal';

import { flatMap } from 'lodash';

const PAGE_NAME = 'CL_DATAMODEL_TRANSFORMATIONS';

// eslint-disable-next-line sonarjs/cognitive-complexity
const DataModelTransformations = ({ selectedTab, searchText, selectedTags }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [datamodelsList, setDataModelsList] = useState([]);
  const [bundleBaseList, setBundleBaseList] = useState([]);
  const [bundleList, setBundleList] = useState({});
  const [isInnerTemplate, setIsInnerTemplate] = useState(false);
  const isDataModelsFetching = useSelector(contentLibraryDMSelectors.isDataModelsFetching);
  const publishedDatamodels = useSelector(contentLibraryDMSelectors.publishedDatamodels);
  const isValidatingDMT = useSelector(contentLibraryDMSelectors.isValidatingDMT);
  const isCreatingNewDMT = useSelector(contentLibraryDMSelectors.isCreatingNewDMT);
  const tags = useSelector(bundlesSelectors.selectTagsPublishedList);
  const isBundleBaseFetching = useSelector(bundlesSelectors.isBundleBaseFetching);
  const publishedBundleBase = useSelector(bundlesSelectors.publishedBundleBase);
  const publishedBundleBaseListCount = useSelector(bundlesSelectors.publishedBundleBaseListCount);
  const publishedBundlesList = useSelector(bundlesSelectors.publishedBundlesList);
  const publishedBundlesListInnerTemplate = useSelector(bundlesSelectors.publishedBundlesListInnerTemplate);
  const isConfiguringBundle = useSelector(workpaperSelectors.selectIsConfiguringBundle);
  const [scrollOn, setScrollOn] = useState(!isBundleBaseFetching);
  const [tagsList, setTagsList] = useState([]);
  const [contextButtonRef, setContextButtonRef] = useState({ current: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ingestDMTOpen, setIngestDMTOpen] = useState(false);
  const [selectedDMTRow, setSelectedDMTRow] = useState({});
  const [activeDMT, setActiveDMT] = useState({});
  const [ingestReportOpen, setIngestReportOpen] = useState(false);
  const [activeSB, setActiveSB] = useState({});
  const refTableContainer = useRef();

  const handleContextButton = (e, row) => {
    e.stopPropagation();
    setContextButtonRef({ current: e.target });
    setIsMenuOpen(true);
    setSelectedDMTRow(row);
  };

  const handleIngestDMTModal = (value, selectedDMT) => {
    setIngestDMTOpen(value);
    if (value) {
      dispatch(resetIngestDMTError());
      dispatch(getEnvironments());
      setActiveDMT(selectedDMT);
    }
  };

  const emptyStateText = () => {
    if (isActiveDataModelsTab(selectedTab)) {
      return (searchText || '').length > 0
        ? t('Pages_Content_Library_DataModelsListing_NoSearchResults')
        : t('Pages_Content_Library_DataModelsListing_NoWorkpapers');
    }

    return (searchText || '').length > 0
      ? t('Pages_Content_Library_BundleBaseListing_NoSearchResults')
      : t('Pages_Content_Library_BundleBaseListing_NoList');
  };

  const bundleHeaders = BundleHeaders(tagsList);

  useEffect(() => {
    if (tags?.items) {
      setTagsList(flatMap(tags.items || [], x => x.tags));
    }
  }, [tags]);

  useEffect(() => {
    if (!isBundleBaseFetching) {
      setScrollOn(true);
    }
  }, [isBundleBaseFetching]);

  useEffect(() => {
    if (isActiveDataModelsTab(selectedTab)) {
      const dmList = publishedDatamodels;
      setDataModelsList(
        (dmList || []).filter(
          x =>
            (x.nameTech || '')
              .trim()
              .toLowerCase()
              .indexOf((searchText || '').trim().toLowerCase()) > -1
        )
      );
    }
  }, [publishedDatamodels, searchText]);

  useEffect(() => {
    setBundleBaseList([...publishedBundleBase]);
  }, [publishedBundleBase]);

  useEffect(() => {
    setBundleList(publishedBundlesList);
  }, [publishedBundlesList]);

  useEffect(() => {
    setIsInnerTemplate(publishedBundlesListInnerTemplate);
  }, [publishedBundlesListInnerTemplate]);

  const handleInfiniteScroll = () => {
    if (bundleBaseList.length < publishedBundleBaseListCount && !isBundleBaseFetching) {
      setScrollOn(false);
      dispatch(getPublishedBundleBaseList(10, bundleBaseList.length, searchText, selectedTags));
    }
  };

  useInfiniteScroll(refTableContainer, handleInfiniteScroll, -200);

  const getTable = useCallback(() => {
    const dataModelTable = (
      <FromDataModelsList
        datamodelsList={datamodelsList}
        dataInstance={`${PAGE_NAME}-DataModelsListing-Table`}
        tagsList={tagsList}
      />
    );

    if (isActiveStandardBundleTab(selectedTab)) {
      const bundleTable = (
        <Table
          rowIdKey='bundleBaseId'
          headers={bundleHeaders}
          rows={bundleBaseList}
          dataInstance={`${PAGE_NAME}-StandartBundlesListing-Table`}
          isRowExpandable={() => {
            return true;
          }}
          renderInnerTemplate={rowDetails => {
            return renderSourceSystem(
              rowDetails,
              selectedDMTRow,
              dispatch,
              bundleList,
              t,
              handleContextButton,
              isMenuOpen,
              contextButtonRef,
              handleIngestDMTModal,
              setIsMenuOpen,
              setIngestReportOpen,
              setActiveSB,
              isInnerTemplate
            );
          }}
        />
      );

      return (
        <Box>
          <div ref={refTableContainer}>
            {bundleTable}
            {bundleBaseList.length < publishedBundleBaseListCount && (
              <Box mt={5}>
                <Spinner spinning hideOverlay />
              </Box>
            )}
          </div>
        </Box>
      );
    }

    return dataModelTable;
  });

  return (
    <Box dataInstance={`${PAGE_NAME}-DataModelsListing-Table-Container`}>
      <Spinner
        dataInstance={`${PAGE_NAME}-DataModelsListing-Table-Container`}
        spinning={
          isDataModelsFetching ||
          (isBundleBaseFetching && scrollOn) ||
          isCreatingNewDMT ||
          isValidatingDMT ||
          isConfiguringBundle
        }
      >
        {isTableEmpty(selectedTab, datamodelsList, bundleBaseList) ? (
          getTable()
        ) : (
          <StateView title={emptyStateText()} dataInstance={`${PAGE_NAME}-DataModelsListing-NoRecords`} />
        )}
        {ingestDMTOpen && (
          <ModalIngestDmt
            handleIngestDMTModal={handleIngestDMTModal}
            ingestDMTOpen={ingestDMTOpen}
            activeDMT={activeDMT}
          />
        )}
        {ingestReportOpen && (
          <IngestStatusModal
            isOpen={ingestReportOpen}
            handleClose={setIngestReportOpen}
            selectedDM={activeSB}
            dataInstance={`${PAGE_NAME}-Bundle_Transformation_Ingest_StatusModal`}
            ingestType={INGEST_TYPES.BUNDLE_TRANSFORMATION}
          />
        )}
      </Spinner>
    </Box>
  );
};

export default DataModelTransformations;
