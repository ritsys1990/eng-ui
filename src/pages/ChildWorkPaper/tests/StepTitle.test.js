import React from 'react';
import StepTitle from '../components/StepTitle';
import { shallow } from 'enzyme';

const defaultProps = {
  stepNum: '123',
  title: 'test',
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<StepTitle {...mergedProps} />);
};

describe('Step Title', () => {
  it('Should render step title', () => {
    const wrapper = setUp();
    expect(wrapper.length).toEqual(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
