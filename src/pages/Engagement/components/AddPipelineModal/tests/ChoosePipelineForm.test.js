import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import ChoosePipelineForm from '../ChoosePipelineForm';
import { initialState as SecurityInitialState } from '../../../../../store/security/reducer';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { initialState as EngagementPipelinesInitialState } from '../../../../../store/engagement/pipelines/reducer';

const COMPONENT_NAME = 'ChoosePipelineForm';

const rows = [
  { id: 1, name: 'Test name', workpapersInformation: [], lastModified: '05/05/2021', pipelineSource: 'TRIFACTA' },
];
const defaultProps = { rows };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ChoosePipelineForm {...mergedProps} />);
};

describe('ChoosePipelineForm: Initial render', () => {
  let store;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      engagementPipelines: EngagementPipelinesInitialState,
    });

    store.dispatch = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ChoosePipeline`);
    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
