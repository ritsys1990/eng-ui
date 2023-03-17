import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import SelectRollforwardEngagement from '../SelectRollforwardEngagement';
import { initialState as clientInitialState } from '../../../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../../../store/security/reducer';
import { EngagementStatus } from '../../../constants/engagment.constants';

const COMPONENT_NAME = 'SelectRollforwardEngagement';

const mockFiscalYearEnd = '2020-11-20T00:00:00Z';

const defaultProps = {
  closedEngagements: [],
  selectedOption: {},
  onOptionSelected: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<SelectRollforwardEngagement {...mergedProps} />);
};

const setupUseDispatchMock = (store, action) => {
  store.dispatch(action);

  return Promise.resolve(true);
};

describe('Select Rollforward Engagement Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;
  const mockClientId = '1234-5678-9012';
  const mockEntityId = '123';

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: mockClientId,
          entities: [
            {
              id: mockEntityId,
              name: 'Test Entity 1',
            },
          ],
        },
      }),
      engagement: engagementInitialState,
      security: securityInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
  });

  it('should render', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(4);
  });

  it('should handle filtering with text', () => {
    const mockOptionSelected = jest.fn().mockImplementation(() => {});
    const closedEngagements = [
      { id: '1', name: 'Test 1' },
      { id: '2', name: 'Test 2' },
    ];

    const wrapper = setUp({ closedEngagements, onOptionSelected: mockOptionSelected });
    const search = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Search');
    expect(search.length).toBe(1);
    search.invoke('onChange')('2');
    expect(mockOptionSelected).toHaveBeenLastCalledWith({});
  });

  it('should handle filtering without text', () => {
    const mockOptionSelected = jest.fn().mockImplementation(() => {});
    const closedEngagements = [
      { id: '1', name: 'Test 1' },
      { id: '2', name: 'Test 2' },
    ];

    const wrapper = setUp({ closedEngagements, onOptionSelected: mockOptionSelected });
    const search = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Search');
    expect(search.length).toBe(1);
    search.invoke('onChange')('');
    expect(mockOptionSelected).toHaveBeenLastCalledWith({});
  });

  it('should handle legal hold modal onOk', () => {
    const mockOptionSelected = jest.fn().mockImplementation(() => {});
    const closedEngagements = [
      { id: '1', name: 'Test 1' },
      { id: '2', name: 'Test 2' },
    ];

    const wrapper = setUp({ closedEngagements, onOptionSelected: mockOptionSelected });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'RollforwardLegalHoldModal');
    expect(modal.length).toBe(1);
    modal.invoke('onOk')();
    expect(mockOptionSelected).toHaveBeenCalled();
  });

  it.skip('should handle legal hold modal onClose', () => {
    const mockOptionSelected = jest.fn().mockImplementation(() => {});
    const closedEngagements = [
      { id: '1', name: 'Test 1' },
      { id: '2', name: 'Test 2' },
    ];

    const wrapper = setUp({ closedEngagements, onOptionSelected: mockOptionSelected });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'RollforwardLegalHoldModal');
    expect(modal.length).toBe(1);
    modal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Select Rollforward Engagement Component', () => {
  let store;
  let mockSetState;
  const mockClientId = '1234-5678-9012';
  const mockEntityId = '123';
  let headers = [];

  beforeEach(() => {
    headers = [];
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: mockClientId,
          entities: [
            {
              id: mockEntityId,
              name: 'Test Entity 1',
            },
          ],
        },
      }),
      engagement: engagementInitialState,
      security: securityInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 4) {
        headers = arg;
      }
    });

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
  });

  it.skip('should renders table headers 1', () => {
    const engagement = { id: '1', name: 'Test 1', fiscalYearEnd: mockFiscalYearEnd, entityIds: [mockEntityId] };

    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[0].render(engagement.name, engagement));
    expect(header.length).toBe(1);
  });

  it.skip('should update selected radio option', () => {
    const mockOptionSelected = jest.fn().mockImplementation(() => {});
    const engagement = { id: '1', name: 'Test 1', fiscalYearEnd: mockFiscalYearEnd, entityIds: [mockEntityId] };

    const wrapper = setUp({ onOptionSelected: mockOptionSelected });
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[0].render(engagement.name, engagement));
    expect(header.length).toBe(1);
    const radio = findByInstanceProp(header, `${COMPONENT_NAME}`, 'Radio');
    expect(radio.length).toBe(1);
    radio.invoke('onOptionSelected')();
    expect(mockOptionSelected).toHaveBeenCalledTimes(1);
  });

  it.skip('should update selected radio option', () => {
    const mockOptionSelected = jest.fn().mockImplementation(() => {});
    const engagement = {
      id: '1',
      name: 'Test 1',
      fiscalYearEnd: mockFiscalYearEnd,
      entityIds: [mockEntityId],
      legalHoldStatus: EngagementStatus.APPROVED,
    };

    const wrapper = setUp({ onOptionSelected: mockOptionSelected });
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[0].render(engagement.name, engagement));
    expect(header.length).toBe(1);
    const radio = findByInstanceProp(header, `${COMPONENT_NAME}`, 'Radio');
    expect(radio.length).toBe(1);
    radio.invoke('onOptionSelected')();
    expect(mockOptionSelected).not.toHaveBeenCalled();
  });

  it.skip('should renders table headers 2', () => {
    const engagement = { id: '1', name: 'Test 1', fiscalYearEnd: mockFiscalYearEnd, entityIds: [mockEntityId] };

    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(2);
    const header = shallow(headers[1].render(engagement.name, engagement));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 3', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(3);
  });

  it.skip('should renders table headers 4', () => {
    const engagement = { id: '1', name: 'Test 1', fiscalYearEnd: mockFiscalYearEnd, entityIds: [mockEntityId] };

    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(4);
    const header = shallow(headers[3].render(engagement.fiscalYearEnd));
    expect(header.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
