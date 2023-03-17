import React from 'react';
import { AddWorkpaperConstants, LabelConstants } from '../constants/constants';
import { isEmpty } from 'lodash';
import { Text, Intent } from 'cortex-look-book';
import { removeSpecialChar } from '../../../components/WorkPaperProcess/components/WorkpaperOutputs/output.utils';

const TRANSLATION_KEY = 'Components_AddWorkpaperModal_Step2';

export const getLabelConflictOptionsAll = (t, targetName) => {
  return [
    {
      value: AddWorkpaperConstants.REMOVE_SOURCE_LABEL,
      label: (
        <Text>
          {t(`${TRANSLATION_KEY}_LabelRemoveAll_Remove`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {targetName}
          </Text>
          .
          <Text
            forwardedAs='span'
            display='inline'
            charLimit={0}
            readMoreLabel={t(`${TRANSLATION_KEY}_SeeMore`)}
            readLessLabel={t(`${TRANSLATION_KEY}_SeeLess`)}
          >
            {t(`${TRANSLATION_KEY}_LabelRemoveAll_Select`)}{' '}
            <Text forwardedAs='strong' display='inline' fontWeight='m'>
              {targetName}
            </Text>{' '}
            {t(`${TRANSLATION_KEY}_LabelRemoveAll_Send`)}
          </Text>
        </Text>
      ),
    },
    {
      value: AddWorkpaperConstants.REMOVE_TARGET_LABEL,
      label: (
        <Text>
          {t(`${TRANSLATION_KEY}_LabelRetainAll_Retain`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {targetName}
          </Text>
          .
          <Text
            forwardedAs='span'
            display='inline'
            charLimit={0}
            readMoreLabel={t(`${TRANSLATION_KEY}_SeeMore`)}
            readLessLabel={t(`${TRANSLATION_KEY}_SeeLess`)}
          >
            {t(`${TRANSLATION_KEY}_LabelRetainAll_Select`)}
          </Text>
        </Text>
      ),
    },
    {
      value: AddWorkpaperConstants.EDIT_LABELS,
      label: (
        <Text>
          {t(`${TRANSLATION_KEY}_LabelEditAll_Edit`)}{' '}
          <Text
            forwardedAs='span'
            display='inline'
            charLimit={0}
            readMoreLabel={t(`${TRANSLATION_KEY}_SeeMore`)}
            readLessLabel={t(`${TRANSLATION_KEY}_SeeLess`)}
          >
            {t(`${TRANSLATION_KEY}_LabelEditAll_Select`)}
          </Text>
        </Text>
      ),
    },
  ];
};

export const getLabelConflictOptions = (t, targetName, label) => {
  return [
    {
      value: AddWorkpaperConstants.REMOVE_SOURCE_LABEL,
      label: (
        <Text>
          {t(`${TRANSLATION_KEY}_LabelRemove_Remove`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {label}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRemove_LabelFrom`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {label}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRemove_LabelOn`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {targetName}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRemove_Workpaper`)}
        </Text>
      ),
    },
    {
      value: AddWorkpaperConstants.REMOVE_TARGET_LABEL,
      label: (
        <Text>
          {t(`${TRANSLATION_KEY}_LabelRetain_Retain`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {label}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRetain_Remove`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {label}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRetain_LabelOn`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {targetName}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRetain_Workpaper`)}
        </Text>
      ),
    },
    {
      value: AddWorkpaperConstants.RENAME_SOURCE_LABEL,
      label: (
        <Text>
          {t(`${TRANSLATION_KEY}_LabelRename_Change`)}{' '}
          <Text forwardedAs='strong' display='inline' fontWeight='m'>
            {label}
          </Text>{' '}
          {t(`${TRANSLATION_KEY}_LabelRename_Label`)}
        </Text>
      ),
    },
  ];
};

export const checkHasConflicts = conflicts => {
  return conflicts.findIndex(conflict => !conflict.isNotConflict) !== -1;
};

export const checkConflictsResolved = conflicts => {
  return conflicts.findIndex(conflict => !conflict.isNotConflict && !conflict.isResolved) === -1;
};

export const checkInputConflict = labelConflicts => {
  const newDataSetsName = [];
  labelConflicts.forEach(labelConflict => {
    if (
      !labelConflict.isNotConflict &&
      labelConflict?.source?.newDataSetName &&
      labelConflict?.source?.newDataSetName.toUpperCase() !== LabelConstants.NOSQL &&
      labelConflict?.source?.newDataSetName.toUpperCase() !== LabelConstants.DQC
    ) {
      newDataSetsName.push(removeSpecialChar(labelConflict?.source?.newDataSetName.toUpperCase()));
    }
  });

  return newDataSetsName.some((newDataSetName, index) => newDataSetsName.indexOf(newDataSetName) !== index);
};

export const getFirstConflict = conflicts => {
  return conflicts.find(conflict => !conflict.isNotConflict);
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const inputsLabelConflict = (labelConflicts, conflict) => {
  const newDataSetsName = [];
  labelConflicts.forEach(labelConflict => {
    if (
      !labelConflict.isNotConflict &&
      labelConflict?.source?.newDataSetName &&
      conflict?.source?.outputId &&
      labelConflict.source.outputId !== conflict?.source?.outputId
    ) {
      if (
        labelConflict.source.newDataSetName.toUpperCase() !== LabelConstants.DQC &&
        labelConflict.source.newDataSetName.toUpperCase() !== LabelConstants.NOSQL
      ) {
        newDataSetsName.push(labelConflict.source.newDataSetName.toUpperCase());
      } else {
        newDataSetsName.push(removeSpecialChar(labelConflict.source.newDataSetName.toUpperCase()));
      }
    }
  });

  if (
    newDataSetsName.length > 0 &&
    conflict?.source?.newDataSetName &&
    conflict?.source?.newDataSetName.toUpperCase() !== LabelConstants.DQC &&
    conflict?.source?.newDataSetName.toUpperCase() !== LabelConstants.NOSQL
  ) {
    if (
      removeSpecialChar(conflict?.source?.newDataSetName.toUpperCase()) !== LabelConstants.DQC &&
      removeSpecialChar(conflict?.source?.newDataSetName.toUpperCase()) !== LabelConstants.NOSQL
    ) {
      return newDataSetsName.indexOf(removeSpecialChar(conflict?.source?.newDataSetName.toUpperCase())) !== -1;
    }

    return newDataSetsName.indexOf(conflict?.source?.newDataSetName.toUpperCase()) !== -1;
  }

  return false;
};

export const getLabelInputIntent = (conflict, labelConflicts) => {
  let intent = '';
  if (
    isEmpty(conflict.source.newDataSetName) ||
    conflict.source.newDataSetName === conflict.source.dataSetName ||
    inputsLabelConflict(labelConflicts, conflict)
  ) {
    intent = Intent.ERROR;
  }

  return intent;
};

export const getLabelInputHint = (conflict, t, labelConflicts) => {
  let hint = null;
  if (isEmpty(conflict.source.newDataSetName)) {
    hint = t('Components_AddWorkpaperModal_Step2_RenameRequired');
  } else if (conflict.source.newDataSetName === conflict.source.dataSetName) {
    hint = t('Components_AddWorkpaperModal_Step2_RenameRepeated');
  } else if (inputsLabelConflict(labelConflicts, conflict)) {
    hint = t('Components_AddWorkpaperModal_Step2_RenameRepeated');
  }

  return hint;
};

export const isNameEndsWithDotChar = name => {
  if (name.length > 0 && name[name.length - 1] === '.') {
    return true;
  }

  return false;
};
