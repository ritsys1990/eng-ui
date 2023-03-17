import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectTypes } from 'cortex-look-book';
import { fetchAllTags } from '../../store/bundles/actions';
import { filterTagsByTagGroup } from '../../utils/tagsHelper';
import { addGlobalError } from '../../store/errors/actions';
import { bundlesSelectors } from '../../store/bundles/selectors';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';

const INDRUSTRIES_TAG_GROUP = 'INDUSTRIES';
const COMPONENT_NAME = 'Industries';

const IndustrySelect = props => {
  const { value, onChange, errorAction, dataInstance, filtering, fetchedTags, ...extraProps } = props;
  const { t, exists } = useTranslation();
  const dispatch = useDispatch();
  const isFetching = useSelector(bundlesSelectors.selectFetchingTags);

  const [translatedValue, setTranslatedValue] = useState(value);

  const industries = useSelector(state => {
    const filteredTags = filterTagsByTagGroup(state.bundles.get('tagsList'), INDRUSTRIES_TAG_GROUP);

    return filteredTags.map(x => {
      return {
        newIndustryName: exists(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
          ? t(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
          : x.name,
        ...x,
      };
    });
  });

  useEffect(() => {
    if (!fetchedTags) {
      dispatch(fetchAllTags(errorAction));
    }
  }, [dispatch]);

  useEffect(() => {
    if (value?.length) {
      setTranslatedValue(value.map(el => ({ newIndustryName: el.name, ...el })));
    } else {
      setTranslatedValue([]);
    }
  }, [value]);

  return (
    <Select
      type={SelectTypes.MULTIPLE}
      label={t('Components_IndustrySelect_Label')}
      options={industries}
      value={translatedValue}
      filtering={filtering}
      onChange={onChange}
      loading={isFetching}
      emptyMessage={t('Components_IndustrySelect_EmptyMessage')}
      optionValueKey='id'
      optionTextKey='newIndustryName'
      dataInstance={`${dataInstance}_${COMPONENT_NAME}`}
      {...extraProps}
    />
  );
};

IndustrySelect.defaultProps = {
  errorAction: addGlobalError,
  dataInstance: '',
  filtering: true,
  fetchedTags: false,
};

export default IndustrySelect;
