import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ReactReduxHooks from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import { COMPONENT_NAME } from '../constants/constants';
import ChildWorkPaperHeader from '../components/ChildWorkPaperHeader';
import { findByInstanceProp } from '../../../utils/testUtils';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { Theme } from 'cortex-look-book';

const defaultProps = { wp: { name: 'test' }, theme: Theme };
const setUp = (props = { theme: Theme }) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ChildWorkPaperHeader {...mergedProps} />);
};
describe('Child work paper header', () => {
  let store;
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
  });
  jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
  it('should render static text', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ChildWorkPaperHeader`, 'ForwardRef');
    expect(component.length).toBe(1);
  });
});
