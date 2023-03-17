import React, * as ReactHooks from 'react';
import StepTitle from './StepTitle';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../languages/fallback.json';

const defaultProps = { stepNum: 1, title: 'step test' };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<StepTitle {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Wp Step Title', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
