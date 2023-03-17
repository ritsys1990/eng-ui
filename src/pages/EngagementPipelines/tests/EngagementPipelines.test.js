import React, * as ReactHooks from 'react';
import ReactRouterDomHooks from 'react-router';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../utils/testUtils';
import EngagementPipelines, { COMPONENT_NAME } from '../EngagementPipelines';

const defaultProps = {};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<EngagementPipelines {...mergedProps} />);
};

describe('EngagementPipelines: Initial render', () => {
  beforeEach(() => {
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactRouterDomHooks, 'useParams').mockReturnValue({
      engagementId: 1,
    });
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
