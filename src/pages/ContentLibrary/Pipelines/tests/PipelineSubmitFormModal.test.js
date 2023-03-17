import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import * as PipelineStoreActions from '../../../../store/contentLibrary/pipelines/actions';
import { findByInstanceProp } from '../../../../utils/testUtils';
import PipelineSubmitFormModal, { COMPONENT_NAME } from '../components/PipelineSubmitFormModal/PipelineSubmitFormModal';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { initialState as CLPipelinesInitialState } from '../../../../store/contentLibrary/pipelines/reducer';
import { PIPELINE_DETAILS_REVIEW } from '../constants/constants';

const defaultProps = { isOpen: false, onClose: jest.fn() };

const VALID_FORM = {
  [PIPELINE_DETAILS_REVIEW.ID]: '',
  [PIPELINE_DETAILS_REVIEW.ENGAGEMENT_ID]: '0000-engagement',
  [PIPELINE_DETAILS_REVIEW.NAME]: '',
  [PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT]: '',
  [PIPELINE_DETAILS_REVIEW.CLIENTS]: [],
};

const VALID_FORM_STATE = {
  invalid: false,
  submitted: false,
  value: {
    ...VALID_FORM,
  },
};

const mockCommentText = 'This is a comment test';

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<PipelineSubmitFormModal {...mergedProps} />);
};

const setupMockDispatch = (store, action) => {
  store.dispatch(action);

  return Promise.resolve(true);
};

describe('PipelineFormModal: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let mockSubmitPipeline;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      return setupMockDispatch(store, action);
    });
    mockSubmitPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'submitPipeline').mockImplementation(() => mockSubmitPipeline);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SubmitCLPipeline`);
    expect(component.length).toBe(1);
  });

  it.skip('should set new FieldName value', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldName`);
    expect(component.length).toBe(1);

    component.invoke('onChange')({ currentTarget: { value: 'Test 1' } });
    expect(mockSetState).toHaveBeenNthCalledWith(1, { ...VALID_FORM, [PIPELINE_DETAILS_REVIEW.NAME]: 'Test 1' });
    expect(mockSetState).toHaveBeenNthCalledWith(2, {
      invalid: false,
      submitted: false,
      value: { ...VALID_FORM, [PIPELINE_DETAILS_REVIEW.NAME]: 'Test 1' },
    });
  });

  it.skip('should set new FieldAdditionalComment value', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldAdditionalComment`);
    expect(component.length).toBe(1);

    component.invoke('onChange')({ currentTarget: { value: mockCommentText } });
    expect(mockSetState).toHaveBeenNthCalledWith(1, {
      ...VALID_FORM,
      [PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT]: mockCommentText,
    });
    expect(mockSetState).toHaveBeenNthCalledWith(2, {
      invalid: true,
      submitted: false,
      value: {
        ...VALID_FORM,
        [PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT]: mockCommentText,
      },
    });
  });

  it.skip('should not submit without a reason', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SubmitCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockSubmitPipeline).toHaveBeenCalledTimes(0);
    expect(mockSetState).toHaveBeenNthCalledWith(1, { Name: true });
  });

  it('should close', () => {
    const onClose = jest.fn();
    const wrapper = setUp({ onClose });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SubmitCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('PipelineFormModal: Valid state', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let mockSubmitPipeline;
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      return setupMockDispatch(store, action);
    });
    mockSubmitPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'submitPipeline').mockImplementation(() => mockSubmitPipeline);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest
      .spyOn(ReactHooks, 'useState')
      .mockImplementationOnce(() => [{ ...VALID_FORM, [PIPELINE_DETAILS_REVIEW.NAME]: 'Test 1' }, mockSetState]);
    jest
      .spyOn(ReactHooks, 'useState')
      .mockImplementationOnce(() => [
        { ...VALID_FORM_STATE, value: { ...VALID_FORM, [PIPELINE_DETAILS_REVIEW.NAME]: 'Test 1' } },
        mockSetState,
      ]);
    jest.spyOn(ReactHooks, 'useState').mockImplementationOnce(() => [true, mockSetState]);
    jest.spyOn(ReactHooks, 'useState').mockImplementationOnce(() => [['1'], mockSetState]);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementationOnce(f => f());
  });
  it('should render', () => {
    const wrapper = setUp({ formValueProp: { clients: [] } });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SubmitCLPipeline`);
    expect(component.length).toBe(1);
  });

  it.skip('should submit', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SubmitCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockSubmitPipeline).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenNthCalledWith(1, { Name: false });
  });

  it.skip('should render clients', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-clients`);
    expect(component.length).toBe(1);
  });

  it.skip('should switch toggle', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Toggle');
    expect(component.length).toBe(1);
    component.invoke('onChange')();
    expect(mockSetState).toHaveBeenNthCalledWith(1, []);
    expect(mockSetState).toHaveBeenNthCalledWith(2, false);
  });

  it.skip('should remove checked client', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-clients`);
    expect(component.length).toBe(1);
    component.invoke('onClientSelect')('1', true);
    expect(mockSetState).toHaveBeenNthCalledWith(1, []);
  });

  it.skip('should remove checked client', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-clients`);
    expect(component.length).toBe(1);
    component.invoke('onClientSelect')('2', false);
    expect(mockSetState).toHaveBeenNthCalledWith(1, ['1', '2']);
  });
});
