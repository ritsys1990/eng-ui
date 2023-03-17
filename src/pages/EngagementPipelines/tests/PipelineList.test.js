import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as CheckAuthHooks from '../../../hooks/useCheckAuth';
import { findByInstanceProp } from '../../../utils/testUtils';
import PipelineList, { COMPONENT_NAME } from '../PipelineList';
import { initialState as EngagementPipelinesInitialState } from '../../../store/engagement/pipelines/reducer';
import { initialState as SecurityInitialState } from '../../../store/security/reducer';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { PIPELINE_TYPE, STATUS, CONTEXT_MENU_OPTIONS } from '../constants/constants';
import { Permissions, Actions } from '../../../utils/permissionsHelper';
import * as WarningModalHooks from '../../../hooks/useWarningModal';
import * as PipelineStoreActions from '../../../store/engagement/pipelines/actions';

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
  isAutoMode: true,
};

const pipeline1 = {
  pipelineSource: PIPELINE_TYPE.TRIFACTA,
  pipelineName: 'Pipeline1 name',
  workpapersInformation: [{ id: 1, name: mockWorkpaperName }],
  pipelineDescription: 'Pipeline1 description',
  status: STATUS.EDIT,
  clients: [{ id: 1, name: mockClientName }],
  versionNumber: 1,
  modifiedDate: mockModifiedDate,
};

const defaultProps = {};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<PipelineList {...mergedProps} />);
};

describe('EngagementPipelines: Initial render', () => {
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
      engagementPipelines: EngagementPipelinesInitialState,
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
      if (Array.isArray(arg) && arg.length === 7) {
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
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
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
    const header = shallow(headers[2].render(pipeline.workpapersInformation, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 3', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[3].render(pipeline.pipelineDescription, pipeline));
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
    const header = shallow(headers[5].render(pipeline.isAutoMode, pipeline));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 6', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PipelinesListing`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[6].render(pipeline.modifiedDate, pipeline));
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
  let updatePipeline;
  let deletePipeline;
  let warningModalFn;
  let callbackFn;
  let callbackFnNavigateToPipeline;
  let callbackFnhandleContextButton;

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
      engagementPipelines: EngagementPipelinesInitialState,
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
    updatePipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'updatePipeline').mockImplementation(() => updatePipeline);
    deletePipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'removePipeline').mockImplementation(() => deletePipeline);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initialStateValue(initial), mockSetState];
    });
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    callbackFnNavigateToPipeline = jest.fn();
    jest.spyOn(ReactHooks, 'useCallback').mockReturnValueOnce(callbackFnNavigateToPipeline);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementationOnce(callback => {
      callbackFnhandleContextButton = callback;
    });

    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));
    warningModalFn = jest.fn().mockImplementationOnce((text, callback) => {
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
    expect(mockSetState).toHaveBeenLastCalledWith({
      id: '',
      pipelineDescription: 'Pipeline1 description',
      pipelineName: 'Pipeline1 name',
      pipelineSource: 'Trifacta',
    });
  });

  it.skip('should trigger delete', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.DELETE });
    callbackFn();
    expect(deletePipeline).toHaveBeenCalledTimes(1);
  });

  it.skip('should trigger open', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: CONTEXT_MENU_OPTIONS.OPEN });
    expect(callbackFnNavigateToPipeline).toHaveBeenCalledTimes(1);
  });

  it.skip('should show contextmenu', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    callbackFnhandleContextButton({ stopPropagation: jest.fn() });
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
