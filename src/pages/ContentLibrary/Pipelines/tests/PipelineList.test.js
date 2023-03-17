import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../hooks/useCheckAuth';
import { Permissions, Actions } from '../../../../utils/permissionsHelper';
import { findByInstanceProp } from '../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { initialState as CLPipelinesInitialState } from '../../../../store/contentLibrary/pipelines/reducer';
import { initialState as SecurityInitialState } from '../../../../store/security/reducer';
import * as PipelineStoreActions from '../../../../store/contentLibrary/pipelines/actions';
import PipelineList, { COMPONENT_NAME } from '../components/PipelineList/PipelineList';
import { PIPELINE_TYPE, STATUS, CONTEXT_MENU_OPTIONS } from '../constants/constants';
import * as WarningModalHooks from '../../../../hooks/useWarningModal';

const mockModifiedDate = '2021-02-15T02:52:25.017Z';
const mockWorkpaperName = 'workpaper name';
const mockClientName = 'client name';

const pipeline = {
  pipelineSource: PIPELINE_TYPE.TRIFACTA,
  pipelineName: 'Pipeline name',
  workpapersInformation: [],
  pipelineDescription: 'Pipeline description',
  status: STATUS.EDIT,
  clients: [],
  versionNumber: 1,
  modifiedDate: mockModifiedDate,
};

const pipeline1 = {
  pipelineSource: PIPELINE_TYPE.TRIFACTA,
  pipelineName: 'Pipeline name',
  workpapersInformation: [{ id: 1, name: mockWorkpaperName }],
  pipelineDescription: 'Pipeline description',
  status: STATUS.EDIT,
  clients: [{ id: 1, name: mockClientName }],
  versionNumber: 1,
  modifiedDate: mockModifiedDate,
};

const pipeline2 = {
  pipelineSource: PIPELINE_TYPE.CORTEX,
  pipelineName: 'Pipeline2 name',
  workpapersInformation: [
    { id: 1, name: mockWorkpaperName },
    { id: 2, name: 'workpaper2 name' },
  ],
  pipelineDescription: 'Pipeline2 description',
  status: STATUS.PUBLISHED,
  clients: [
    { id: 1, name: mockClientName },
    { id: 2, name: 'client2 name' },
  ],
  versionNumber: 2,
  createdDate: mockModifiedDate,
};

const defaultProps = {};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<PipelineList {...mergedProps} />);
};

