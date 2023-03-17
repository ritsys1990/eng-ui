import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import CreateNewEngModal from '../CreateNewEngModal';

const COMPONENT_NAME = 'Client_Setup_Add_New_EngagementModal_CreateNew';

const defaultProps = {
  mode: 'rollForward',
  selectedEngagement: {},
  setRollforwardData: () => {},
  closeModal: () => {},
  handleNextStep: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<CreateNewEngModal {...mergedProps} />);
};

describe('Rollforward Engagement Modal Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: ImmutableMap({
        isCreatingOrg: false,
      }),
      engagement: ImmutableMap({
        isDeletingConnection: false,
        clientEngagementsList: [
          {
            id: '1234567',
            clientId: '2343423',
            createTime: '2021-03-17T23:58:12.326Z',
            matId: null,
            sourceState: 'Manual',
            name: 'Test',
          },
        ],
        matClientEngagements: [
          {
            id: '1234567',
            clientId: '2343423',
            createTime: '2021-03-17T23:58:12.326Z',
            matId: null,
            sourceState: 'Manual',
            name: 'Test',
          },
        ],
      }),
      security: ImmutableMap({
        me: {
          type: 'Deloitte',
        },
      }),
    });

    mockSetState = jest.fn();

    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
  });

  it.skip('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(7);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(5);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(11);
  });

  it.skip('should call select component', () => {
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-EngagementName`);
    expect(select.length).toBe(1);
    select.invoke('onInputChange')('test');
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  it.skip('should call mat eng input component', () => {
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-MATEngId`);
    expect(input.length).toBe(1);
    input.invoke('onChange')({ target: { value: 'test' } });
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  it.skip('should call entities select component', () => {
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Entities`);
    expect(select.length).toBe(1);
    select.invoke('onChange')('test');
    expect(mockSetState).toHaveBeenCalledWith('test');
  });

  it.skip('should call release date input component', () => {
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ReleaseDate`);
    expect(input.length).toBe(1);
    input.invoke('onChange')({ currentTarget: { value: '12122021' } });
    expect(mockSetState).toHaveBeenCalledWith('12122021');
  });

  it.skip('should called Rollwforward engagment', () => {
    const wrapper = setUp();
    const rollforward = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Rollforward_Engagment`);
    expect(rollforward.length).toBe(1);
    rollforward.invoke('onOptionSelected')({ id: '1234' });
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
