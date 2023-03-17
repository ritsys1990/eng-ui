import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import LinkToOrgModal from '../Org/LinkToOrgModal';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const orgDetails = {
  orgId: 2424233,
  name: 'test',
};

const defaultProps = {
  handleClose: () => {},
  orgDetails,
  handleOrgChange: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<LinkToOrgModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
  let useStateFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
        isFetchingMyList: false,
      }),
      engagement: engagementInitialState,
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);

    store.clearActions();
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call on submit ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledWith(false);
  });

  it.skip('should call on org UUID', () => {
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_orgName`, 'Input');
    input.simulate('change', { target: { value: 'abc.com' } });
    expect(mockSetState).toHaveBeenLastCalledWith('abc.com');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
