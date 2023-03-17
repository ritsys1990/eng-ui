import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { COMPONENT_NAME } from '../constants';
import { CreateDataRequestTab } from '../CreateDataRequestTab';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';

const setUp = (props = {}) => {
  return shallow(<CreateDataRequestTab {...props} />);
};

describe('Create Data Request Tab Component', () => {
  let store;
  let onChangeDataSourceFn;

  const sourceSystemBundles = [
    { id: 1, name: 'Open Accounts Receivables', dataSourceId: 1 },
    { id: 2, name: 'Journal Entry Extended', dataSourceId: 2 },
  ];

  const dataSources = [
    { id: 1, name: 'Example Data Source 1' },
    { id: 2, name: 'Example Data Source 2' },
    { id: 3, name: 'Example Data Source 3' },
  ];

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    onChangeDataSourceFn = jest.fn().mockImplementation(() => {});
  });

  it('should render component', () => {
    const wrapper = setUp({
      sourceSystemBundles,
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });

  it('should render SourceSystemBundles if sourceSystemBundles is not an empty array', () => {
    const wrapper = setUp({
      sourceSystemBundles,
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });

    const sourceSystemBundle1 = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-SourceSystemBundle-${sourceSystemBundles[0].id}`
    );
    const sourceSystemBundle2 = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-SourceSystemBundle-${sourceSystemBundles[1].id}`
    );

    expect(sourceSystemBundle1.length).toBe(1);
    expect(sourceSystemBundle2.length).toBe(1);
  });

  it('should not render SourceSystemBundles if sourceSystemBundles is an empty array', () => {
    const wrapper = setUp({
      sourceSystemBundles: [],
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });

    const sourceSystemBundle1 = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-SourceSystemBundle-${sourceSystemBundles[0].id}`
    );
    const sourceSystemBundle2 = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-SourceSystemBundle-${sourceSystemBundles[1].id}`
    );

    expect(sourceSystemBundle1.length).toBe(0);
    expect(sourceSystemBundle2.length).toBe(0);
  });

  it('should invoke onChangeDataSource prop when a datasource is selected', () => {
    const wrapper = setUp({
      sourceSystemBundles,
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });

    const dataSourceSelector = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-DataSourceSelector-${sourceSystemBundles[0].id}`,
      'Select'
    );
    expect(dataSourceSelector.length).toBe(1);

    dataSourceSelector.invoke('onChange')(dataSources[0]);
    expect(onChangeDataSourceFn).toHaveBeenCalledTimes(1);
  });

  it('should render customer Text when a datasource is selected', () => {
    const wrapper = setUp({
      sourceSystemBundles,
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });

    const dataSourceSelector = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-DataSourceSelector-${sourceSystemBundles[0].id}`,
      'Select'
    );
    expect(dataSourceSelector.length).toBe(1);

    const textToRender = dataSourceSelector.invoke('customRenderSelected')(dataSources[0]);
    const textWrapper = shallow(textToRender);
    expect(textWrapper.length).toBe(1);
  });

  it('datasource selector value prop should be the correct dataSourceid', () => {
    const wrapper = setUp({
      sourceSystemBundles,
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });

    const dataSourceSelector = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-DataSourceSelector-${sourceSystemBundles[0].id}`,
      'Select'
    );
    expect(dataSourceSelector.length).toBe(1);

    const { value } = dataSourceSelector.props();
    expect(value[0].id).toBe(sourceSystemBundles[0].dataSourceId);
  });

  it('datasource selector options prop should be the list of dataSources', () => {
    const wrapper = setUp({
      sourceSystemBundles,
      dataSources,
      onChangeDataSource: onChangeDataSourceFn,
    });

    const dataSourceSelector = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-DataSourceSelector-${sourceSystemBundles[0].id}`,
      'Select'
    );
    expect(dataSourceSelector.length).toBe(1);

    const { options } = dataSourceSelector.props();
    expect(options).toEqual(dataSources);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
