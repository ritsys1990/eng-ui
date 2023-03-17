import {
  DATAMODEL_TABS,
  DATAMODEL_TRANSFORMATION_TABS,
  ContextMenuOptions,
  NEW_DM_TYPES,
  EDITOR_TABS,
  ADD_NEW_DMT,
  INGEST_DM_RENAME,
  DMT_SOURCE,
  INGEST_DMT,
  INGEST_STATUS,
  RELEASE_TYPE_FIELD_VALUES,
} from '../constants/constants';
import { IconTypes } from 'cortex-look-book';
import { Actions, Permissions } from '../../../../utils/permissionsHelper';

export const getTabs = t => {
  const tabs = [
    {
      id: DATAMODEL_TABS.DATAMODELS,
      label: t('Pages_Content_Library_DataModel_Tabs_DataModels'),
    },
    {
      id: DATAMODEL_TABS.COMMON_DATAMODELS,
      label: t('Pages_Content_Library_DataModel_Tabs_CommonDataModels'),
    },
    {
      id: DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS,
      label: t('Pages_Content_Library_DataModel_Tabs_DataModelsTransformations'),
    },
  ];

  return tabs.filter(tab => !tab.disabled);
};

export const getDMTTabs = t => {
  const dmtTabs = [
    {
      id: DATAMODEL_TRANSFORMATION_TABS.STANDARD_BUNDLES,
      label: t('Pages_Content_Library_DataModel_Transformation_Tabs_StandardBundles'),
    },
    {
      id: DATAMODEL_TRANSFORMATION_TABS.DATAMODELS,
      label: t('Pages_Content_Library_DataModel_Transformation_Tabs_DataModel'),
    },
  ];

  return dmtTabs.filter(tab => !tab.disabled);
};

export const getEditorTabs = t => {
  return [
    {
      id: EDITOR_TABS.GENERAL_INSTRUCTION,
      label: t(`Pages_Content_Library_DataModel_Add_Guidance_Tabs_Label_General_Instruction`),
    },
    {
      id: EDITOR_TABS.DATASET_DESCRIPTION,
      label: t(`Pages_Content_Library_DataModel_Add_Guidance_Tabs_Label_Dataset_Description`),
    },
    {
      id: EDITOR_TABS.COLUMN_DESCRIPTION,
      label: t(`Pages_Content_Library_DataModel_Add_Guidance_Tabs_Label_Column_Description`),
    },
  ];
};

export const defaultPlaceholders = (activeEditorTab, t) => {
  const placeholderList = {
    general_instruction: t(`Pages_Content_Library_DataModel_Add_Guidance_Tabs_Placeholder_General_Instruction`),
    dataset_description: t(`Pages_Content_Library_DataModel_Add_Guidance_Tabs_Placeholder_Dataset_Description`),
    column_description: t(`Pages_Content_Library_DataModel_Add_Guidance_Tabs_Placeholder_Column_Description`),
  };

  return placeholderList[activeEditorTab];
};

export const getContextMenuOptions = t => {
  return [
    {
      id: ContextMenuOptions.EDIT,
      text: t(`Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Edit`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.UPDATE,
      },
    },
    {
      id: ContextMenuOptions.UPLOAD_EXAMPLE_CSV,
      text: t(`Pages_Content_Library_DataModelsListing_UploadExCSV`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.UPDATE,
      },
    },
    {
      id: ContextMenuOptions.ADD_GUIDANCE,
      text: t(`Pages_Content_Library_DataModelsListing_AddGuidance`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.UPDATE,
      },
    },
    {
      id: ContextMenuOptions.SUBMIT_REVIEW,
      text: t(`Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Submit`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.SUBMIT,
      },
    },
    {
      id: ContextMenuOptions.DELETE,
      text: t(`Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Delete`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.DELETE,
      },
    },
    {
      id: ContextMenuOptions.EXPORT,
      text: t(`Pages_Content_Library_DataModelsListing_Export`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.VIEW,
      },
    },
  ];
};

export const isActiveStandardBundleTab = activeTab => {
  return activeTab === DATAMODEL_TRANSFORMATION_TABS.STANDARD_BUNDLES;
};

