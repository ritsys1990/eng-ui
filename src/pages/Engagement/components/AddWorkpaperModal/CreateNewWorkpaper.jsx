import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkpaperTags } from '../../../../store/workpaper/actions';
import { NewWorkpaperContainer } from './CreateNewWorkpaper.styled';
import { Input, Intent, Select, SelectTypes, Spinner, Text, Textarea } from 'cortex-look-book';
import { Box } from 'reflexbox';
import PropTypes from 'prop-types';
import { newWorkpaperFormFields, WorkpaperSource } from './constants/new-workpaper';
import { WorkpaperActionTypes } from '../../../../store/workpaper/actionTypes';
import { addAddWorkpaperError } from '../../../../store/errors/actions';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { COMPONENT_NAME } from './constants/constants';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateNewWorkpaper = ({ loading, formValue, formState, handleChanges, handleFormState }) => {
  const { NAME, DESCRIPTION, TAG_IDS, URL, WORKPAPER_SOURCE } = newWorkpaperFormFields;
  const { t, exists } = useTranslation();

  const dispatch = useDispatch();
  const linkList = useSelector(workpaperSelectors.selectLinkList);
  const tags = useSelector(workpaperSelectors.selectTags);
  const tagsLoading = useSelector(workpaperSelectors.selectTagsLoading);

  useEffect(() => {
    dispatch(getWorkpaperTags(addAddWorkpaperError));

    return () => {
      dispatch({ type: WorkpaperActionTypes.GET_ADD_NEW_WORKPAPER_RESET });
    };
  }, [dispatch]);

  const getTagOptions = () => {
    return tags.map(x => {
      return {
        newTagName: exists(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG_GROUP)
          ? t(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG_GROUP)
          : x.name,
        newTagsChildren: x.tags.map(c => {
          return {
            newTagName: exists(c.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
              ? t(c.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
              : c.name,
            ...c,
          };
        }),
        ...x,
      };
    });
  };

  const tagOptions = getTagOptions();

  const isValidRequiredField = value => !!(value && value.length);

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...formValue, [key]: newValue };
    handleChanges(newFormValue);

    const { name, description, tagIds, url } = newFormValue;
    const urlItem = (url || [])[0];
    const formValues = {
      [NAME]: (name || '').trim().replace('–', '-'),
      [DESCRIPTION]: (description || '').trim(),
      [TAG_IDS]: (tagIds || []).map(({ id }) => id),
      [URL]: urlItem ? urlItem.url : '',
      [WORKPAPER_SOURCE]: WorkpaperSource.TRIFACTA,
    };

    handleFormState(
      formValues,
      !isValidRequiredField(formValues[NAME]) ||
        !isValidRequiredField(formValues[TAG_IDS]) ||
        !isValidRequiredField(formValues[URL])
    );
  };

  const showErrors = {
    [NAME]: !isValidRequiredField(formState.value[NAME]) && formState.submitted,
    [TAG_IDS]: !isValidRequiredField(formState.value[TAG_IDS]) && formState.submitted,
    [URL]: !isValidRequiredField(formState.value[URL]) && formState.submitted,
  };

  return (
    <Spinner spinning={loading}>
      <Box dataInstance={`${COMPONENT_NAME}-Parent`}>
        <NewWorkpaperContainer>
          <Text>{t('Components_AddNewWorkpaperModal_WorkpaperType')}</Text>
        </NewWorkpaperContainer>
        <NewWorkpaperContainer>
          <Input
            required
            label={t('Components_AddNewWorkpaperModal_Name')}
            value={formValue[NAME] || ''}
            hint={showErrors[NAME] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
            intent={showErrors[NAME] ? Intent.ERROR : ''}
            onChange={e => setNewValue(NAME, e.currentTarget.value)}
            placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-WorkpaperName`}
          />
        </NewWorkpaperContainer>
        <NewWorkpaperContainer>
          <Select
            required
            type={SelectTypes.MULTIPLE}
            label={t('Components_AddNewWorkpaperModal_Tags')}
            hint={showErrors[TAG_IDS] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
            intent={showErrors[TAG_IDS] ? Intent.ERROR : ''}
            options={tagOptions}
            filtering
            value={formValue[TAG_IDS] || []}
            onChange={e =>
              setNewValue(
                TAG_IDS,
                Object.keys(e).map(key => e[key])
              )
            }
            loading={tagsLoading}
            emptyMessage={t('Components_AddNewWorkpaperModal_Tags_Placeholder')}
            optionValueKey='id'
            optionTextKey='newTagName'
            childrenListKey='newTagsChildren'
            dataInstance={`${COMPONENT_NAME}-Tags`}
          />
        </NewWorkpaperContainer>
        <NewWorkpaperContainer>
          <Select
            required
            label={t('Components_AddNewWorkpaperModal_Link')}
            hint={showErrors[URL] ? t('Components_AddNewWorkpaperModal_Validation_Error') : ''}
            intent={showErrors[URL] ? Intent.ERROR : ''}
            options={linkList}
            value={formValue[URL] || []}
            onChange={e =>
              setNewValue(
                URL,
                Object.keys(e).map(key => e[key])
              )
            }
            emptyMessage={t('Components_AddNewWorkpaperModal_Link_Placeholder')}
            optionValueKey='id'
            optionTextKey='name'
            dataInstance={`${COMPONENT_NAME}-Link`}
          />
        </NewWorkpaperContainer>
        <NewWorkpaperContainer>
          <Textarea
            value={formValue[DESCRIPTION] || []}
            onChange={e => setNewValue(DESCRIPTION, e.currentTarget.value)}
            label={t('Components_AddNewWorkpaperModal_Description')}
            placeholder={t('Components_AddNewWorkpaperModal_Description_Placeholder')}
            dataInstance={COMPONENT_NAME}
          />
        </NewWorkpaperContainer>
      </Box>
    </Spinner>
  );
};

CreateNewWorkpaper.propTypes = {
  loading: PropTypes.bool.isRequired,
  formState: PropTypes.shape({}).isRequired,
  formValue: PropTypes.shape({}).isRequired,
  handleChanges: PropTypes.func.isRequired,
  handleFormState: PropTypes.func.isRequired,
};

export default CreateNewWorkpaper;
