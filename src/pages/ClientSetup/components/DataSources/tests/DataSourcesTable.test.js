import React, * as ReactHooks from 'react';
import DataSourcesTable from '../DataSourcesTable';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { findByInstanceProp } from 'src/utils/testUtils';
import { ComponentNames, DataSourceOptions } from '../constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';
import * as CheckAuthHooks from '../../../../../hooks/useCheckAuth';

const { TABLE: COMPONENT_NAME } = ComponentNames;

const setUp = (props = {}) => {
  return shallow(<DataSourcesTable {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const initialState = {
  client: clientInitialState,
  engagement: engagementInitialState,
  security: securityInitialState,
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
};

const permissions = { dataSources: { update: true, delete: true } };

describe('Client Setup DataSource Table', () => {
  let store;
  let headers = [];
  let mockSetState;

  beforeEach(() => {
    store = { ...initialState };
    mockSetState = jest.fn().mockImplementation(value => {
      if (Array.isArray(value) && value.length === 8) {
        headers = value;
      }
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => {});
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
  });

  it.skip('should render status row', () => {
    setUp({ dataSources: [] });
    const renderStatuses = headers?.find(x => x.key === '#subscription_status')?.render;
    const row = [{ id: '1', name: 'xxx', subscriptions: [{ id: '1', name: 'xxx', status: 'subscribed' }] }];
    const statusComp = shallow(renderStatuses(null, row));
    expect(statusComp.exists()).toBe(true);
  });

  it.skip('should render CTA', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (Array.isArray(initial)) {
        return [[{ id: 1 }], mockSetState];
      }

      return [initial, mockSetState];
    });

    setUp({ dataSources: [] });
    const renderCTA = headers?.find(x => x.key === '#cta')?.render;
    const cta = shallow(renderCTA({ id: 'xx', name: 'xx' }));
    expect(cta.exists()).toBe(true);
    const ctaButton = cta.find('Button');
    expect(ctaButton.exists()).toBe(true);
    ctaButton.simulate('click', { target: {} });
  });

  it.skip('should render Entities', () => {
    const entities = [
      { id: '1', name: 'xx1' },
      { id: '2', name: 'xx2' },
    ];
    setUp({ dataSources: [] });
    const renderEntities = headers?.find(x => x.key === 'entities')?.render;
    const entitiesComp = shallow(renderEntities(entities));
    expect(entitiesComp.exists()).toBe(true);
    expect(entitiesComp.children().length).toBe(entities.length);
  });

  it('should make row expandable if there are subscriptions', () => {
    const row = { subscriptions: [{ id: '1', name: 'xxx' }] };
    const wrapper = setUp({ dataSources: [] });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const isRowExpandable = table.prop('isRowExpandable');
    const result1 = isRowExpandable({});
    const result2 = isRowExpandable(row);
    expect(result1).toBe(false);
    expect(result2).toBe(true);
  });

  it('should render subscriptions table', () => {
    const row = { subscriptions: [{ id: 'xxx', name: 'dummy' }] };
    const wrapper = setUp({ dataSources: [] });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderSubsTable = table.prop('renderInnerTemplate');
    const result1 = renderSubsTable({});
    const subsTable = shallow(renderSubsTable(row));
    expect(result1).toBe(null);
    expect(subsTable.exists()).toBe(true);
  });

  it.skip('should open edit modal', () => {
    const wrapper = setUp({ dataSources: [] });
    const ctaMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-CtaMenu`);
    ctaMenu.invoke('onOptionClicked')({ id: DataSourceOptions.EDIT });
    expect(mockSetState).toHaveBeenNthCalledWith(2, true);
  });

  it.skip('should open delete modal', () => {
    const wrapper = setUp({ dataSources: [] });
    const ctaMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-CtaMenu`);
    ctaMenu.invoke('onOptionClicked')({ id: DataSourceOptions.DELETE });
    expect(mockSetState).toHaveBeenNthCalledWith(2, true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
