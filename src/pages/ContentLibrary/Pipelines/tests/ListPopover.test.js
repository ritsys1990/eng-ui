import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../utils/testUtils';
import ListPopover, { COMPONENT_NAME } from '../components/ListPopover/ListPopover';

const defaultProps = {};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ListPopover {...mergedProps} />);
};

describe('ListPopover: Initial render', () => {
  let mockSetState;
  let useStateFn;

  beforeEach(() => {
    mockSetState = jest.fn();
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ListPopover`, 'ForwardRef');
    expect(component.length).toBe(1);
  });

  it.skip('should set open state to true', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ListPopover`, 'Button');
    button.invoke('onClick')();
    expect(useStateFn).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should set open state to false', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ListPopover`, 'Popover');
    button.invoke('onClose')();
    expect(useStateFn).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
