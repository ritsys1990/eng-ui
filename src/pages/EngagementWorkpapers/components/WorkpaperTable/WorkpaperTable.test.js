import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as CheckAuthHooks from '../../../../hooks/useCheckAuth';
import { findByInstanceProp } from '../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import WorkpaperTable from './WorkpaperTable';
import { initialState as errorInitialState } from '../../../../store/errors/reducer';
import { initialState as WorkpaperInitialState } from '../../../../store/workpaper/reducer';
import { initialState as clientInitialState } from '../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../store/engagement/reducer';
import { initialState as SecurityInitialState } from '../../../../store/security/reducer';
import { COMPONENT_NAME } from './constants';
import { Permissions, Actions } from '../../../../utils/permissionsHelper';
import * as WarningModalHooks from '../../../../hooks/useWarningModal';
import * as WorkpaperStoreActions from '../../../../store/workpaper/actions';

const workpaper = {
  name: 'a',
  description: 'sample description',
  tagIds: ['0f02be02-fea2-4fd0-8c3f-d5d7a43e508b'],
  versionNumber: 1,
  status: 'Draft',
  statusHistory: null,
  workpaperSource: 'Trifacta',
};

const rows = [
  {
    id: '3a0772e2-0c10-475c-b342-ac3680d5ba30',
    chainId: null,
    clientIds: null,
    isLatest: null,
    centralizedDSUpdate: false,
    name: '__09_16_2020',
    description: 'sample description',
    workpaperSource: 'Trifacta',
    url:
      'https://resources.deloitte.com/sites/US/PC/PracticeComm/functions/AERS/AERSAudit/Innovation/AuditAnalyticsLibrary/Pages/Investment_Portfolio_Analysis.aspx',
    engagementId: '08c6f59f-56eb-4565-beea-5df9d4234fba',
    templateId: 'cfe02ee6-2098-4f74-9c4f-f834ebc28b12',
    templateName: '__09_16_2020_AP_01_02_111',
    workBookId: null,
    hostWorkpaperId: null,
    configurationFileString: null,
    additionalComment: null,
    reasonOfRejection: null,
    containerId: '1',
    containerCode: 'US',
    countryCode: 'US',
    geoCode: 'AME',
    memberFirmCode: 'US',
    trifactaFlowId: 0,
    bundleTransformation: false,
    status: 'Draft',
    lastUpdated: '2021-07-30T18:55:24.739Z',
    lastUpdatedBy: 'hdeepak7@deloitte.com',
    createdBy: 'hdeepak7@deloitte.com',
    creationDate: '2021-07-30T18:55:24.739Z',
    tagIds: ['0f02be02-fea2-4fd0-8c3f-d5d7a43e508b'],
    order: null,
    versionNumber: 1,
    tableauProjectId: null,
    sourceEnv: null,
    sourceEnvVersion: 0,
    reviewStatus: null,
    statusHistory: null,
    isOutdatedAnalytic: null,
    parentWorkpaperId: null,
    source: null,
    isDMT: false,
    outputs: null,
    isWorkflowCloneStatusComplete: false,
    workflowCloneStatus: 'InProgress',
  },
];

const tags = [
  {
    tags: [
      {
        id: '1',
        name: 'Manufacturing',
      },
      {
        id: '2',
        name: 'Education',
      },
    ],
  },
];

const defaultProps = { rows, tags };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<WorkpaperTable {...mergedProps} />);
};

describe('WorkpaperTable: Initial render', () => {
  let store;
  let mockSetState;
  let headers;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      workpaper: ImmutableMap({ ...WorkpaperInitialState }),
    });
    const permissions = {
      [Permissions.CONTENT_LIBRARY_WORKPAPERS]: {
        [Actions.VIEW]: true,
        [Actions.UPDATE]: true,
        [Actions.DELETE]: true,
        [Actions.ADD]: true,
        [Actions.APPROVE]: true,
        [Actions.SUBMIT]: true,
      },
    };
    headers = [];
    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 8) {
        headers = arg;
      }
    });
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(2);
  });

  it.skip('should renders table headers 1', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperTable`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[1].render(workpaper.name, workpaper));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 2', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperTable`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[2].render(workpaper.description, workpaper));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 3', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperTable`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[3].render(workpaper.tagIds, workpaper));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 4', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperTable`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[4].render(workpaper.versionNumber, workpaper));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 5', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperTable`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[5].render(workpaper.status, workpaper));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 6', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperTable`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[6].render(workpaper.statusHistory, workpaper));
    expect(header.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('WorkpaperTable: Draft Actions', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let updateWorkpaper;
  let deleteWorkpaper;
  let warningModalFn;

  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      workpaper: ImmutableMap({ ...WorkpaperInitialState }),
    });
    const permissions = {
      [Permissions.CONTENT_LIBRARY_WORKPAPERS]: {
        [Actions.VIEW]: true,
        [Actions.UPDATE]: true,
        [Actions.DELETE]: true,
        [Actions.ADD]: true,
        [Actions.APPROVE]: true,
        [Actions.SUBMIT]: true,
      },
    };

    mockSetState = jest.fn().mockImplementation();

    const initialStateValue = arg => {
      if (arg === null) {
        return workpaper;
      }

      return arg;
    };
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    updateWorkpaper = jest.fn();
    jest.spyOn(WorkpaperStoreActions, 'updateWorkpaper').mockImplementation(() => updateWorkpaper);
    deleteWorkpaper = jest.fn();
    jest.spyOn(WorkpaperStoreActions, 'deleteWorkpaper').mockImplementation(() => deleteWorkpaper);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initialStateValue(initial), mockSetState];
    });
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactHooks, 'useContext').mockImplementation(() => ({
      space: [1, 1, 1, 1],
    }));

    jest.spyOn(WarningModalHooks, 'default').mockImplementation(() => ({
      renderWarningModal: jest.fn(),
      showWarningModal: warningModalFn,
    }));
  });

  it.skip('should trigger edit modal', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(component.length).toBe(1);
    component.invoke('onOptionClicked')({ id: 'edit' });
    expect(mockSetState).toHaveBeenCalledTimes(4);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
