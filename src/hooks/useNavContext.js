import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { WORKPAPER_TYPES } from '../utils/WorkpaperTypes.const';
import { findCurrentOutputInfo } from '../pages/WorkPaperOutput/utils/WorkPaperOutput.utils';
import { engagementSelectors } from '../store/engagement/selectors';
import { clientSelectors } from '../store/client/selectors';
import { bundlesSelectors } from '../store/bundles/selectors';
import { wpProcessSelectors } from '../store/workpaperProcess/selectors';
import { wpStep1Selectors } from '../store/workpaperProcess/step1/selectors';
import { wpStep3Selectors } from '../store/workpaperProcess/step3/selectors';
import { contentLibraryDMSelectors } from '../store/contentLibrary/datamodels/selectors';
import { notebookWPStep1Selector } from '../store/notebookWorkpaperProcess/step1/selectors';
import env from 'env';
import useTranslation from './useTranslation';

const routeIds = {
  CLIENT_NAME: 'client',
  CLIENT_SETUP: 'clientSetup',
  WORKPAPER_DATA: 'workpaperData',
  ENGAGEMENT: 'engagement',
  WORKPAPER: 'workpaper',
  CHILD_WORKPAPER: 'childWorkpaper',
  WORKPAPER_INPUT: 'workpaperInput',
  WORKPAPER_INPUT_DATA: 'workpaperInputData',
  WORKPAPER_OUTPUT: 'workpaperOutput',
  WORKPAPER_DMT_OUTPUT: 'workpaperDMTOutput',
  WORKPAPER_ANALYSIS: 'workpaperAnalysis',
  WORKPAPER_DMT_INPUT: 'workpaperDMTInput',
  CONTENT_LIBRARY: 'content-library',
  CL_WORKPAPERS: 'workpapers',
  CL_SOURCESYSTEMS: 'source-systems',
  CL_WORKPAPER: 'CLWorkpaper',
  CL_WORKPAPER_DATA: 'CLWorkpaperData',
  CL_WORKPAPER_ANALYSIS: 'CLWorkpaperAnalysis',
  CL_WORKPAPER_INPUT: 'CLWorkpaperInput',
  CL_WORKPAPER_INPUT_DATA: 'CLWorkpaperInputData',
  CL_NOTEBOOK_WORKPAPER_INPUT: 'CLNotebookWorkpaperInput',
  CL_NOTEBOOK_WORKPAPER_INPUT_DATA: 'CLNotebookWorkpaperInputData',
  CL_WORKPAPER_OUTPUT: 'CLWorkpaperOutput',
  CONTENT_LIBRARY_DATAMODELS: 'DataModels',
  CONTENT_LIBRARY_DATAMODEL_DATA: 'DataModel-data',
  CONTENT_LIBRARY_STANDARDBUNDLES: 'Standard-bundles',
  CONTENT_LIBRARY_COMMON_DATAMODELS: 'Common-datamodels',
  CONTENT_LIBRARY_PUBLISHEDDATAMODELS: 'Published-datamodel',
  CONTENT_LIBRARY_PIPELINES: 'Pipelines',
  CONTENT_LIBRARY_RELEASE: 'releases',
  CONTENT_LIBRARY_BUNDLES: 'Bundles',
  CONTENT_LIBRARY_BUNDLE: 'Bundle',
  CONTENT_LIBRARY_SOURCE_SYSTEM: 'SourceSystem',
  CONTENT_LIBRARY_VERSION: 'Version',
  CONTENT_LIBRARY_DEFINE_FILTERS: 'DefineFilters',
  CONTENT_LIBRARY_DATAMODELTRANSFORMATION: 'DatamodelTransformation',
  CONTENT_LIBRARY_DATAMODELTRANSFORMATION_DATA: 'DatamodelTransformationData',
  CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT: 'DatamodelTransformationDataInput',
  CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT_DATA: 'DatamodelTransformationInputData',
  CONTENT_LIBRARY_DATAMODELTRANSFORMATION_OUTPUT: 'DatamodelTransformationDataOutput',
  CONTENT_LIBRARY_BUNDLETRANSFORMATION: 'BundleTransformation',
  CONTENT_LIBRARY_BUNDLETRANSFORMATION_DATA: 'BundleTransformationData',
  CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT: 'BundleTransformationDataInput',
  CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT_DATA: 'BundleTransformationInputData',
  CONTENT_LIBRARY_BUNDLETRANSFORMATION_OUTPUT: 'BundleTransformationDataOutput',
};

