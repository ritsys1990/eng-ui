import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { COMPONENT_NAME } from '../constants/constants';
import ReconcileSelect from '../ReconcileSelect';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';

const setUp = (props = {}) => {
  return shallow(<ReconcileSelect {...props} />);
};

describe('Reconcile Select Component', () => {
  let store;
  let useEffectFn;
  let useStateFn;
  let useSelectorFn;
  let onFieldChangeFn;
  let mockSetState;
  const field = 'TestField';

  const selectedOptions = [
    {
      value: 1,
      text: 'Option 1',
    },
  ];

  const uniqueOptions = [
    {
      value: 1,
      text: 'Option 1',
    },
    {
      value: 2,
      text: 'Option 2',
    },
  ];

  const repeatableOptions = [
    {
      value: 3,
      text: 'Option 3',
    },
    {
      value: 4,
      text: 'Option 4',
    },
  ];

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    onFieldChangeFn = jest.fn().mockImplementation(() => {});
  });

  it('should render', () => {
    const wrapper = setUp({
      field,
      value: 1,
      selectedOptions,
      uniqueOptions,
      repeatableOptions,
      onFieldChange: onFieldChangeFn,
    });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${field}`, 'Select');
    expect(select.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp({
      field,
      value: 1,
      selectedOptions,
      uniqueOptions,
      repeatableOptions,
      onFieldChange: onFieldChangeFn,
    });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${field}`, 'Select');
    expect(select.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp({
      field,
      value: 1,
      selectedOptions,
      uniqueOptions,
      repeatableOptions,
      onFieldChange: onFieldChangeFn,
    });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${field}`, 'Select');
    expect(select.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp({
      field,
      value: 1,
      selectedOptions,
      uniqueOptions,
      repeatableOptions,
      onFieldChange: onFieldChangeFn,
    });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${field}`, 'Select');
    expect(select.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(2);
  });

  it('should invoke onFieldChange prop when select is triggered with onChange', () => {
    const wrapper = setUp({
      field,
      value: 1,
      selectedOptions,
      uniqueOptions,
      repeatableOptions,
      onFieldChange: onFieldChangeFn,
    });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${field}`, 'Select');
    expect(select.length).toBe(1);

    wrapper.invoke('onChange')([repeatableOptions[0]]);
    expect(onFieldChangeFn).toHaveBeenCalledTimes(1);
    expect(onFieldChangeFn).toHaveBeenCalledWith(field, repeatableOptions[0].value);
  });

  it('should render Text when customRenderSelected is triggered', () => {
    const wrapper = setUp({
      field,
      value: 1,
      selectedOptions,
      uniqueOptions,
      repeatableOptions,
      onFieldChange: onFieldChangeFn,
    });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${field}`, 'Select');
    expect(select.length).toBe(1);

    const textToRender = wrapper.invoke('customRenderSelected')(repeatableOptions[0]);
    const textWrapper = shallow(textToRender);
    expect(textWrapper.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