export const isActiveDataModelsTab = activeTab => {
  return activeTab === DATAMODEL_TRANSFORMATION_TABS.DATAMODELS;
};

export const getDMFieldMenuOptions = t => {
  return [
    {
      id: ContextMenuOptions.EDIT,
      text: t(`Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Edit`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.UPDATE,
      },
    },
    {
      id: ContextMenuOptions.DELETE,
      text: t(`Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Delete`),
      permission: {
        permission: Permissions.DATA_MODALS,
        action: Actions.DELETE,
      },
    },
  ];
};

export const isTableEmpty = (selectedTab, datamodelsList, bundleBaseList) => {
  if (isActiveDataModelsTab(selectedTab)) {
    return datamodelsList?.length > 0;
  } else if (isActiveStandardBundleTab(selectedTab)) {
    return bundleBaseList?.length > 0;
  }

  return false;
};

export const getDMTFromDMOptions = t => {
  return [
    {
      id: ADD_NEW_DMT,
      text: t(`Pages_Content_Library_DMTS_ADD_NEW_DMT`),
    },
    {
      id: INGEST_DMT,
      text: t(`Pages_Content_Library_DMTS_INGEST_DMT`),
    },
  ];
};

export const getAddNewDMOptions = t => {
  return [
    {
      value: NEW_DM_TYPES.CREATE,
      text: t('Pages_Content_Library_ADD_NEW_DM_CREATE'),
    },
    {
      value: NEW_DM_TYPES.UPLOAD,
      text: t('Pages_Content_Library_ADD_NEW_DM_UPLOAD'),
    },
    {
      value: NEW_DM_TYPES.INGEST,
      text: t('Pages_Content_Library_ADD_NEW_DM_INGEST'),
    },
  ];
};

export const getIngestDMRenameOptions = t => {
  return [
    {
      value: INGEST_DM_RENAME.IS_SAME_NAME,
      text: t('Components_Modal_Ingest_Content_DM_Rename_Use_Same_Name'),
    },
    {
      value: INGEST_DM_RENAME.NEW_NAME,
      text: t('Components_Modal_Ingest_Content_DM_Rename_Use_Different_Name'),
    },
  ];
};

export const getDMTOptions = t => {
  return [
    {
      id: ContextMenuOptions.EDIT,
      text: t(`Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Edit`),
    },
  ];
};

export const getDMTSourceOptions = t => {
  return [
    { value: DMT_SOURCE.CORTEX, label: t('Components_AddNewWorkpaperModal_Cortex') },
    { value: DMT_SOURCE.TRIFACTA, label: t('Components_AddNewWorkpaperModal_Trifacta') },
  ];
};

export const getIconTypes = (ingestStatus, t) => {
  switch (ingestStatus?.toLowerCase()) {
    case INGEST_STATUS.SUCCESS:
      return { type: IconTypes.CIRCLE_CHECKMARK, color: 'green', status: t('Pages_Ingest_DMTs_Status_Success') };
    case INGEST_STATUS.VALIDATION_FAILED:
    case INGEST_STATUS.INGESTION_FAILED:
    case INGEST_STATUS.FAILED:
      return { type: IconTypes.WARNING, color: 'red', status: t('Pages_Ingest_DMTs_Status_Failed') };
    default:
      return { type: IconTypes.WARNING, color: 'yellow', status: t('Pages_Ingest_DMTs_Status_InProgress') };
  }
};

export const getSBContextMenuOption = t => {
  return [
    {
      id: 'Standard_Bundle_Transformation',
      text: t('Pages_Content_Library_StandardBundleList_ContextMenu_Ingest_Standard_Bundle_Transformation'),
    },
  ];
};

/**
 *
 * @param {Object[]} currentDMFields - List of Data model fields object
 * @param {Object} field - Current DM Field
 *
 */
export const prepValidAliasesList = (currentDMFields, field) => {
  const dmFieldAliases = [];
  currentDMFields.forEach(eachField => {
    if (eachField.id !== field.id) {
      dmFieldAliases.push(eachField.nameTech, ...(eachField?.aliases || []));
    }
  });

  // As the field.nameTech needs to be validated so don't push field.nameTech now.
  dmFieldAliases.push(...(field?.aliases || []));

  return dmFieldAliases;
};

