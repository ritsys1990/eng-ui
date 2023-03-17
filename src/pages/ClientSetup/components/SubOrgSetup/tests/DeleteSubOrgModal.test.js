import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import DeleteSubOrgModal from '../SubOrg/DeleteSubOrgModal';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';

const orgDetails = {
  orgId: 2424233,
  name: 'test',
};

const selectedRow = { id: '2344', orgUUID: '4fdf2343423', name: 'Test2', installToken: null };

const defaultProps = {
  handleClose: () => {},
  orgDetails,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteSubOrgModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
  let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should call useEffect when rendering ', () => {
    const wrapper = setUp({ selectedRow });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Delete`, 'Modal');
    expect(comp.length).toBe(1);
  });

  it('should call on submit ', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose, selectedRow });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Delete`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