describe('PipelineList: Initial render', () => {
  let store;
  let mockSetState;
  let headers;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    const permissions = {
      [Permissions.CONTENT_LIBRARY_PIPELINES]: {
        [Actions.VIEW]: true,
        [Actions.UPDATE]: true,
        [Actions.DELETE]: true,
        [Actions.ADD]: true,
        [Actions.APPROVE]: true,
        [Actions.SUBMIT]: true,
      },
    };
    headers = [];
    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 10) {
        headers = arg;
      }
    });
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
  });

  it('should render no pipelines message', () => {
    const wrapper = setUp({ searchText: 'test' });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing-NoRecords`);
    expect(component.length).toBe(1);
  });

  it.skip('should renders table headers 0', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[0].render(pipeline.pipelineSource, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 1', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[1].render(pipeline.pipelineName, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 2', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[2].render(pipeline.pipelineName, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 3', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[3].render(pipeline.workpapersInformation, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 4', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[4].render(pipeline.pipelineDescription, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 5', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[5].render(pipeline.status, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 6', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[6].render(pipeline.clients, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 7', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[7].render(pipeline.versionNumber, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 8', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[8].render(pipeline.createdDate, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 8: created date', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[8].render(null, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 9', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[9].render(null, pipeline));
    expect(header.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('PipelineList: one Pipeline', () => {
  let store;
  let mockSetState;
  let headers;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState.set('CLPipelines', [
        {
          ...pipeline,
          workpapersInformation: [{ id: 1, name: mockWorkpaperName, isLatest: false, status: 'Deactivated' }],
          clients: [{ id: 1, name: mockClientName }],
        },
      ]),
    });
    const permissions = {
      [Permissions.CONTENT_LIBRARY_PIPELINES]: {
        [Actions.VIEW]: true,
        [Actions.UPDATE]: true,
        [Actions.DELETE]: true,
        [Actions.ADD]: true,
        [Actions.APPROVE]: true,
        [Actions.SUBMIT]: true,
      },
    };
    headers = [];
    // eslint-disable-next-line sonarjs/no-identical-functions
    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 10) {
        headers = arg;
      }
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));
  });

  it('should render list', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`, 'Table');
    expect(component.length).toBe(1);
  });

  it.skip('should renders table headers 2 for single pipeline', () => {
    setUp();
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(
      headers[2].render(pipeline.pipelineName, {
        ...pipeline,
        workpapersInformation: [{ id: 1, name: mockWorkpaperName, isLatest: false, status: 'Deactivated' }],
      })
    );
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 3 for single pipeline', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`, 'Container');
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[3].render(pipeline1.workpapersInformation, pipeline1));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 6 for single pipeline', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`, 'Container');
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[6].render(pipeline1.clients, pipeline1));
    expect(header.length).toBe(1);
  });

  it.skip('should close popover', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Form`, 'PipelineFormModal');
    expect(component.length).toBe(1);
    component.invoke('onClose');
    expect(mockSetState).toHaveBeenNthCalledWith(2, false);
  });

  it.skip('should handle close', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Form`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(mockSetState).toHaveBeenNthCalledWith(2, false);
    expect(mockSetState).toHaveBeenNthCalledWith(3, false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('PipelineList: more than one Pipeline', () => {
  let store;
  let mockSetState;
  let headers;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState.set('CLPipelines', [
        {
          ...pipeline,
        },
        {
          ...pipeline2,
        },
      ]),
    });
    const permissions = {
      [Permissions.CONTENT_LIBRARY_PIPELINES]: {
        [Actions.VIEW]: true,
        [Actions.UPDATE]: true,
        [Actions.DELETE]: true,
        [Actions.ADD]: true,
        [Actions.APPROVE]: true,
        [Actions.SUBMIT]: true,
      },
    };
    headers = [];
    // eslint-disable-next-line sonarjs/no-identical-functions
    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 10) {
        headers = arg;
      }
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('should render list', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`, 'Table');
    expect(component.length).toBe(1);
  });

  it.skip('should renders table headers 3 for multiple pipelines', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`, 'Container');
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[3].render(pipeline2.workpapersInformation, pipeline2));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 6 for multiple pipelines', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`, 'Container');
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[6].render(pipeline2.clients, pipeline2));
    expect(header.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('PipelineList: Draft Actions', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let mockAddCLPipeline;
  let updateCLPipeline;
  let deleteCLPipeline;
  let approveCLPipeline;
  let switchPipelineBackToDraft;
  let warningModalFn;
  let callbackFn;

  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    const permissions = {
      [Permissions.CONTENT_LIBRARY_PIPELINES]: {
        [Actions.VIEW]: true,
        [Actions.UPDATE]: true,
        [Actions.DELETE]: true,
        [Actions.ADD]: true,
        [Actions.APPROVE]: true,
        [Actions.SUBMIT]: true,
      },
    };

    mockSetState = jest.fn().mockImplementation();

    const initialStateValue = arg => {
      if (arg === null) {
        return pipeline1;
      }

      return arg;
    };
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    approveCLPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'approvePipeline').mockImplementation(() => approveCLPipeline);
    mockAddCLPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'addCLPipeline').mockImplementation(() => mockAddCLPipeline);
    updateCLPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'updateCLPipeline').mockImplementation(() => updateCLPipeline);
    deleteCLPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'deleteCLPipeline').mockImplementation(() => deleteCLPipeline);
    switchPipelineBackToDraft = jest.fn();
    jest.spyOn(PipelineStoreActions, 'switchPipelineBackToDraft').mockImplementation(() => switchPipelineBackToDraft);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initialStateValue(initial), mockSetState];
    });
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));
    warningModalFn = jest.fn().mockImplementation((text, callback) => {
      callbackFn = callback;
    });
    jest.spyOn(WarningModalHooks, 'default').mockImplementation(() => ({
      renderWarningModal: jest.fn(),
      showWarningModal: warningModalFn,
    }));
  });

  it.skip('should trigger edit modal', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.EDIT });
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should trigger delete', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.DELETE });
    callbackFn();
    expect(deleteCLPipeline).toHaveBeenCalledTimes(1);
  });

  it('should trigger back to draft', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.BACK_TO_DRAFT });
    callbackFn();
    expect(switchPipelineBackToDraft).toHaveBeenCalledTimes(1);
  });

  it.skip('should trigger submit', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.SUBMIT_REVIEW });
    callbackFn();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should trigger reject', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.REJECT });
    callbackFn();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should trigger approve', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.APPROVE });
    callbackFn();
    expect(approveCLPipeline).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
