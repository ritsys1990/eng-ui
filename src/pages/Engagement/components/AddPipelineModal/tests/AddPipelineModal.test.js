import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import ReactRouterDomHooks from 'react-router';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { AlertHub } from 'cortex-look-book';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import AddPipelineModal from '../AddPipelineModal';
import { initialState as ErrorInitialState } from '../../../../../store/errors/reducer';
import { initialState as SecurityInitialState } from '../../../../../store/security/reducer';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { PAGE_NAME } from '../../../Engagement';
import * as PipelineStoreActions from '../../../../../store/engagement/pipelines/actions';
import * as errorActions from '../../../../../store/errors/actions';
import NamePipelineStep from '../NamePipelineStep';
import CreateNewPipeline from '../CreateNewPipeline';
import { initialState as engagementPipeliensInitialState } from '../../../../../store/engagement/pipelines/reducer';

const defaultProps = { handleClose: () => {}, dataInstance: PAGE_NAME, isModalOpen: true };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AddPipelineModal {...mergedProps} />);
};

describe('AddPipelineModal: Initial render', () => {
  let store;
  let mockSetState;
  let createPipeline;
  let deleteAddPipelineError;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: ErrorInitialState,
      engagementPipelines: engagementPipeliensInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactRouterDomHooks, 'useParams').mockReturnValue({
      engagementId: 1,
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    createPipeline = jest.fn();
    deleteAddPipelineError = jest.fn();
    jest.spyOn(PipelineStoreActions, 'createPipeline').mockImplementation(() => createPipeline);
    jest.spyOn(errorActions, 'deleteAddPipelineError').mockImplementation(() => deleteAddPipelineError);
  });

  it('should render step 0', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [0, mockSetState]);
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${PAGE_NAME}_AddPipeline`);
    expect(component.length).toBe(1);
  });

  it.skip('should handleAddNewPipeline', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementationOnce(() => [0, mockSetState]);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    const wrapper = setUp({ formState: { invalid: true } });
    const component = findByInstanceProp(wrapper, `${PAGE_NAME}_AddPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toBeCalledWith({
      invalid: true,
      submitted: true,
      value: { id: '', pipelineDescription: '', pipelineName: '', pipelineSource: 'Trifacta' },
    });
  });

  it.skip('should handleAddNewPipeline and close', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementationOnce(() => [0, mockSetState]);
    jest
      .spyOn(ReactHooks, 'useState')
      .mockImplementationOnce(initial => [{ ...initial, invalid: false }, mockSetState]);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${PAGE_NAME}_AddPipeline`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(createPipeline).toHaveBeenCalledTimes(1);
  });

  it('should render step 1', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [1, mockSetState]);
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${PAGE_NAME}_AddPipeline`);
    expect(component.length).toBe(1);
  });

  it('should render step 2', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [2, mockSetState]);
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${PAGE_NAME}_AddPipeline`);
    expect(component.length).toBe(1);
  });

  it('should render step default', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [-1, mockSetState]);
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${PAGE_NAME}_AddPipeline`);
    expect(component.length).toBe(1);
  });

  it('should render alert error', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [1, mockSetState]);
    const wrapper = setUp();
    const component = wrapper.find(AlertHub);
    expect(component.length).toBe(1);
  });

  it('should close alert error', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [1, mockSetState]);
    const wrapper = setUp();
    const component = wrapper.find(AlertHub);
    component.props().onClose();
    expect(deleteAddPipelineError).toHaveBeenCalledTimes(1);
  });

  it.skip('should change pipeline name in step 2', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [2, mockSetState]);
    const wrapper = setUp();
    const component = wrapper.find(NamePipelineStep);
    component.props().pipelineChange();
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it.skip('should change form state in step 0', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(() => [0, mockSetState]);
    const wrapper = setUp();
    const component = wrapper.find(CreateNewPipeline);
    component.props().handleFormState();
    component.props().handleChanges();
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
