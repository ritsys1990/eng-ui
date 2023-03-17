import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import CopyToClipboard from '../CopyToClipboard';
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
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<CopyToClipboard {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
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
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    store.clearActions();
  });

  it('should call copy to clipboard ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call onclick method', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onClose')();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
