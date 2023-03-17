import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import EditEngagementModal from '../EditEngagementModal';
import { initialState as EngagementInitialState } from '../../../../../../store/engagement/reducer';
import { initialState as ErrorsInitialState } from '../../../../../../store/errors/reducer';

const COMPONENT_NAME = 'Client_Setup_Edit_Engagement';

const defaultProps = {
  isOpen: true,
  updateEditShowEditModal: () => {},
  handleSubmit: () => {},
  selectedEngagement: { id: '123' },
};

const setUp = (props = {}) => {
  return shallow(<EditEngagementModal {...{ ...defaultProps, ...props }} />);
};

describe('Delete Engagement Modal Wrapper Component', () => {
  let store;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: EngagementInitialState.merge({
        isReconcileEngagementsModalOpen: true,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: ErrorsInitialState.merge({}),
    });

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
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
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it('should dispatch action on primary click', () => {
    const mockModalSubmit = jest.fn().mockImplementation(() => {});
    const wrapper = setUp();
    const engagement = {
      id: '12345',
    };
    wrapper.setProps({ engagement });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')('test');
    expect(modal.length).toBe(1);
    expect(mockModalSubmit).toHaveBeenCalledTimes(0);
  });

  it('should dispatch action on secondary click', () => {
    const mockClose = jest.fn();
    const wrapper = setUp();
    wrapper.setProps({ updateEditShowEditModal: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should handle modal close', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ updateEditShowEditModal: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onClose')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should render spinner', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Create_Modal`);
    expect(spinner.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
