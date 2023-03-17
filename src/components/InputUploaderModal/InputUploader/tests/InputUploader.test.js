import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { InputUploader } from '../InputUploader';
import { initialState as errorInitialState } from '../../../../store/errors/reducer';
import { initialState as clientInitialState } from '../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../store/security/reducer';
import { initialState as engagementInitialState } from '../../../../store/engagement/reducer';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants';
import routerData from 'react-router';
import { findByInstanceProp } from '../../../../utils/testUtils';
import { INPUT_UPLOADER_TYPES } from '../../constants/constants';

const getStateValue = (number, string, array, mockSetState) => {
  jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
    let value = initial;

    if (typeof initial === 'number') {
      value = number;
    }
    if (typeof initial === 'string') {
      value = string;
    }
    if (Array.isArray(initial)) {
      value = array;
    }
    if (!initial && typeof initial === 'boolean') {
      value = true;
    }

    return [value, mockSetState];
  });
};
const input = {
  id: '12234',
  name: 'test',
  dataSourceSubsribed: [
    {
      bundleId: '1234',
      bundleName: 'PI5 test Test',
      subscribedDataSources: [
        {
          id: '12334',
          name: 'test',
          sourceId: '3453453',
          type: 'ClientSource',
          bundleId: '345345656',
        },
      ],
    },
  ],
  linkedBundles: [
    {
      sourceId: '345343644',
      sourceName: 'test',
      bundles: [
        {
          bundleId: '2352353453',
          bundleName: 'DR Test',
          bundleBaseId: '345346775',
          sourceVersionId: '3453454',
          sourceVersionName: 'test patch ',
        },
      ],
    },
  ],
};

const connect = 'connect data request';
const defaultProps = {
  onChangeBundleDataSource: () => {},
  onChangeBundleSourceSystem: () => {},
  value: '',
  shouldClean: '',
  canvasType: 'TRIFACTA_CL_CANVAS',
  selectedInput: input,
  selectedDataSources: [],
  setSelectedDataSources: () => {},
  dataTableNameAssign: () => {},
  isNewUpload: '',
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<InputUploader {...mergedProps} />);
};

describe('New File Uploader Component', () => {
  let store;
  let mockSetState;
  let useStateFn;
  let useEffectFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpProcess: {
        step1: ImmutableMap({ isAttachingFile: false }),
        step2: ImmutableMap({ isLoading: false }),
      },
      dataWrangler: ImmutableMap({ isDatasetUpdating: false }),
      bundles: ImmutableMap({ selectIsFetchingDatamodelsListForWB: false }),
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      security: securityInitialState,
      engagement: engagementInitialState,
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = null;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(routerData, 'useParams').mockReturnValue({ workpaperId: 123, outputId: 123 });
  });

  it('should render model', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Model`);
    expect(modal.length).toBe(1);
  });

  it('should render model with not new upload', () => {
    const wrapper = setUp({ shouldClean: false, isNewUpload: false });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Model`);
    expect(modal.length).toBe(1);
  });

  it.skip('should render useState', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Model`);
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(18);
  });

  it.skip('should render useEffect', () => {
    const wrapper = setUp();
    const dataTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataTable`);
    expect(dataTable.length).toBe(0);
    expect(useEffectFn).toHaveBeenCalledTimes(8);
  });

  it.skip('should render data table input', () => {
    const wrapper = setUp({ isNewUpload: true });
    const dataTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataTable`);
    expect(dataTable.length).toBe(1);
    dataTable.invoke('onChange')({ target: { value: 'test' } });
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  it('should render radio group', () => {
    const wrapper = setUp({ isNewUpload: true });
    const uploader = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Uploader`);
    expect(uploader.length).toBe(1);
  });

  it('should render radio button select', () => {
    const mockSetValue = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ isNewUpload: true, onSelected: mockSetValue });
    const uploader = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Uploader`);
    expect(uploader.length).toBe(1);
    uploader.invoke('onOptionChange')(INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST);
    expect(mockSetValue).toHaveBeenLastCalledWith(INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST);
  });

  it.skip('should render source systems drop down', () => {
    const mockSetValue = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ value: INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST });
    const sourceSystems = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Source-System`);
    sourceSystems.invoke('onChange')(mockSetValue);
    expect(sourceSystems.length).toBe(1);
  });

  it('should render source systems drop down custom render', () => {
    const wrapper = setUp({ value: INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST });
    const sourceSystems = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Source-System`);
    const textToRender = sourceSystems.invoke('customRenderSelected')({ id: 1, name: 'Example Data Source 1' });
    const textWrapper = shallow(textToRender);
    expect(textWrapper.length).toBe(1);
  });

  it.skip('should render create data request tab', () => {
    getStateValue(
      0,
      connect,
      [
        {
          id: 1,
          value: 'Oracle',
        },
      ],
      mockSetState
    );

    const wrapper = setUp({ value: INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST, selectedInput: input });
    const createDR = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Create-Data-Request-tab`);
    expect(createDR.length).toBe(1);
  });

  it.skip('should handle create data request tab function', () => {
    getStateValue(
      0,
      connect,
      [
        {
          id: 1,
          value: 'Oracle1',
        },
      ],
      mockSetState
    );

    const wrapper = setUp({ value: INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST, selectedInput: input });
    const createDR = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Create-Data-Request-tab`);
    createDR.invoke('onChangeDataSource')();
    expect(mockSetState).toHaveBeenLastCalledWith([{ id: 1, value: 'Oracle1' }]);
  });
});
