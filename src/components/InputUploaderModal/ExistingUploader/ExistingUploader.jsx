import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonTypes,
  FilePreview,
  Flex,
  IconTypes,
  Spinner,
  FilePreviewTypes,
  Tree,
  Search,
  Select,
  SelectTypes,
  Box,
  RadioGroup,
  Text,
  TextTypes,
  Intent,
  Checkbox,
  Input,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChildrenFolder,
  getRootFolder,
  previewFile,
  getDatamodelFields,
  getDatamodelList,
  previewXLSXSheet,
} from '../../../store/dialogs/attachFiles/actions';
import { AttachFilesActions } from '../../../store/dialogs/attachFiles/actionTypes';
import { attachDialogSelectors } from '../../../store/dialogs/attachFiles/selectors';
import { BackButton, Preview, TreeMenu } from '../StyledFileUpload';
import { ThemeContext } from 'styled-components';
import { DELIMITER } from '../components/Delimeter/constants';
import { Header } from '../components/Header/Header';
import { PreviewSettings } from '../components/UploadedFilePreview/PreviewSettings';
import { attachExistingNode, uploadNewInput, uploadNewDataModel } from '../../../store/workpaperProcess/step1/actions';
import { useParams } from 'react-router-dom';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { datawranglerSelectors } from '../../../store/dataWrangler/selectors';
import { engagementSelectors } from '../../../store/engagement/selectors';
import { clientSelectors } from '../../../store/client/selectors';
import { bundlesSelectors } from '../../../store/bundles/selectors';
import { COMPONENT_NAME, ICON_TYPE, UPLOAD_TYPE } from './constants';
import { getInputHeaderSelectionOptions } from '../constants/constants';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import useConfig from '../../WorkPaperProcess/hooks/useConfig';
import useTranslation from 'src/hooks/useTranslation';
import { isEmpty } from 'lodash';
import { addInputFileError } from '../../../store/errors/actions';
import useIsSpecificRoute from 'src/hooks/useIsSpecificRoute';
import { shouldSendMessageRoutes } from 'src/constants/pipelineMessages';