const routes = [
  {
    id: routeIds.ENGAGEMENT,
    path: '/engagements/:engagementId',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT],
  },
  {
    id: routeIds.CLIENT_NAME,
    path: '/clients/:clientId',
    breadcrumbs: [routeIds.CLIENT_NAME],
  },
  {
    id: routeIds.CLIENT_SETUP,
    path: '/clients/:clientId/setup',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.CLIENT_SETUP],
  },
  {
    id: routeIds.WORKPAPER,
    path: '/workpapers/:workpaperId',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER],
  },
  {
    id: routeIds.CHILD_WORKPAPER,
    path: '/workpaper/:workpaperId/childworkpaper',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.CHILD_WORKPAPER],
  },
  {
    id: routeIds.CONTENT_LIBRARY,
    external: true,
    path: '/library',
    breadcrumbs: [routeIds.CONTENT_LIBRARY],
  },
  {
    id: routeIds.CL_WORKPAPER_DATA,
    external: true,
    path: '/library/workpapers/:workpaperId/data',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.CL_WORKPAPER_DATA],
  },
  {
    id: routeIds.CL_WORKPAPERS,
    external: true,
    path: '/library/workpapers',
    breadcrumbs: [routeIds.CL_WORKPAPERS],
  },
  {
    id: routeIds.CL_WORKPAPER,
    external: true,
    path: '/library/workpapers/:workpaperId',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER],
  },
  {
    id: routeIds.WORKPAPER_INPUT,
    path: '/workpapers/:workpaperId/inputs/:inputId',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_INPUT],
  },
  {
    id: routeIds.WORKPAPER_INPUT_DATA,
    path: '/workpapers/:workpaperId/inputs/:inputId/data',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_INPUT],
  },
  {
    id: routeIds.CL_WORKPAPER_INPUT,
    path: '/library/workpapers/:workpaperId/inputs/:inputId',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.WORKPAPER_INPUT],
  },
  {
    id: routeIds.CL_WORKPAPER_INPUT_DATA,
    path: '/library/workpapers/:workpaperId/inputs/:inputId/data',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.WORKPAPER_INPUT],
  },
  {
    id: routeIds.WORKPAPER_OUTPUT,
    path: '/workpapers/:workpaperId/outputs/:outputId',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_OUTPUT],
  },
  {
    id: routeIds.WORKPAPER_DMT_OUTPUT,
    path: '/workpapers/:mainWorkpaperId/:workpaperId/datamodelOutputs/:outputId',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_DMT_OUTPUT],
  },
  {
    id: routeIds.CL_WORKPAPER_OUTPUT,
    path: '/library/workpapers/:workpaperId/outputs/:outputId',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.WORKPAPER_OUTPUT],
  },
  {
    id: routeIds.WORKPAPER_DATA,
    path: '/workpapers/:workpaperId/data',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_DATA],
  },
  {
    id: routeIds.WORKPAPER_DMT_INPUT,
    path: '/workpapers/:workpaperId/datamodelTransformation/:datamodelTransformationId',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_DMT_INPUT],
  },
  {
    id: routeIds.WORKPAPER_ANALYSIS,
    external: true,
    label: 'Analysis',
    path: '/workpapers/:workpaperId/analysis/:workbookId?/:view?/source=:workpaperType',
    breadcrumbs: [routeIds.CLIENT_NAME, routeIds.ENGAGEMENT, routeIds.WORKPAPER, routeIds.WORKPAPER_ANALYSIS],
  },
  {
    id: routeIds.CL_WORKPAPER_ANALYSIS,
    external: true,
    label: 'Analysis',
    path: '/library/workpapers/:workpaperId/analysis/:workbookId?/:view?/source=:workpaperType',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.WORKPAPER_ANALYSIS],
  },
  {
    id: routeIds.CL_NOTEBOOK_WORKPAPER_INPUT,
    path: '/library/workpapers/:workpaperId/inputs/:inputId/source=:workpaperType',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.WORKPAPER_INPUT],
  },
  {
    id: routeIds.CL_NOTEBOOK_WORKPAPER_INPUT_DATA,
    path: '/library/workpapers/:workpaperId/inputs/:inputId/data/source=:workpaperType',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CL_WORKPAPERS, routeIds.CL_WORKPAPER, routeIds.WORKPAPER_INPUT],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODELS,
    external: true,
    path: '/library/datamodels',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_DATAMODELS],
  },
  {
    id: routeIds.CONTENT_LIBRARY_STANDARDBUNDLES,
    external: true,
    path: '/library/datamodels/standard-bundles',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_STANDARDBUNDLES],
  },
  {
    id: routeIds.CONTENT_LIBRARY_COMMON_DATAMODELS,
    external: true,
    path: '/library/datamodels/common-datamodels',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_COMMON_DATAMODELS],
  },
  {
    id: routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS,
    external: true,
    path: '/library/datamodels/published-datamodels',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODEL_DATA,
    external: true,
    path: '/library/datamodels/:datamodelId/data',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_DATAMODELS,
      routeIds.CONTENT_LIBRARY_DATAMODEL_DATA,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION,
    external: true,
    path: '/library/datamodelTransformations/:workpaperId',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_DATA,
    external: true,
    path: '/library/datamodelTransformations/:workpaperId/data',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_DATA,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT,
    path: '/library/datamodelTransformations/:workpaperId/inputs/:inputId',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT_DATA,
    path: '/library/datamodelTransformations/:workpaperId/inputs/:inputId/data',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_OUTPUT,
    path: '/library/datamodelTransformations/:workpaperId/outputs/:outputId',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION,
      routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_OUTPUT,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION,
    external: true,
    path: '/library/bundleTransformations/:workpaperId',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_STANDARDBUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_DATA,
    external: true,
    path: '/library/bundleTransformations/:workpaperId/data',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_STANDARDBUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_DATA,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT,
    path: '/library/bundleTransformations/:workpaperId/inputs/:inputId',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_STANDARDBUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT_DATA,
    path: '/library/bundleTransformations/:workpaperId/inputs/:inputId/data',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_STANDARDBUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_OUTPUT,
    path: '/library/bundleTransformations/:workpaperId/outputs/:outputId',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_STANDARDBUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION,
      routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_OUTPUT,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_PIPELINES,
    external: true,
    path: '/library/pipelines',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_PIPELINES],
  },
  {
    id: routeIds.CONTENT_LIBRARY_RELEASE,
    external: true,
    path: '/library/releases/pipelines',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_RELEASE, routeIds.CONTENT_LIBRARY_PIPELINES],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLES,
    external: true,
    path: 'library/bundles',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_BUNDLES],
  },
  {
    id: routeIds.CONTENT_LIBRARY_BUNDLE,
    external: true,
    path: 'library/bundles/:bundleId',
    breadcrumbs: [routeIds.CONTENT_LIBRARY, routeIds.CONTENT_LIBRARY_BUNDLES, routeIds.CONTENT_LIBRARY_BUNDLE],
  },
  {
    id: routeIds.CONTENT_LIBRARY_SOURCE_SYSTEM,
    external: true,
    path: 'library/bundles/:bundleId/sourceSystemName',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_BUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLE,
      routeIds.CONTENT_LIBRARY_SOURCE_SYSTEM,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_VERSION,
    external: true,
    path: 'library/bundles/:bundleId/sourceSystemName/version',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_BUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLE,
      routeIds.CONTENT_LIBRARY_SOURCE_SYSTEM,
      routeIds.CONTENT_LIBRARY_VERSION,
    ],
  },
  {
    id: routeIds.CONTENT_LIBRARY_DEFINE_FILTERS,
    external: true,
    path: '/library/bundles/:bundleId/filters',
    breadcrumbs: [
      routeIds.CONTENT_LIBRARY,
      routeIds.CONTENT_LIBRARY_BUNDLES,
      routeIds.CONTENT_LIBRARY_BUNDLE,
      routeIds.CONTENT_LIBRARY_SOURCE_SYSTEM,
      routeIds.CONTENT_LIBRARY_VERSION,
      routeIds.CONTENT_LIBRARY_DEFINE_FILTERS,
    ],
  },
  { id: 'clients', path: '/clients', title: 'My Clients' },
  { id: 'home', path: '/', title: 'Home' },
  { id: 'omnia', path: '/omnia', title: 'Omnia' },
];

