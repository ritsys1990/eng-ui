import React, * as ReactHooks from 'react';
import OutputsRow from '../OutputsRow';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../languages/fallback.json';

const defaultProps = { outputs: [], workpaperId: '1234-5678-9123-4567', engagementId: '9123-5678-1234-4567' };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<OutputsRow {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Wp Outputs Row', () => {
  let store;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    setUp();
    expect(useSelectorFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