const ADD_DATAMODEL_KEY = 'add datamodel';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ExistingUploader = forwardRef((props, ref) => {
  const {
    onBack,
    onClose,
    inputId,
    shouldClean,
    workpaperType,
    isNewUpload,
    dataTableName,
    trifactaFlowId,
    uploadtype,
    selectedInput,
    canvasType,
    isDMT,
  } = props;
  const { t } = useTranslation();
  const { workpaperId } = useParams();
  const { config } = useConfig(canvasType);
  const [path, setPath] = useState('');
  const [headers, setHeaders] = useState(null);
  const [jsonPreview, setJsonPreview] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [delimiter, setDelimiter] = useState(DELIMITER.COMMA);
  const [datamodelTree, setDatamodelTree] = useState({});
  const [selectedDataModel, setSelectedDataModel] = useState([]);
  const [ensureHeader, setEnsureHeader] = useState(true);
  const [sheetOptions, setSheetOptions] = useState([]);
  const [currentSheet, setCurrentSheet] = useState([]);
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [isPriorPeriod, setIsPriorPeriod] = useState(false);
  const [priorPeriodYear, setPriorPeriodYear] = useState(1);
  const shouldSendMessage = useIsSpecificRoute(shouldSendMessageRoutes);

  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();

  const engagementId = useSelector(engagementSelectors.selectEngagement)?.id;
  const clientId = useSelector(clientSelectors.selectClient)?.id;
  const tree = useSelector(attachDialogSelectors.folderStructure);
  const datamodelTreeData = useSelector(attachDialogSelectors.datamodelTreeData);
  const treeIsLoading = useSelector(attachDialogSelectors.isLoading);
  const fileIsLoading = useSelector(attachDialogSelectors.previewLoading);
  const isAttachingFile = useSelector(wpStep1Selectors.isAttachingFile);
  const preview = useSelector(attachDialogSelectors.preview);
  const nodeId = useSelector(attachDialogSelectors.nodeId);
  const sheetData = useSelector(attachDialogSelectors.sheetData);
  const isDatasetUpdating = useSelector(datawranglerSelectors.isDatasetUpdating);
  const datamodelsListForWB = useSelector(bundlesSelectors.datamodelsListForWB);

  useEffect(() => {
    setDatamodelTree(datamodelTreeData);
  }, [datamodelTreeData]);

  useEffect(() => {
    if (UPLOAD_TYPE[uploadtype] !== UPLOAD_TYPE.select) {
      dispatch(getDatamodelList());
    }
  }, [dispatch]);

  useEffect(() => {
    if (UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select) {
      dispatch(getRootFolder(engagementId, clientId));
    }

    return () => {
      dispatch({
        type: AttachFilesActions.RESET,
      });
    };
  }, [engagementId, clientId, dispatch]);

  useEffect(() => {
    if (path !== '') {
      if (UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select) {
        if (isEmpty(currentSheet)) {
          dispatch(previewFile(t, path, previewName, delimiter, workpaperId, engagementId, trifactaFlowId));
        } else {
          dispatch(previewXLSXSheet(path, previewName, engagementId, trifactaFlowId, currentSheet));
        }
      } else {
        dispatch(getDatamodelFields(path));
      }
    }
  }, [path, delimiter, currentSheet, dispatch]);

  useEffect(() => {
    if (path && Object.values(preview.data).length > 0) {
      setJsonPreview(preview.data);
    }
  }, [preview]);

  useEffect(() => {
    if (Array.isArray(sheetData)) {
      setSheetOptions(sheetData.map((sheet, i) => ({ ...sheet, value: i, text: sheet.sheet })));
    }
  }, [sheetData]);

  const onPreviewClickHandler = (previewPath, fileName) => {
    setPreviewName(fileName);
    setPath(previewPath);
  };

  const onTreeItemClick = (id, folderPath) => {
    if (UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select) {
      dispatch(getChildrenFolder(engagementId, id, folderPath));
    }
  };

  const validateMultipleSheets = sheets => {
    if (!sheets.length) {
      return [];
    }

    const sheetsWithErrors = [];
    const firstSheet = sheets[0];

    sheets.forEach(sheet => {
      if (sheet.schema.length !== firstSheet.schema.length) {
        sheetsWithErrors.push(sheet);
      } else {
        for (let i = 0; i < sheet.schema.length; i++) {
          if (sheet.schema[i].name !== firstSheet.schema[i].name) {
            sheetsWithErrors.push(sheet);
            break;
          }
        }
      }
    });

    return sheetsWithErrors;
  };

  const typeOfDispatch = () => {
    let fileContent;
    if (UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE[ADD_DATAMODEL_KEY]) {
      const arr = [];
      for (let i = 0; i < headers.length; i++) {
        arr.push(headers[i].name);
      }
      const csvFile = `${arr.join(',')}\r`;
      const myFile = new Blob([csvFile], { type: 'text/csv' });
      const ModifiedDate = new Date();
      fileContent = new File([myFile], previewName, { lastModifiedDate: ModifiedDate });
    }
    const dmId = selectedInput?.datamodelId || selectedDataModel[0]?.id;

    return UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select
      ? dispatch(
          uploadNewInput(
            workpaperId,
            shouldClean,
            {},
            headers,
            selectedSheets,
            delimiter,
            null,
            dataTableName,
            nodeId,
            trifactaFlowId,
            selectedInput?.id,
            dmId,
            false,
            ensureHeader,
            shouldSendMessage
          )
        )
      : dispatch(
          uploadNewDataModel(
            workpaperId,
            headers,
            delimiter,
            path,
            previewName,
            fileContent,
            trifactaFlowId,
            isDMT,
            true,
            isPriorPeriod,
            priorPeriodYear
          )
        );
  };

  const handleSubmit = () => {
    if (nodeId && headers) {
      const sheetsWithErrors = validateMultipleSheets(selectedSheets);
      if (!sheetsWithErrors.length) {
        onClose();
        if (workpaperType === WORKPAPER_TYPES.TRIFACTA && isNewUpload) {
          typeOfDispatch();
        } else {
          dispatch(
            attachExistingNode(
              workpaperId,
              inputId,
              nodeId,
              headers,
              shouldClean,
              delimiter,
              selectedSheets,
              workpaperType,
              trifactaFlowId,
              ensureHeader
            )
          );
        }
      } else {
        dispatch(
          addInputFileError({
            message: t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_Error_Sheets'),
            type: Intent.ERROR,
          })
        );
      }
    }
  };

  const onChange = value => {
    setSelectedDataModel(value);
  };

  const onInputChange = value => {
    if (value) {
      setSelectedDataModel([]);
    }
  };

  const handleOnchangeSearch = textSearch => {
    const searchText = textSearch;
    if (searchText) {
      const filteredDM = {};
      const searchRegExp = searchText.toLowerCase();
      [...Object.values(datamodelTreeData)].forEach(eachValue => {
        if (eachValue.name?.toLowerCase()?.includes(searchRegExp)) {
          filteredDM[`${eachValue.id}`] = { ...eachValue };
        }
      });
      setDatamodelTree(filteredDM);
    } else {
      setDatamodelTree(datamodelTreeData);
    }
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  const inputValidation = e => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const updatePriorPeriod = e => {
    if (!e.target.value || e.target.value === '0') setIsPriorPeriod(false);
    setPriorPeriodYear(e.target.value);
  };

  const updateIsPriorPeriod = value => {
    if (!priorPeriodYear || priorPeriodYear === '0') setPriorPeriodYear(1);
    setIsPriorPeriod(value);
  };

  return (
    <>
      <Header
        titleText={t(`Pages_EngagementWorkpapers_AttachSourceModal_Existing_Title_${UPLOAD_TYPE[uploadtype]}`)}
        noteText={t(`Pages_EngagementWorkpapers_AttachSourceModal_Existing_Note_${UPLOAD_TYPE[uploadtype]}`)}
      />

      <Spinner spinning={treeIsLoading || fileIsLoading || isAttachingFile || isDatasetUpdating}>
        <Box dataInstance={`${COMPONENT_NAME}-Model`}>
          <Flex theme={theme} my={8} flexDirection='column'>
            <Flex mb={4} flexGrow={1}>
              {UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE[ADD_DATAMODEL_KEY] && (
                <Flex alignItems='flex-end' minWidth='30%' maxWidth='30%' mr={8}>
                  <Search
                    dataInstance={`${COMPONENT_NAME}_Search_Datamodel_Bundle`}
                    maxWidth='100%'
                    data={[]}
                    onChange={handleOnchangeSearch}
                    placeholder={t('Components_WORKPAPERPROCESS_DATAMODEL_SEARCH_PLACEHOLDER')}
                    manualFiltering
                  />
                </Flex>
              )}

              <PreviewSettings
                indicatorType={UPLOAD_TYPE[uploadtype]}
                showDelimeter={UPLOAD_TYPE[uploadtype] !== UPLOAD_TYPE[ADD_DATAMODEL_KEY]}
                fileName={previewName}
                isNameCanClose={false}
                onDeleteFile={() => {
                  setJsonPreview(null);
                }}
                sheets={sheetOptions}
                onDelimiterChange={value => setDelimiter(value)}
                isExistingFile
                onSheetChange={sheets => {
                  setSelectedSheets(sheets);
                }}
                onLastSelectedChange={sheet => {
                  setCurrentSheet(sheet);
                }}
              />
            </Flex>
            <Flex>
              <TreeMenu
                flexGrow={1}
                minWidth='30%'
                maxWidth='30%'
                data-instance={`${COMPONENT_NAME}-LeftBody-Tree-wrapper`}
              >
                <Tree
                  nodes={UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select ? tree : datamodelTree}
                  defaultOpen={UPLOAD_TYPE[uploadtype] !== UPLOAD_TYPE.select}
                  onItemClick={onTreeItemClick}
                  onPreviewClick={onPreviewClickHandler}
                  iconType={
                    UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE[ADD_DATAMODEL_KEY]
                      ? ICON_TYPE.plusMinus
                      : ICON_TYPE.folderFile
                  }
                  iconStyle={
                    UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select
                      ? { width: 28, height: 28 }
                      : { width: 22, height: 22 }
                  }
                  data-instance={`${COMPONENT_NAME}-LeftBody-Tree`}
                />
              </TreeMenu>

              <Flex flexGrow={2} data-instance={`${COMPONENT_NAME}-RightBody`}>
                <Preview data-instance={`${COMPONENT_NAME}-RightBody-Preview`}>
                  <FilePreview type={FilePreviewTypes.DEFAULT} json={jsonPreview} setHeaders={setHeaders} />
                </Preview>
              </Flex>
            </Flex>
          </Flex>
          {workpaperType === WORKPAPER_TYPES.TRIFACTA && UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE[ADD_DATAMODEL_KEY] && (
            <Box ml={300} mt={-65}>
              <Box ml={5}>
                <Checkbox
                  label={t('Pages_EngagementWorkpapers_AttachSourceModal_Existing_Comparative_Period')}
                  isChecked={isPriorPeriod}
                  onChange={() => updateIsPriorPeriod(!isPriorPeriod)}
                />
              </Box>
              <Box mt={5} display='flex'>
                <Box width={40}>
                  <Input onKeyPress={inputValidation} onChange={updatePriorPeriod} value={priorPeriodYear} />
                </Box>
                <Box ml={5}>
                  <Text>
                    <i>{t('Pages_EngagementWorkpapers_AttachSourceModal_Existing_Prior_Periods')}</i>
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
          {workpaperType === WORKPAPER_TYPES.TRIFACTA && UPLOAD_TYPE[uploadtype] === UPLOAD_TYPE.select && jsonPreview && (
            <Box display='none' my={8}>
              <Text type={TextTypes.H3}>{t('Components_FileUploader_HeaderRow_Label')}</Text>
              <RadioGroup
                dataInstance={`${COMPONENT_NAME}-Header`}
                fontWeight='s'
                options={getInputHeaderSelectionOptions(t)}
                selectedValue={ensureHeader}
                onOptionChange={value => setEnsureHeader(value)}
              />
            </Box>
          )}
        </Box>
      </Spinner>
      {config?.step1?.smartUploadExists && isNewUpload && UPLOAD_TYPE[uploadtype] !== UPLOAD_TYPE[ADD_DATAMODEL_KEY] && (
        <Box width='30%' mb={3}>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Pages_EngagementWorkpapers_AttachSourceModal_Delimiter_SelectDataModel')}
            options={datamodelsListForWB}
            value={selectedDataModel}
            filtering
            onChange={onChange}
            onInputChange={onInputChange}
            inputChangeDebounce={1000}
            optionValueKey='nameTech'
            optionTextKey='nameTech'
            dataInstance={COMPONENT_NAME}
          />
        </Box>
      )}

      <BackButton
        type={ButtonTypes.SECONDARY}
        icon={IconTypes.CHEVRON_LEFT}
        onClick={onBack}
        data-instance={`${COMPONENT_NAME}-Back`}
      >
        {t('Components_AddNewWorkpaperModal_Tertiary')}
      </BackButton>
    </>
  );
});

ExistingUploader.propType = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
