import React, * as ReactHooks from 'react';
import DataSourcesTable, {
  isRowExpandable,
  renderConnectionsTable,
  renderStatus,
  renderType,
} from '../DataSourcesTable';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { DatabaseTypes, DataSourceTypes, FileTransferType, ComponentNames } from '../constants';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { initialState as clientStoreInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementStoreInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityStoreInitialState } from '../../../../../store/security/reducer';

const { DATASOURCES_TABLE: COMPONENT_NAME } = ComponentNames;

const setUp = (props = {}) => {
  return shallow(<DataSourcesTable {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

describe('Client Setup Connections DataSource Table', () => {
  let useEffectSpy;
  let useStateSpy;
  let headers;
  let mockSetState;
  let mockDispatch;
  let store;

  beforeEach(() => {
    headers = [];

    store = configureStore([thunk])({
      client: clientStoreInitialState.merge({
        client: {
          id: '123',
        },
        connectionTemplateList: { items: [{ id: '123', secureAgentType: '' }] },
      }),
      engagement: engagementStoreInitialState,
      security: securityStoreInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 5) {
        headers = arg;
      }
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    useEffectSpy = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useStateSpy = jest.spyOn(ReactHooks, 'useState').mockImplementation(init => [init, mockSetState]);
  });

  it.skip('should render', () => {
    const wrapper = setUp({ dataSources: [] });
    expect(wrapper.exists()).toBe(true);
    expect(useStateSpy).toHaveBeenCalledTimes(4);
    expect(useEffectSpy).toHaveBeenCalledTimes(2);
  });

  it('should render status row', () => {
    const row = [{ id: '1', name: 'xxx', subscriptions: [{ id: '1', name: 'xxx', status: 'subscribed' }] }];
    const statusComp = shallow(renderStatus(null, row));
    expect(statusComp.exists()).toBe(true);
  });

  it('should make row expandable if there are connections', () => {
    const row = { connections: [{ id: '1', name: 'xxx' }] };
    const result2 = isRowExpandable(row);
    expect(result2).toBe(true);
  });

  it('should render connections table', () => {
    const row = { connections: [{ id: 'xxx', name: 'dummy' }] };
    const table = shallow(renderConnectionsTable(row));
    expect(table.exists()).toBe(true);
  });

  it('should render extraction table', () => {
    const row = {
      id: '1234',
      type: DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT,
      extractionScriptSettings: {
        schemaName: 'Schema Name',
        databaseType: DatabaseTypes.ORACLE,
      },
    };
    const table = shallow(renderConnectionsTable(row));
    expect(table.exists()).toBe(true);
  });

  it('should render status formatted - extraction', () => {
    const t = key => {
      return LANGUAGE_DATA[`Engagement_${key}`];
    };

    const status = renderType(
      { type: DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT, fileTransferMode: FileTransferType.MANUAL },
      t
    );
    expect(status.length).toBeGreaterThan(0);
  });

  it('should render status formatted - source', () => {
    const t = key => {
      return LANGUAGE_DATA[`Engagement_${key}`];
    };

    const status = renderType({ type: DataSourceTypes.CLIENT_SOURCE, fileTransferMode: FileTransferType.MANUAL }, t);
    expect(status.length).toBeGreaterThan(0);
  });

  it('should render status formatted - file system', () => {
    const t = key => {
      return LANGUAGE_DATA[`Engagement_${key}`];
    };

    const status = renderType(
      { type: DataSourceTypes.CLIENT_FILE_SYSTEM, fileTransferMode: FileTransferType.MANUAL },
      t
    );
    expect(status.length).toBeGreaterThan(0);
  });

  it('should render status formatted - third party', () => {
    const t = key => {
      return LANGUAGE_DATA[`Engagement_${key}`];
    };

    const status = renderType({ type: DataSourceTypes.THIRD_PARTY, fileTransferMode: FileTransferType.MANUAL }, t);
    expect(status.length).toBeGreaterThan(0);
  });

  it('should render status formatted - default', () => {
    const t = key => {
      return LANGUAGE_DATA[`Engagement_${key}`];
    };

    const type = 'Test';

    const status = renderType({ type, fileTransferMode: FileTransferType.MANUAL }, t);
    expect(status).toBe(type);
  });

  it.skip('should render type header', () => {
    const dataSource = { id: '1', type: DataSourceTypes.CLIENT_SOURCE, fileTransferMode: FileTransferType.MANUAL };

    const wrapper = setUp({ dataSources: [] });
    expect(wrapper.exists()).toBe(true);
    expect(headers.length).toBeGreaterThanOrEqual(2);
    const typeText = headers[2].render(null, dataSource);
    expect(typeText.length).toBeGreaterThanOrEqual(1);
  });

  it.skip('should not render button header', () => {
    const dataSource = {
      id: '1',
      type: DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT,
      fileTransferMode: FileTransferType.MANUAL,
      extractionScriptSettings: {},
    };

    const wrapper = setUp({ dataSources: [] });
    expect(wrapper.exists()).toBe(true);
    expect(headers.length).toBeGreaterThanOrEqual(4);
    const button = headers[4].render(null, dataSource);
    expect(button).toBe(false);
  });

  it.skip('should render button header and call action', () => {
    const dataSource = {
      id: '1',
      type: DataSourceTypes.CLIENT_SOURCE,
      fileTransferMode: FileTransferType.MANUAL,
    };
    const onAddConnection = jest.fn();

    const wrapper = setUp({ dataSources: [], onAddConnection });
    expect(wrapper.exists()).toBe(true);
    expect(headers.length).toBeGreaterThanOrEqual(4);
    const buttonWrapper = shallow(headers[4].render(null, dataSource));
    expect(buttonWrapper.length).toBe(1);
    const button = findByInstanceProp(buttonWrapper, COMPONENT_NAME, 'AddConnectionButton');
    button.invoke('onAddConnection')();
    expect(onAddConnection).toHaveBeenCalledTimes(1);
  });

  it.skip('should render button header and call action for Extraction', () => {
    const dataSource = {
      id: '1',
      type: DataSourceTypes.CLIENT_SOURCE_EXTRACTION_SCRIPT,
      fileTransferMode: FileTransferType.MANUAL,
    };

    const wrapper = setUp({ dataSources: [] });
    expect(wrapper.exists()).toBe(true);
    expect(headers.length).toBeGreaterThanOrEqual(4);
    const buttonWrapper = shallow(headers[4].render(null, dataSource));
    expect(buttonWrapper.length).toBe(1);
    const button = findByInstanceProp(buttonWrapper, COMPONENT_NAME, 'AddConnectionButton');
    button.invoke('onAddConnection')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should handle obsolete connections', () => {
    const dataSources = [{ connections: [{ connectorId: '234' }] }];
    const wrapper = setUp({ dataSources });
    expect(wrapper.exists()).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
