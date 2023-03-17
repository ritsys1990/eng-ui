import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import * as PipelineStoreActions from '../../../../store/contentLibrary/pipelines/actions';
import { findByInstanceProp } from '../../../../utils/testUtils';
import PipelineRejectFormModal, { COMPONENT_NAME } from '../components/PipelineRejectFormModal/PipelineRejectFormModal';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { initialState as CLPipelinesInitialState } from '../../../../store/contentLibrary/pipelines/reducer';
import {
  PIPELINE_DETAILS_REJECT,
  PIPELINE_REJECT_INITIAL_STATE,
  PIPELINE_REJECT_FORM_STATE,
  PIPELINE_TYPE,
  STATUS,
} from '../constants/constants';

const mockEngagementId = '0000-engagement';
const mockRejectReason = 'Test 1 reason';

const pipeline = {
  pipelineSource: PIPELINE_TYPE.TRIFACTA,
  pipelineName: 'Pipeline name',
  workpapersInformation: [{ id: 1, name: 'workpaper name' }],
  pipelineDescription: 'Pipeline description',
  status: STATUS.EDIT,
  clients: [{ id: 1, name: 'client name' }],
  versionNumber: 1,
  modifiedDate: '2021-02-15T02:52:25.017Z',
};

const defaultProps = { isOpen: false, selectedPipeline: pipeline, onClose: jest.fn() };

const VALID_FORM = {
  [PIPELINE_DETAILS_REJECT.ID]: '1',
  [PIPELINE_DETAILS_REJECT.ENGAGEMENT_ID]: mockEngagementId,
  [PIPELINE_DETAILS_REJECT.REASON]: mockRejectReason,
};

const VALID_FORM_STATE = {
  invalid: false,
  submitted: false,
  value: {
    ...VALID_FORM,
  },
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<PipelineRejectFormModal {...mergedProps} />);
};

const setupMockDispatch = (store, action) => {
  store.dispatch(action);

  return Promise.resolve(true);
};

describe('PipelineFormModal: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let mockRejectPipeline;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      return setupMockDispatch(store, action);
    });
    mockRejectPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'rejectPipeline').mockImplementation(() => mockRejectPipeline);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RejectCLPipeline`);
    expect(component.length).toBe(1);
  });

  it.skip('should not submit without a reason', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RejectCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockRejectPipeline).toHaveBeenCalledTimes(0);
    expect(mockSetState).toHaveBeenNthCalledWith(1, { Reason: true });
  });

  it.skip('should close and clean inputs', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RejectCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(mockSetState).toHaveBeenNthCalledWith(1, PIPELINE_REJECT_INITIAL_STATE);
    expect(mockSetState).toHaveBeenNthCalledWith(2, PIPELINE_REJECT_FORM_STATE);
  });

  it.skip('should set new value', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldRejectReason`);
    expect(component.length).toBe(1);

    component.invoke('onChange')({ currentTarget: { value: VALID_FORM[PIPELINE_DETAILS_REJECT.REASON] } });
    expect(mockSetState).toHaveBeenNthCalledWith(1, {
      EngagementId: mockEngagementId,
      Id: '',
      Reason: mockRejectReason,
    });
    expect(mockSetState).toHaveBeenNthCalledWith(2, {
      invalid: false,
      submitted: false,
      value: { EngagementId: mockEngagementId, Id: '', Reason: mockRejectReason },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('PipelineFormModal: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let mockRejectPipeline;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      return setupMockDispatch(store, action);
    });
    mockRejectPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'rejectPipeline').mockImplementation(() => mockRejectPipeline);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [VALID_FORM_STATE, mockSetState]);
  });

  it.skip('should submit with a reason', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RejectCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenNthCalledWith(1, { Reason: false });
    expect(mockRejectPipeline).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
