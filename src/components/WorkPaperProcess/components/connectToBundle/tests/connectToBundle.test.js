import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import ConnectToBundleComponent from '../connectToBundle';
import { COMPONENT_NAME } from '../connectToBundleConstants';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { initialState as errorInitialState } from '../../../../../store/errors/reducer';
import * as ErrorStoreActions from '../../../../../store/errors/actions';
import * as connectDataSetToFlow from '../../../../../store/workpaperProcess/step1/actions';
import { mockedNodeData } from './mockData';

const defaultProps = {
  connectedBundle: [],
  callConnectBundle: false,
  onCloseInputOptions: () => {},
  disablePrimaryButton: () => {},
  setCallConnectBundle: () => {},
  selectedInputId: '0987',
  workpaperId: '1234',
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ConnectToBundleComponent {...mergedProps} />);
};

describe('Connect to bundle', () => {
  let store;
  let mockSetState;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: errorInitialState,
      wpProcess: {
        step1: ImmutableMap({
          isFetchingBundles: true,
          connectTrifactBundles: false,
          allTrifactaBundles: { ...mockedNodeData },
          allConnectBundleErrors: [],
        }),
      },
    });

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it('should render ConnectToBundle parent component', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-parent`);
    expect(component.length).toBe(1);
  });

  it.skip('should handle tab change', () => {
    const wrapper = setUp();
    const tabComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-bundlesList-tabs`);
    tabComponent.invoke('onTabClicked')('selectedBundles');
    wrapper.simulate('setActiveTab', 'selectedBundles');
    wrapper.update();
    expect(mockSetState).toHaveBeenCalledWith('selectedBundles');
  });

  it('should delete alert', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: errorInitialState,
      wpProcess: {
        step1: ImmutableMap({
          isFetchingBundles: false,
          connectTrifactBundles: false,
          allTrifactaBundles: { ...mockedNodeData },
          allConnectBundleErrors: [{ key: '123', message: 'randomError' }],
        }),
      },
    });
    const errorKey = 123;
    const mockDeleteError = jest.fn();
    jest.spyOn(ErrorStoreActions, 'deleteconnectToBundleError').mockImplementation(() => mockDeleteError);
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Alerts`);
    expect(alert.length).toBe(1);
    alert.invoke('onClose')(errorKey);
    expect(mockDeleteError).toHaveBeenCalledTimes(1);
  });

  it('should render state view for bundle list ', () => {
    const wrapper = setUp();
    const treeComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-bundle-Tree-NoRecords`);
    expect(treeComponent.length).toBe(1);
  });

  it.skip('should handle on search without text', () => {
    const wrapper = setUp();
    const searchComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Search-Bundle`);
    searchComponent.invoke('onChange')('');
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should handle on search with text not found', () => {
    const wrapper = setUp();
    const searchComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Search-Bundle`);
    searchComponent.invoke('onChange')('_');
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should dispatch connect bundle action', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: errorInitialState,
      wpProcess: {
        step1: ImmutableMap({
          isFetchingBundles: false,
          connectTrifactBundles: true,
          allTrifactaBundles: { ...mockedNodeData },
          allConnectBundleErrors: [{}],
        }),
      },
    });
    let oderOfState = 0;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (oderOfState === 0) {
        value = { ...mockedNodeData };
      }
      if (oderOfState === 8) {
        value = ['12345'];
      }
      ++oderOfState;

      return [value, mockSetState];
    });

    const connectBundle = jest.fn().mockImplementation(() => {});
    jest.spyOn(connectDataSetToFlow, 'setBundleToInput').mockImplementation(() => connectBundle);

    const wrapper = setUp({ callConnectBundle: true });
    expect(connectBundle).toHaveBeenCalledTimes(1);
    const treeComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-bundle-Tree`);

    treeComponent.invoke('onPreviewClick')(
      ...mockedNodeData['1111'].nodes['2222'].nodes['3333'].id,
      ...mockedNodeData['1111'].nodes['2222'].nodes['3333'].name,
      {
        ...mockedNodeData['1111'].nodes['2222'].nodes['3333'],
      },
      [...mockedNodeData['1111'].nodes['2222'].nodes['4444'].id],
      true
    );
    treeComponent.invoke('onItemClick')('12345');
    wrapper.update();
    expect(mockSetState).toHaveBeenCalledTimes(5);
    expect(treeComponent.length).toBe(1);
  });

  it.skip('should render state view selected bundle', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;
      if (typeof initial === 'string') {
        value = 'selectedBundles';
      }

      return [value, mockSetState];
    });

    const wrapper = setUp();
    const stateView = findByInstanceProp(wrapper, `${COMPONENT_NAME}-selectedBundles-NoRecords`);
    expect(stateView.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Connect to bundle events cases', () => {
  let store;
  let mockSetState;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: errorInitialState,
      wpProcess: {
        step1: ImmutableMap({
          isFetchingBundles: true,
          connectTrifactBundles: false,
          allTrifactaBundles: { ...mockedNodeData },
          allConnectBundleErrors: [],
        }),
      },
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it.skip('should render selected bundle', () => {
    let counter = 0;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (counter === 1) {
        value = [
          mockedNodeData['1111'].nodes['2222'].nodes['3333'].id,
          mockedNodeData['1111'].nodes['2222'].nodes['4444'].id,
        ];
      } else if (counter === 2) {
        value = ['1234'];
      } else if (counter === 3 || counter === 4) {
        value = [
          mockedNodeData['1111'].nodes['2222'].nodes['3333'],
          mockedNodeData['1111'].nodes['2222'].nodes['4444'],
        ];
      } else if (counter === 5) {
        value = 'selectedBundles';
      }
      ++counter;

      return [value, mockSetState];
    });
    const disableButton = jest.fn();
    const wrapper = setUp({ disablePrimaryButton: disableButton });
    const selectedBundlecomponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-selectedBundles-Parent`);
    expect(selectedBundlecomponent.length).toBe(1);
    const deleteButton = findByInstanceProp(wrapper, `${COMPONENT_NAME}-selectedBundles-Delete-3333`);
    deleteButton.invoke('onClick')({
      ...mockedNodeData['1111'].nodes['2222'].nodes['3333'],
    });
    expect(mockSetState).toHaveBeenCalledWith([
      { ...mockedNodeData['1111'].nodes['2222'].nodes['3333'] },
      { ...mockedNodeData['1111'].nodes['2222'].nodes['4444'] },
    ]);

    expect(disableButton).toHaveBeenCalledWith(false);

    const searchComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Search-Bundle`);
    searchComponent.invoke('onChange')('s');
    expect(mockSetState).toHaveBeenCalled();
    searchComponent.invoke('onChange')('_');
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should handle pre selected bundle list ', () => {
    const testBundleName = '00samplle';
    const testBundleId = '5bb3dcc0-9f15-4da4-9969-9a5d7cc0158e';
    setUp({
      connectedBundle: [
        {
          sourceId: '17de0a6c-1f8e-4667-9770-e0b2d6b85e8e',
          sourceName: 'Lawson',
          bundles: [
            {
              bundleId: testBundleId,
              bundleName: testBundleName,
              sourceVersionId: '019a6c3d-e19f-4e56-a410-0db9b64ea077',
              sourceVersionName: 'Oracle_IN patch ',
            },
          ],
        },
      ],
    });
    expect(mockSetState).toHaveBeenCalledWith([
      {
        bundleId: testBundleId,
        bundleName: testBundleName,
        id: testBundleId,
        name: testBundleName,
        sourceSystemId: '17de0a6c-1f8e-4667-9770-e0b2d6b85e8e',
        sourceSystemName: 'Lawson',
        sourceVersionId: '019a6c3d-e19f-4e56-a410-0db9b64ea077',
        sourceVersionName: 'Oracle_IN patch ',
      },
    ]);
  });

  it.skip('should handle previewHandler uncheck Node ', () => {
    let counter = 0;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (counter === 0) {
        value = { ...mockedNodeData };
      }
      ++counter;

      return [value, mockSetState];
    });

    const wrapper = setUp();
    const treeComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-bundle-Tree`);
    treeComponent.invoke('onPreviewClick')(
      ...mockedNodeData['1111'].nodes['2222'].nodes['3333'].id,
      ...mockedNodeData['1111'].nodes['2222'].nodes['3333'].name,
      {
        ...mockedNodeData['1111'].nodes['2222'].nodes['3333'],
      },
      [...mockedNodeData['1111'].nodes['2222'].nodes['3333'].id],
      false
    );
    treeComponent.invoke('onItemClick')();
    wrapper.update();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should handle primary button enable when selected', () => {
    const disableButton = jest.fn();

    let counter = 0;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (counter === 1) {
        value = [
          mockedNodeData['1111'].nodes['2222'].nodes['3333'].id,
          mockedNodeData['1111'].nodes['2222'].nodes['4444'].id,
        ];
      } else if (counter === 2 || counter === 3) {
        value = [
          mockedNodeData['8888'].nodes['9999'].nodes['1010'].id,
          mockedNodeData['8888'].nodes['9999'].nodes['1111'].id,
        ];
      }
      ++counter;

      return [value, mockSetState];
    });

    setUp({ disablePrimaryButton: disableButton });
    expect(disableButton).toHaveBeenCalledWith(false);
  });

  it.skip('should handle primary button disable', () => {
    const disableButton = jest.fn();

    let counter = 0;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (counter === 1 || counter === 2) {
        value = [
          mockedNodeData['8888'].nodes['9999'].nodes['1010'].id,
          mockedNodeData['8888'].nodes['9999'].nodes['1111'].id,
        ];
      } else if (counter === 3) {
        value = [
          mockedNodeData['1111'].nodes['2222'].nodes['3333'].id,
          mockedNodeData['1111'].nodes['2222'].nodes['4444'].id,
        ];
      }
      ++counter;

      return [value, mockSetState];
    });

    setUp({ disablePrimaryButton: disableButton });
    expect(disableButton).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
