import React from 'react';
import CountrySelect from './CountrySelect';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp, mockL10nContent } from '../../utils/testUtils';
import { testHook } from '../../utils/testHook';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';

const COMPONENT_NAME = 'Country';
const defaultProps = {
  dataInstance: 'Select',
};
const countries = [
  {
    countryCode: 'US',
    countryName: 'United States',
  },
  {
    countryCode: 'CR',
    countryName: 'Costa Rica',
  },
];

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<CountrySelect {...mergedProps} />);
};

const setUpHook = (params = {}) => {
  let hook;
  testHook(() => {
    hook = useTranslation(params);
  });

  return hook;
};

describe('CountrySelect', () => {
  let store;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      security: ImmutableMap({
        me: {
          memberFirmCode: '',
        },
        countries,
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
    expect(useSelectorFn).toHaveBeenCalledTimes(4);
  });

  it('should display translated select options', () => {
    const output = setUp();
    const { t } = setUpHook();
    const select = findByInstanceProp(output, `${defaultProps.dataInstance}_${COMPONENT_NAME}`);
    const { newCountryName, countryCode } = select.props().options[0]; // First item in the dropdown

    expect(output.length).toBe(1);
    expect(newCountryName).toBe(t(countryCode, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_COUNTRY));
  });

  it('should display select options in english (the default value) if the key does not exists in the localization content', () => {
    const output = setUp();
    const select = findByInstanceProp(output, `${defaultProps.dataInstance}_${COMPONENT_NAME}`);
    const countryName = select.props().options[1].newCountryName; // Second item in the dropdown

    expect(output.length).toBe(1);
    expect(countryName).toBe(countries[1].countryName);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
