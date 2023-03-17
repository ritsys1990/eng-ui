import React, * as ReactHooks from 'react';
import ConnectionsTable, {
  renderStatus,
  renderConnectionTestStatus,
  renderTime,
  renderCTA,
  renderRequirements,
  renderName,
} from '../ConnectionsTable';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import {
  ComponentNames,
  ConnectionsContextMenuOptions,
  CONNECTION_STATUS,
  DataSourceTypes,
  FileTransferType,
  ConnectionOptions,
} from '../constants';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';

const { CONNECTIONS_TABLE: COMPONENT_NAME } = ComponentNames;

const setUp = (props = {}) => {
  return shallow(<ConnectionsTable {...props} />);
};

const t = key => {
  return LANGUAGE_DATA[`Engagement_${key}`];
};

window.scrollTo = jest.fn();

const initialState = {
  client: ImmutableMap({
    client: {
      name: 'Test Client',
      id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
    },
  }),
  security: ImmutableMap({
    me: {
      type: 'Deloitte',
    },
  }),
  engagement: engagementInitialState,
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
};

describe('Client Setup Connections Table', () => {
  let state;
  let mockDispatch;
  let useStateSpy;
  let useEffectSpy;
  let mockSetState;

  beforeEach(() => {
    state = { ...initialState };
    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(state.dispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    useEffectSpy = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useStateSpy = jest.spyOn(ReactHooks, 'useState').mockImplementation(init => [init, mockSetState]);
  });

  it.skip('should render', () => {
    const wrapper = setUp({ connections: [] });
    expect(wrapper.exists()).toBe(true);
    expect(useStateSpy).toHaveBeenCalledTimes(12);
    expect(useEffectSpy).toHaveBeenCalledTimes(2);
  });

  it('should pass connections to table', () => {
    const selectedConnection = [{ id: 'xxx', name: 'conn1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xxx', name: 'conn2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const table = wrapper.find('Table');
    const rows = table.prop('rows');
    expect(rows).toMatchObject(connections);
  });

  it('should render status', () => {
    let statusComp = shallow(renderStatus(t)(CONNECTION_STATUS.CONFIGURED));
    expect(statusComp.exists()).toBe(true);
    statusComp = shallow(renderStatus(t)(CONNECTION_STATUS.NOT_CONFIGURED));
    expect(statusComp.exists()).toBe(true);
  });

  it('should render connection test status', () => {
    let statusComp = shallow(renderConnectionTestStatus(t)(true, { status: CONNECTION_STATUS.CONFIGURED }));
    expect(statusComp.exists()).toBe(true);
    statusComp = shallow(renderConnectionTestStatus(t)(false, { status: CONNECTION_STATUS.CONFIGURED }));
    expect(statusComp.exists()).toBe(true);
  });

  it('should not render connection test status if not configured', () => {
    expect(renderConnectionTestStatus(t)(false, { status: CONNECTION_STATUS.NOT_CONFIGURED })).toBe(null);
  });

  it('should render time if connection is configured', () => {
    const setIsTestModal = jest.fn();
    const setResponse = jest.fn();
    const dateComp = shallow(renderTime(setIsTestModal, setResponse)(true, { status: CONNECTION_STATUS.CONFIGURED }));
    expect(dateComp.exists()).toBe(true);
  });

  it('should not render time if connection is not configured', () => {
    const setIsTestModal = jest.fn();
    const setResponse = jest.fn();
    const dateComp = shallow(renderTime(setIsTestModal, setResponse)(false, { status: CONNECTION_STATUS.CONFIGURED }));
    expect(dateComp.exists()).toBe(true);
  });

  it('should render CTA', () => {
    const cta = shallow(renderCTA({}, null, [{}]));
    expect(cta.exists()).toBe(true);
  });

  it('should render requirements', () => {
    const requirements = shallow(renderRequirements(DataSourceTypes.CLIENT_SOURCE, FileTransferType.SECURE_AGENT, t));
    expect(requirements.exists()).toBe(true);
  });

  it('should render table connection modal', () => {
    const selectedConnection = [{ id: 'xxx', name: 'conn1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xxx', name: 'conn2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const modal = wrapper.find('TestConnectionModal');
    expect(modal.exists()).toBe(true);
  });

  it.skip('should render table connection modal', () => {
    const selectedConnection = [{ id: 'xxx', name: 'conn1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xxx', name: 'conn2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const modal = wrapper.find('TestConnectionModal');
    modal.invoke('handleClose')();
    expect(useStateSpy).toHaveBeenCalledTimes(12);
  });

  it('should render name', () => {
    let statusComp = shallow(renderName(t)('test', { isDefault: true, obsolete: false }));
    expect(statusComp.exists()).toBe(true);
    statusComp = shallow(renderName(t)('test', { isDefault: false, obsolete: true }));
    expect(statusComp.exists()).toBe(true);
  });

  it('should render cta', () => {
    const event = { target: { value: 'Value' } };
    const row = { id: '123' };
    const clickHandler = jest.fn();

    const cta = shallow(renderCTA(row, clickHandler, [{}]));
    expect(cta.exists()).toBe(true);
    const button = findByInstanceProp(cta, `${COMPONENT_NAME}-MoreOptions-${row?.id}`, 'CtaButton');
    expect(button.length).toBe(1);
    button.invoke('onClick')(event);
    expect(clickHandler).toHaveBeenLastCalledWith(event, row);
  });

  it.skip('should handle cta menu edit option', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onOptionClicked')({ option: ConnectionsContextMenuOptions.SET_TRANSFER_DEFAULT });
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle cta menu close', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle cta menu edit option', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onOptionClicked')({ id: ConnectionOptions.EDIT });
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle cta menu delete option', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'CtaMenu');
    expect(menu.length).toBe(1);
    menu.invoke('onOptionClicked')({ id: ConnectionOptions.DELETE });
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle delete modal close', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'DeleteConnectionModal');
    expect(menu.length).toBe(1);
    menu.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render test connection details modal', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const isOpen = true;
    const wrapper = setUp({ connections, selectedConnection, isOpen });
    const modal = wrapper.find('TestConnectionDetailsModal');
    expect(modal.exists()).toBe(true);
  });

  it.skip('should render test connection details modal close', () => {
    const selectedConnection = [{ id: 'xx1', secureAgentType: 'test1' }];
    const connections = [{ id: 'xx2', secureAgentType: 'test2' }];
    const wrapper = setUp({ connections, selectedConnection });
    const modal = wrapper.find('TestConnectionDetailsModal');
    modal.invoke('handleClose')();
    expect(useStateSpy).toHaveBeenCalledTimes(12);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
