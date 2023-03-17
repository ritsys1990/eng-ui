import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import InputUploaderModal from '../InputUploaderModal';
import { initialState as errorInitialState } from '../../../store/errors/reducer';
import { initialState as clientInitialState } from '../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../store/security/reducer';
import { initialState as engagementInitialState } from '../../../store/engagement/reducer';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { findByInstanceProp } from '../../../utils/testUtils';
import * as WorkpaperStoreActions from '../../../store/workpaper/actions';
import * as ErrorStoreActions from '../../../store/errors/actions';

const defaultProps = {
  isOpen: true,
  handleSubmit: () => {},
  handleClose: () => {},
  handleLargeFileWarning: () => {},
  workpaperType: '',
  shouldClean: '',
  canvasType: 'TRIFACTA_CL_CANVAS',
  selectedInput: '',
  trifactaFlowId: '',
  isNewUpload: true,
};

const connect = 'connect data request';
const getStateValue = (number, string, array, mockSetState) => {
  jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
    let value = initial;

    if (typeof initial === 'number') {
      value = number;
    }
    if (typeof initial === 'string') {
      value = string;
    }
    if (!initial && typeof initial === 'object') {
      value = array;
    }
    if (!initial && typeof initial === 'boolean') {
      value = true;
    }

    return [value, mockSetState];
  });
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { workpapeid: '12345' };
  }),
}));

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<InputUploaderModal {...mergedProps} />);
};

describe('Rollforward Engagement Modal Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;
  let mockSubmit;

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
      dialogs: {
        attachFilesDialog: ImmutableMap({
          error: '',
          folderStructureMap: {},
          datamodelStructureMap: {},
          preview: {
            data: { 0: ['test1'] },
            schema: {},
          },
          isLoading: false,
          previewLoading: false,
          isAttachingFile: false,
          folderStructure: {},
          datamodelTreeData: {},
        }),
      },
    });

    mockSetState = jest.fn();
    mockSubmit = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useRef').mockImplementation(() => {
      return { current: { submit: mockSubmit } };
    });
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(9);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(7);
  });

  it('should render alert', () => {
    const mockDeleteInputFilerError = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(ErrorStoreActions, 'deleteInputFileError').mockImplementation(() => mockDeleteInputFilerError);
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Alert`);
    expect(alert.length).toBe(1);
    alert.invoke('onClose')();
    expect(mockDeleteInputFilerError).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering case 0', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);

    getStateValue(
      0,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockCreateDataRequest).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering case 0 event', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);
    const sourceSystemBundles = [
      {
        sourceSystemBundle: {
          dataSourceId: 0,
        },
      },
    ];

    getStateValue(
      0,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    const uploader = findByInstanceProp(modal, `${COMPONENT_NAME}_Input_Uploader`);
    expect(uploader.length).toBe(1);
    uploader.invoke('onChangeBundleSourceSystem')();
    uploader.invoke('onChangeBundleDataSource')(sourceSystemBundles);
    uploader.invoke('dataTableNameAssign')();
    expect(mockSetState).toHaveBeenCalledTimes(6);
  });

  it.skip('should call useState when rendering case 1', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);

    getStateValue(
      1,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering case 1 event', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);

    getStateValue(
      1,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    const uploader = findByInstanceProp(modal, `${COMPONENT_NAME}_New_File_Uploader`);
    expect(uploader.length).toBe(1);
    uploader.invoke('onFolderChange')();
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useState when rendering case 2', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);

    getStateValue(
      3,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering case 2 event', () => {
    const mockFileWarning = jest.fn();

    getStateValue(
      3,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp({ handleLargeFileWarning: mockFileWarning });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    const uploader = findByInstanceProp(modal, `${COMPONENT_NAME}_Zip_File_Uploader`);
    expect(uploader.length).toBe(1);
    uploader.invoke('handleLargeFileWarning')();
    expect(mockFileWarning).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering case 3', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);

    getStateValue(
      2,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering case 3 event', () => {
    const mockCreateDataRequest = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(WorkpaperStoreActions, 'createDataRequest').mockImplementation(() => mockCreateDataRequest);

    getStateValue(
      2,
      connect,
      [
        {
          id: 1,
          value: connect,
        },
      ],
      mockSetState
    );

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    const uploader = findByInstanceProp(modal, `${COMPONENT_NAME}_Existing_Uploader`);
    expect(uploader.length).toBe(1);
    uploader.invoke('onBack')();
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
