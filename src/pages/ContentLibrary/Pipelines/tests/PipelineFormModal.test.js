import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import * as PipelineStoreActions from '../../../../store/contentLibrary/pipelines/actions';
import { findByInstanceProp } from '../../../../utils/testUtils';
import PipelineFormModal, { COMPONENT_NAME } from '../components/PipelineFormModal/PipelineFormModal';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { initialState as CLPipelinesInitialState } from '../../../../store/contentLibrary/pipelines/reducer';
import { PIPELINE_TYPE, PIPELINE_DETAILS, PIPELINE_INITIAL_STATE, PIPELINE_FORM_STATE } from '../constants/constants';

const defaultProps = { isOpen: false, isEditModal: false, onClose: jest.fn() };

const VALID_FORM = {
  [PIPELINE_DETAILS.ID]: '1',
  [PIPELINE_DETAILS.NAME]: 'Test1',
  [PIPELINE_DETAILS.DESCRIPTION]: 'Test 1 description',
  [PIPELINE_DETAILS.SOURCE]: PIPELINE_TYPE.CORTEX,
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

  return shallow(<PipelineFormModal {...mergedProps} />);
};

describe('PipelineFormModal: Initial render', () => {
  let store;
  let useDispatchFn;
  let useStateFn;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    mockSetState = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render add view', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
  });

  it('should render edit view', () => {
    const wrapper = setUp({ isEditModal: true });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-UpdateCLPipeline`);
    expect(component.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useSate when rendering', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(4);
  });

  it('should call useDispatch when rendering', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should clean input when closing if it is add modal', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(mockSetState).toHaveBeenNthCalledWith(1, PIPELINE_INITIAL_STATE);
    expect(mockSetState).toHaveBeenNthCalledWith(2, PIPELINE_FORM_STATE);
  });

  it.skip('should not clean input when closing if it is edit modal', () => {
    const wrapper = setUp({ isEditModal: true });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-UpdateCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  it('should not render source option if it is edit modal', () => {
    const wrapper = setUp({ isEditModal: true });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SourceOption`);
    expect(component.length).toBe(0);
  });

  it('should render source option if it is add modal', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SourceOption`);
    expect(component.length).toBe(1);
  });

  it.skip('should set state if a name input changes', () => {
    const wrapper = setUp();
    const nameInput = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldName`);
    nameInput.invoke('onChange')({ currentTarget: { value: VALID_FORM[PIPELINE_DETAILS.NAME] } });
    expect(mockSetState).toHaveBeenCalledTimes(3);
    expect(mockSetState).toHaveBeenNthCalledWith(1, true);
    expect(mockSetState).toHaveBeenNthCalledWith(2, {
      ...PIPELINE_INITIAL_STATE,
      [PIPELINE_DETAILS.NAME]: VALID_FORM[PIPELINE_DETAILS.NAME],
    });
    expect(mockSetState).toHaveBeenNthCalledWith(3, {
      ...PIPELINE_FORM_STATE,
      invalid: false,
      value: {
        ...PIPELINE_INITIAL_STATE,
        [PIPELINE_DETAILS.NAME]: VALID_FORM[PIPELINE_DETAILS.NAME],
      },
    });
  });

  it.skip('should set state if a description input changes', () => {
    const wrapper = setUp();
    const nameInput = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldDescription`);
    nameInput.invoke('onChange')({ currentTarget: { value: VALID_FORM[PIPELINE_DETAILS.DESCRIPTION] } });
    expect(mockSetState).toHaveBeenCalledTimes(3);
    expect(mockSetState).toHaveBeenNthCalledWith(1, true);
    expect(mockSetState).toHaveBeenNthCalledWith(2, {
      ...PIPELINE_INITIAL_STATE,
      [PIPELINE_DETAILS.DESCRIPTION]: VALID_FORM[PIPELINE_DETAILS.DESCRIPTION],
    });
    expect(mockSetState).toHaveBeenNthCalledWith(3, {
      ...PIPELINE_FORM_STATE,
      invalid: true,
      value: {
        ...PIPELINE_INITIAL_STATE,
        [PIPELINE_DETAILS.DESCRIPTION]: VALID_FORM[PIPELINE_DETAILS.DESCRIPTION],
      },
    });
  });

  it.skip('should set state if a source input changes', () => {
    const wrapper = setUp();
    const nameInput = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldSource`);
    nameInput.invoke('onOptionChange')(VALID_FORM[PIPELINE_DETAILS.SOURCE]);
    expect(mockSetState).toHaveBeenCalledTimes(3);
    expect(mockSetState).toHaveBeenNthCalledWith(1, true);
    expect(mockSetState).toHaveBeenNthCalledWith(2, {
      ...PIPELINE_INITIAL_STATE,
      [PIPELINE_DETAILS.SOURCE]: VALID_FORM[PIPELINE_DETAILS.SOURCE],
    });
    expect(mockSetState).toHaveBeenNthCalledWith(3, {
      ...PIPELINE_FORM_STATE,
      invalid: true,
      value: {
        ...PIPELINE_INITIAL_STATE,
        [PIPELINE_DETAILS.SOURCE]: VALID_FORM[PIPELINE_DETAILS.SOURCE],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('PipelineFormModal: dispatch actions', () => {
  let store;
  let mockDispatch;
  let mockSetState;
  let mockAddCLPipeline;
  let updateCLPipeline;

  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockAddCLPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'addCLPipeline').mockImplementation(() => mockAddCLPipeline);
    updateCLPipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'updateCLPipeline').mockImplementation(() => updateCLPipeline);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should not dispatch add action if form is empty', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockAddCLPipeline).toHaveBeenCalledTimes(0);
  });

  it.skip('should dispatch add action if form is valid', () => {
    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [VALID_FORM_STATE, mockSetState]);

    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockAddCLPipeline).toHaveBeenCalledTimes(1);
  });

  it.skip('should dispatch update action if form is valid', () => {
    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [VALID_FORM_STATE, mockSetState]);

    const wrapper = setUp({ isEditModal: true });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-UpdateCLPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(updateCLPipeline).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
