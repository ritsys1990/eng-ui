import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import EditConnectionWarningModal from '../EditConnectionWarningModal';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { ComponentNames } from '../constants';

const { EDIT_CONNECTION_WARNING_MODAL: COMPONENT_NAME } = ComponentNames;

const defaultProps = {
  handleClose: () => {},
  onPrimaryButtonClick: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<EditConnectionWarningModal {...mergedProps} />);
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
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(comp.length).toBe(1);
  });

  it('should call on submit ', () => {
    const handleSubmit = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleSubmit });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
