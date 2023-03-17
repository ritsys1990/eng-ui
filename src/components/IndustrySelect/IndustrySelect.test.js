import React from 'react';
import IndustrySelect from './IndustrySelect';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp, mockL10nContent } from '../../utils/testUtils';
import { testHook } from '../../utils/testHook';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';

const COMPONENT_NAME = 'Industries';
const defaultProps = {
  dataInstance: 'Select',
};
const tagsList = {
  items: [
    {
      name: 'Industries',
      tags: [
        {
          id: '6c6d766e-430b-4a9a-ad45-97e53291bed3',
          name: 'Manufacturing',
        },
        {
          id: '6c6d766e-430b-4a9a-ad45-97e53291bed3',
          name: 'Education',
        },
      ],
    },
  ],
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<IndustrySelect {...mergedProps} />);
};

const setUpHook = (params = {}) => {
  let hook;
  testHook(() => {
    hook = useTranslation(params);
  });

  return hook;
};

describe('IndustrySelect', () => {
  let store;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      bundles: ImmutableMap({
        tagsList,
      }),
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);

    store.clearActions();
  });

  it('should render', () => {
    const output = setUp();

    expect(output.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const output = setUp();

    expect(output.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it('should display translated select options', () => {
    const output = setUp();
    const { t } = setUpHook();
    const select = findByInstanceProp(output, `${defaultProps.dataInstance}_${COMPONENT_NAME}`);
    const { newIndustryName, name } = select.props().options[0]; // First item in the dropdown

    expect(output.length).toBe(1);
    expect(newIndustryName).toBe(t(name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG));
  });

  it('should display select options in english (the default value) if the key does not exists in the localization content', () => {
    const output = setUp();
    const select = findByInstanceProp(output, `${defaultProps.dataInstance}_${COMPONENT_NAME}`);
    const industryName = select.props().options[1].newIndustryName; // Second item in the dropdown

    expect(output.length).toBe(1);
    expect(industryName).toBe(tagsList.items[0].tags[1].name);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
