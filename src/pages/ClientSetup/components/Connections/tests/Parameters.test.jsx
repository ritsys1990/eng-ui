import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import Parameters from '../Parameters';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const setUp = (props = {}) => {
  return shallow(<Parameters {...props} />);
};

window.scrollTo = jest.fn();

describe('Client Setup Connections Table', () => {
  let store;
  let mockDispatch;
  let useState;
  let useEffect;
  let effects;

  beforeEach(() => {
    effects = {};
    store = configureStore([thunk])({
      bundles: ImmutableMap({
        templatePropertiesList: {
          totalCount: 10,
          items: [
            {
              id: '1',
              label: 'Checkbox test',
              controlType: 'checkbox',
              valueType: 'Boolean',
              isRequired: true,
              defaultValue: 'False',
            },
            {
              id: '2',
              label: 'Empty mandatory',
              controlType: 'text',
              valueType: 'String',
              isRequired: true,
              defaultValue: '',
            },
            {
              id: '3',
              label: 'Empty number mandatory',
              controlType: 'text',
              valueType: 'Number',
              isRequired: true,
              defaultValue: '0',
            },
            {
              id: '4',
              label: 'Hidden number test',
              controlType: 'hidden',
              valueType: 'Number',
              isRequired: true,
              defaultValue: '0',
            },
            {
              id: '5',
              label: 'Password test',
              controlType: 'password',
              valueType: 'String',
              isRequired: true,
              defaultValue: '',
            },
            {
              id: '6',
              label: 'Select test',
              controlType: 'select',
              valueType: 'String',
              isRequired: true,
              defaultValue: '',
              valueOptions: [
                { name: 'Test1', value: 'Test1' },
                { name: 'Test2', value: 'Test2' },
                { name: 'Test3', value: 'Test3' },
              ],
            },
          ],
        },
        isFetchingTemplatePropertiesList: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation((f, deps) => {
      const id = `${f}${deps}`;
      const current = effects[id];
      if (!current || !current?.deps?.every((v, key) => deps[key] === v)) {
        const clean = f();
        effects[id] = { f, deps, clean };
      }
    });
    useState = jest
      .spyOn(ReactHooks, 'useState')
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState)
      .mockImplementationOnce(ReactHooks.useState);

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it.skip('should render', () => {
    const wrapper = setUp({
      selectedConnectorTemplate: { id: '123' },
      clientCanPopulate: true,
      showErrors: false,
      setParameters: () => {},
    });
    expect(wrapper.exists()).toBe(true);
    expect(useState).toHaveBeenCalledTimes(21);
    expect(useEffect).toHaveBeenCalledTimes(12);
  });

  it.skip('should render edit', () => {
    const wrapper = setUp({
      selectedConnectorTemplate: { id: '123' },
      clientCanPopulate: true,
      showErrors: false,
      setParameters: () => {},
      isEdit: true,
      connectorParameters: {
        1: 'False',
        2: 'Test',
        3: '0',
        4: '0',
        5: 'Test',
        6: 'Test1',
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(useState).toHaveBeenCalledTimes(21);
    expect(useEffect).toHaveBeenCalledTimes(12);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
