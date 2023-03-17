import React, * as ReactHooks from 'react';
import UploadDataModel from './UploadDataModel';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { tags } from '../../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';

const setUp = (props = {}) => {
  return shallow(<UploadDataModel {...props} />);
};

const COMPONENT_NAME = 'CL_DATAMODELS_UPLOAD';

window.scrollTo = jest.fn();

const mockData = files => {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  };
};

describe('Upload Data Modal', () => {
  const mockDispatch = jest.fn();
  jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: () => mockDispatch,
  }));

  let store;
  let useEffectFn;
  let useSelectorFn;
  let imperativeObject;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isDMUpdating: false,
      }),
      bundles: ImmutableMap({
        tagsPublishedList: tags,
        fetchingTagsPublished: false,
      }),
      errors: ImmutableMap({
        dmFieldErrors: [],
      }),
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useImperativeHandle').mockImplementation((param1, param2) => {
      imperativeObject = param2();
    });
  });

  it('should render the view', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const fileDropZone = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FileDropZone`);
    expect(fileDropZone.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalled();
  });

  it.skip('should call useEffectFn when rendering', () => {
    const wrapper = setUp();
    const fileDropZone = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FileDropZone`);
    expect(fileDropZone.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it('should have same file type', async () => {
    const wrapper = setUp();
    const fileDropZone = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FileDropZone`);
    const file = new File([JSON.stringify({ ping: true })], 'ping.json', { type: 'application/json' });
    const readFileMock = mockData([file]);
    expect(fileDropZone.accept).toBe(readFileMock.type);
  });

  it.skip('should call useEffect on error close', () => {
    const key = 123;
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Upload-Modal-AlertHub`, 'AlertHub');
    expect(alert.length).toBe(1);
    alert.invoke('onClose')(key);
    expect(useEffectFn).toHaveBeenCalled();
  });

  it('should call onChange', () => {
    const wrapper = setUp();
    const fileDropZone = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FileDropZone`);
    const file = new File([JSON.stringify({ ping: true })], 'ping.json', { type: 'application/json' });
    const readFileMock = mockData([file]);
    fileDropZone.invoke('onChange')([readFileMock]);
    expect(fileDropZone).toEqual({});
  });

  it.skip('should call useDispatch function  ', () => {
    const wrapper = setUp();
    const spyOnUseDispatch = jest.spyOn(ReactReduxHooks, 'useDispatch').mockReturnValue({ mockData });
    imperativeObject.submit(spyOnUseDispatch());
    wrapper.update();
    expect(spyOnUseDispatch).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
