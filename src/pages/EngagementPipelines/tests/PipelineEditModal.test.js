import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../utils/testUtils';
import PipelineEditModal, { COMPONENT_NAME } from '../PipelineEditModal';
import { initialState as SecurityInitialState } from '../../../store/security/reducer';
import { initialState as ErrorInitialState } from '../../../store/errors/reducer';
import * as PipelineStoreActions from '../../../store/engagement/pipelines/actions';
import * as ErrorActions from '../../../store/errors/actions';

import LANGUAGE_DATA from '../../../languages/fallback.json';

const defaultProps = { isModalOpen: true };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<PipelineEditModal {...mergedProps} />);
};

describe('PipelineEditModal: Initial render', () => {
  let store;
  let updateFormStateMock;
  let updatePipeline;
  let mockDispatch;
  let deleteUpdatePipelineError;
  let resetUpdatePipelineError;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: ErrorInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    updateFormStateMock = jest.fn();
    updatePipeline = jest.fn();
    jest.spyOn(PipelineStoreActions, 'updatePipeline').mockImplementation(() => updatePipeline);
    deleteUpdatePipelineError = jest.fn();
    jest.spyOn(ErrorActions, 'deleteUpdatePipelineError').mockImplementation(() => deleteUpdatePipelineError);
    resetUpdatePipelineError = jest.fn();
    jest.spyOn(ErrorActions, 'resetUpdatePipelineError').mockImplementation(() => resetUpdatePipelineError);
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
  });

  it('should updateFormState', () => {
    const wrapper = setUp({ formState: { invalid: true }, updateFormState: updateFormStateMock });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(updateFormStateMock).toBeCalled();
  });

  it('should dispatch update', () => {
    const wrapper = setUp({ formState: { invalid: false }, updateFormState: updateFormStateMock });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(updatePipeline).toBeCalled();
  });

  it('should dispatch reset', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
    component.invoke('onRemoveFromDom')();
    expect(resetUpdatePipelineError).toBeCalled();
  });

  it('should dispatch deleteUpdatePipelineError', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AlertHub`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(deleteUpdatePipelineError).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
