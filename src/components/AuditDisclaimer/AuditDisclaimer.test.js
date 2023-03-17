import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../utils/testUtils';
import AuditDisclaimer, { COMPONENT_NAME } from './AuditDisclaimer';

const setUp = (props = {}) => {
  return shallow(<AuditDisclaimer {...props} />);
};

describe('Audit Disclaimer Component', () => {
  let useEffectFn;

  beforeEach(() => {
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => Promise.resolve(true));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render component', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });

  it.skip('should call useEffect', () => {
    setUp();

    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