const GetCrumbs = path => {
  const crumbs = [];
  const route = routes.filter(x => x.path === path)[0];
  if (route && route.breadcrumbs) {
    route.breadcrumbs.forEach(element => {
      const crumb = routes.filter(x => x.id === element)[0];
      if (crumb) {
        crumbs.push(crumb);
      }
    });
  }

  return crumbs;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const useNavContext = match => {
  const { t } = useTranslation();

  const location = useLocation();
  const [crumbs, setCrumbs] = useState(GetCrumbs(match.path));

  const client = useSelector(clientSelectors.selectClient);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const outputs = useSelector(wpStep3Selectors.selectUngroupedOutputs(workpaper?.id));
  const dmtOutputs = useSelector(wpStep3Selectors.selectUngroupedOutputs(match?.params?.workpaperId));
  const datamodel = useSelector(contentLibraryDMSelectors.datamodel);
  const bundleNames = useSelector(bundlesSelectors.selectBundleNameDetails);
  const dmt = useSelector(wpProcessSelectors.selectDMT(match?.params?.datamodelTransformationId));

  let selector = wpStep1Selectors;
  if (workpaper?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
    selector = notebookWPStep1Selector;
  }
  const input = useSelector(selector.selectInput);

  const outputInfo = findCurrentOutputInfo(outputs, match?.params?.outputId);
  const dmtOutputInfo = dmtOutputs?.outputs?.find(output => output?.id === match?.params?.outputId);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const mapCrumbs = breadcrumbs => {
    const mappedCrumbs = breadcrumbs;

    mappedCrumbs.forEach((crumb, index) => {
      // Map dynamic routes here.
      switch (crumb.id) {
        case routeIds.CLIENT_NAME:
          mappedCrumbs[index].label = client ? client.name : '';
          mappedCrumbs[index].to = client ? crumb.path.replace(':clientId', client.id) : '';
          break;
        case routeIds.CLIENT_SETUP:
          mappedCrumbs[index].label = t('Pages_Client_HeaderBar_SecButtonText');
          mappedCrumbs[index].to = client ? crumb.path.replace(':clientId', client.id) : '';
          break;
        case routeIds.ENGAGEMENT:
          mappedCrumbs[index].label = engagement ? engagement.name : '';
          mappedCrumbs[index].to = engagement ? crumb.path.replace(':engagementId', engagement.id) : '';
          break;
        case routeIds.CL_WORKPAPER:
        case routeIds.WORKPAPER:
        case routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION:
        case routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION:
          mappedCrumbs[index].label = workpaper ? workpaper.name : '';
          mappedCrumbs[index].to = workpaper ? crumb.path.replace(':workpaperId', workpaper.id) : '';
          break;
        case routeIds.CONTENT_LIBRARY:
          mappedCrumbs[index].label = t('Pages_Trifacta_Content_Library');
          mappedCrumbs[index].to = `${env.EXTRACTIONUI_URL}/${routeIds.CONTENT_LIBRARY}/${routeIds.CL_SOURCESYSTEMS}`;
          break;
        case routeIds.CL_WORKPAPERS:
          mappedCrumbs[index].label = t('Pages_Trifacta_Content_Library_Workpapers');
          mappedCrumbs[index].to = `${env.EXTRACTIONUI_URL}/${routeIds.CONTENT_LIBRARY}/${routeIds.CL_WORKPAPERS}`;
          break;
        case routeIds.WORKPAPER_INPUT:
        case routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_INPUT:
        case routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_INPUT:
          mappedCrumbs[index].label = input ? input.name : '';
          mappedCrumbs[index].to = '';
          break;
        case routeIds.WORKPAPER_OUTPUT:
        case routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_OUTPUT:
        case routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_OUTPUT:
          mappedCrumbs[index].label = outputInfo ? outputInfo.name : '';
          mappedCrumbs[index].to = '';
          break;
        case routeIds.WORKPAPER_DMT_OUTPUT:
          mappedCrumbs[index].label = dmtOutputInfo ? dmtOutputInfo.name : '';
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CL_WORKPAPER_DATA:
        case routeIds.WORKPAPER_DATA:
        case routeIds.CONTENT_LIBRARY_DATAMODELTRANSFORMATION_DATA:
        case routeIds.CONTENT_LIBRARY_BUNDLETRANSFORMATION_DATA:
          mappedCrumbs[index].label = t('Pages_Trifacta_Content_Library_Data_Wrangler');
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CONTENT_LIBRARY_DATAMODELS:
          mappedCrumbs[index].label = t('Pages_Content_Library_DataModels');
          mappedCrumbs[index].to = crumb.path;
          break;
        case routeIds.CONTENT_LIBRARY_COMMON_DATAMODELS:
          mappedCrumbs[index].label = t('Pages_Content_Library_Common_Datamodels');
          mappedCrumbs[index].to = crumb.path;
          break;
        case routeIds.CONTENT_LIBRARY_DATAMODEL_DATA:
          mappedCrumbs[index].label = datamodel?.nameTech;
          mappedCrumbs[index].to = crumb.path;
          break;
        case routeIds.CONTENT_LIBRARY_STANDARDBUNDLES:
          mappedCrumbs[index].label = t('Pages_Content_Library_StandardBundles');
          mappedCrumbs[index].to = crumb.path;
          break;
        case routeIds.CONTENT_LIBRARY_PUBLISHEDDATAMODELS:
          mappedCrumbs[index].label = t('Pages_Content_Library_PublishedDatamodels');
          mappedCrumbs[index].to = crumb.path;
          break;
        case routeIds.CONTENT_LIBRARY_BUNDLES:
          mappedCrumbs[index].label = t('Pages_ContentLibrary_Extraction_Bundles');
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CONTENT_LIBRARY_BUNDLE:
          mappedCrumbs[index].label = bundleNames ? bundleNames.bundleBaseName : '';
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CONTENT_LIBRARY_SOURCE_SYSTEM:
          mappedCrumbs[index].label = bundleNames ? bundleNames.sourceSystemName : '';
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CONTENT_LIBRARY_VERSION:
          mappedCrumbs[index].label = bundleNames ? bundleNames.sourceVersionName : '';
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CONTENT_LIBRARY_DEFINE_FILTERS:
          mappedCrumbs[index].label = t('Pages_ContentLibrary_Define_Filters');
          mappedCrumbs[index].to = '';
          break;
        case routeIds.CONTENT_LIBRARY_PIPELINES:
          mappedCrumbs[index].label = t('Pages_Content_Library_Pipelines');
          mappedCrumbs[index].to = crumb.path;
          break;
        case routeIds.CONTENT_LIBRARY_RELEASE:
          mappedCrumbs[index].label = t('Pages_Content_Library_Releases_Pipelines');
          mappedCrumbs[
            index
          ].to = `${env.EXTRACTIONUI_URL}/${routeIds.CONTENT_LIBRARY}/${routeIds.CONTENT_LIBRARY_RELEASE}`;
          break;
        case routeIds.CHILD_WORKPAPER:
          mappedCrumbs[index].label = t('Components_Create_Child_Workpaper_Button');
          mappedCrumbs[index].to = '';
          break;
        case routeIds.WORKPAPER_DMT_INPUT:
          mappedCrumbs[index].label = dmt ? dmt.connectedInputName : '';
          let dmtPath = crumb.path;

          if (workpaper && dmt) {
            dmtPath = dmtPath.replace(':workpaperId', workpaper.id).replace(':datamodelTransformationId', dmt.id);
          } else {
            dmtPath = '';
          }

          mappedCrumbs[index].to = dmtPath;
          break;
        default:
          if (!crumb.label) {
            mappedCrumbs[index].label = '...';
          }
      }

      return crumb;
    });

    return mappedCrumbs;
  };

  useEffect(() => {
    setCrumbs(GetCrumbs(match.path));
  }, [match.path, location.pathname]);

  return { crumbs: mapCrumbs(crumbs) };
};

export default useNavContext;
