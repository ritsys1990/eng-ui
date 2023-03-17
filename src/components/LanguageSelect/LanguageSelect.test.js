import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import LanguageSelect, { COMPONENT_NAME } from './LanguageSelect';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { findByInstanceProp, supportedLocales as locales } from '../../utils/testUtils';
import * as SettingsStoreActions from '../../store/settings/actions';

const setUp = (props = {}) => {
  return shallow(<LanguageSelect {...props} />);
};

const englishUSAText = 'English (United States)';

const initialState = {
  settings: ImmutableMap({
    language: { ...LANGUAGE_DATA },
    supportedLocales: locales,
    defaultSupportedLocales: [{ value: 'en-US', text: englishUSAText }],
    locale: ImmutableMap({
      value: 'en-US',
      text: `English (United States)`,
    }),
  }),
};

describe('Language Select', () => {
  let state;
  let store;
  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    configureStore([thunk])(() => state);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    global.URL.createObjectURL = jest.fn();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  it('loads the locales', () => {
    const wrapper = setUp();
    wrapper.find('Select').simulate('change', {
      target: { value: 'en-US' },
    });
  });

  it('should run onChange with value', () => {
    const mockSetLocale = jest.fn().mockImplementation(() => {});
    jest.spyOn(SettingsStoreActions, 'setLocale').mockImplementation(() => mockSetLocale);

    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, COMPONENT_NAME, 'Select');
    select.invoke('onChange')([{ value: 'en-US', text: `English (United States)` }]);
    expect(mockSetLocale).toBeCalled();
  });

  it('should run onChange without value', () => {
    const mockSetLocale = jest.fn().mockImplementation(() => {});
    jest.spyOn(SettingsStoreActions, 'setLocale').mockImplementation(() => mockSetLocale);

    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, COMPONENT_NAME, 'Select');
    select.invoke('onChange')([{ value: '', text: `` }]);
    expect(mockSetLocale).toBeCalled();
  });

  it('should run  customRenderSelected with contact option', () => {
    const test = { value: 'en-US', text: englishUSAText };
    const index = 12;

    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, COMPONENT_NAME, 'Select');
    const value = select.invoke('customRenderSelected')(test, index);
    const selected = shallow(value);
    expect(selected.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

const initialStateSupported = {
  settings: ImmutableMap({
    language: { ...LANGUAGE_DATA },
    defaultSupportedLocales: [{ value: 'en-US', text: englishUSAText }],
  }),
};

describe('Language Select without options', () => {
  let state;
  let store;
  beforeEach(() => {
    store = configureStore([thunk])(() => state);
    state = { ...initialStateSupported };
    configureStore([thunk])(() => state);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    global.URL.createObjectURL = jest.fn();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