/**
 *
 * @param {Array} aliasesToValidate - List of aliases to be validated
 * @param {Array} validAliases - List of non conflicting aliases
 */
export const checkDuplicateAliases = (aliasesToValidate = [], validAliases = []) => {
  const resolvedAliases = [];
  const conflictedAliasesRes = [];

  /** The below check is case-insesitive */
  const lowerCaseResolvedAliases = [];
  const lowerCaseValidAliases = [...validAliases].toString().toLowerCase().split(',');
  [...aliasesToValidate].forEach(eachValue => {
    const currentValue = eachValue.trim();
    if (currentValue) {
      const lowerCaseEachValue = currentValue.toLowerCase();
      if ([...lowerCaseValidAliases, ...lowerCaseResolvedAliases].includes(lowerCaseEachValue)) {
        conflictedAliasesRes.push(currentValue);
      } else {
        resolvedAliases.push(currentValue);
        lowerCaseResolvedAliases.push(lowerCaseEachValue);
      }
    }
  });

  return { conflictedAliasesRes, resolvedAliases };
};

/**
 *
 * @param {Object[]} allFields - List of Data model fields object
 * @param {Object} dMField - Current DM Field
 * @returns
 */

export const runFieldAliasValidation = (t, allFields, dMField, dmFieldAlisesRef, dmFieldNameRef) => {
  const currentDMField = dMField;
  let conflictedAliasesNew = [...currentDMField.conflictedAliases];
  // If aliases is null in the current DM Field(for Old Datamodels) then create an empty array
  if (!Array.isArray(currentDMField?.aliases)) currentDMField['aliases'] = [];

  // Prep the list of NON COFLICTED aliases and Filed Name i.e, dmFieldAliases for conflict lookup
  const dmFieldAliases = prepValidAliasesList(allFields, currentDMField);

  // Run validation DM Field Name V/S Filed_names & Aliases
  const { conflictedAliasesRes: isConflictingField } = checkDuplicateAliases([currentDMField.nameTech], dmFieldAliases);
  if (isConflictingField.length > 0) {
    return {
      isError: true,
      dmFieldToUpdate: {
        isNameTechConflicting: `${t(`Components_AddNewWorkpaperModal_Name_Conflict_Error`).replace(
          'DMFName',
          currentDMField.nameTech
        )}`,
      },
      scrollTo: dmFieldNameRef,
    };
  }

  // If field not conflicting add current Field Name to dmFieldAliases
  dmFieldAliases.push(currentDMField.nameTech);

  // Prep the list of aliases which needs to be validated -- First the  should be validated then the text order is important
  const toBeValidatedChipsList = [currentDMField.conflictedAliases, currentDMField.textAliases.split(',')];

  // Run validation on aliases
  conflictedAliasesNew = []; // Empty the existing conflicting Aliases array
  toBeValidatedChipsList.forEach(chipsToValidate => {
    if (chipsToValidate.length > 0) {
      const { conflictedAliasesRes, resolvedAliases } = checkDuplicateAliases(chipsToValidate, dmFieldAliases);
      currentDMField.aliases.push(...resolvedAliases);
      dmFieldAliases.push(...resolvedAliases);
      conflictedAliasesNew.push(...conflictedAliasesRes);
    }
  });

  return {
    isError: conflictedAliasesNew.length > 0,
    dmFieldToUpdate: {
      isNameTechConflicting: '',
      textAliases: '',
      aliases: currentDMField.aliases,
      conflictedAliases: conflictedAliasesNew,
    },
    scrollTo: dmFieldAlisesRef,
  };
};

export const getReleaseTypeOptions = t => {
  return [
    { value: RELEASE_TYPE_FIELD_VALUES[0], label: t('Pages_Content_Library_Release_Type_Option_Major') },
    { value: RELEASE_TYPE_FIELD_VALUES[1], label: t('Pages_Content_Library_Release_Type_Option_Minor') },
  ];
};
