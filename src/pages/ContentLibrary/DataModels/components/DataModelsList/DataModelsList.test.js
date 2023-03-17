import React, * as ReactHooks from 'react';
import DataModelsList from './DataModelsList';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Permissions } from '../../../../../utils/permissionsHelper';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import * as CheckAuthHooks from '../../../../../hooks/useCheckAuth';
import { datamodelsMock } from '../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import { commonDMsMock, cdmsMapMock } from '../../../../../store/contentLibrary/commonDataModels/tests/commonDMs.mock';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';

const setUp = (props = {}) => {
  return shallow(<DataModelsList {...props} />);
};

window.scrollTo = jest.fn();

const datamodels = [
  {
    id: 'e09eb8fe-fac9-4260-a8a8-e53fd73be802',
    parentId: '974c2656-d51b-48bd-b8eb-792f2783239c',
    lastUpdated: '2020-04-21T12:18:38.242Z',
    lastUpdatedBy: 'apeeta@deloitte.com',
    nameTech: 'TestDM',
    nameNonTech: 'F1',
    description: '',
    type: 'VarChar',
    isMandatory: true,
    isKey: false,
    dataFormat: null,
    tagIds: ['a5424f4d-e025-4a53-9941-a53b0a20130'],
  },
];

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: { pathname: 'datamodels' },
    push: mockNavigateFn,
  }),
}));

const PAGE_NAME = 'CL_DATAMODELS_LIST';

describe('Content Library Data Models List Page', () => {
  let store;
  let useEffect;
  let mockSetState;
  let dispatchFn;
  beforeEach(() => {
    store = configureStore([thunk])({
      security: securityInitialState,
      client: clientInitialState,
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        datamodels,
        isDataModelsFetching: true,
      }),
      bundles: ImmutableMap({
        tagsList: {
          items: [
            {
              id: 'a5424f4d-e025-4a53-9941-a53b0a20130f',
              parentId: '15ff661d-dfb7-4b3a-abe9-1dba5b675ca1',
              lastUpdated: '2019-01-17T14:21:01.988Z',
              lastUpdatedBy: 'azhashaik@deloitte.com',
              name: 'While',
              description: '',
            },
          ],
        },
      }),
      commonDatamodels: ImmutableMap({
        isFetchingCDMs: false,
        isUpdatingCDM: false,
        commonDatamodels: commonDMsMock,
        isFetchingMappedDMs: false,
        mappedDMs: [],
        cdmsMap: cdmsMapMock,
      }),
    });
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    dispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-DataModelsListing-Table-Container');
    expect(table.length).toBe(1);
  });

  it.skip('should render no records', () => {
    const wrapper = setUp();
    const stateView = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-DataModelsListing-NoRecords');
    expect(stateView.length).toBe(1);
  });

  it.skip('should render no records', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (Array.isArray(initial)) {
        return [[{ id: 1 }], mockSetState];
      }

      return [initial, mockSetState];
    });
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({
      pagePermissions: {},
      permissions: { ...Permissions },
    });
    const wrapper = setUp();
    const stateView = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-DataModelsListing-Table');
    expect(stateView.length).toBe(1);
  });

  it.skip('should call setState', () => {
    const wrapper = setUp();
    wrapper.setProps({ searchText: 'Test' });
    expect(useEffect).toHaveBeenCalledTimes(10);
  });

  it.skip('should render upload file modal and call setIsUploadModalOpen', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const uploadModal = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-Upload-File-Modal');
    expect(uploadModal.length).toBe(1);
  });

  it.skip('should render history modal and also close it', () => {
    const closeHistoryModal = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, closeHistoryModal];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const historyModal = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-Version-History-Modal');
    historyModal.invoke('onClose')();
    expect(closeHistoryModal).toHaveBeenCalled();
  });

  it.skip('should render guidance modal and also close it', () => {
    const closeGuidanceModal = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, closeGuidanceModal];
      } else if (typeof initial !== 'string' && initial?.length === 0) {
        return [[{ id: 'test' }], mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const guidanceModal = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-ADDGUIDANCE-MODAL');
    guidanceModal.invoke('onClose')();
    guidanceModal.invoke('onSecondaryButtonClick')();
    expect(closeGuidanceModal).toHaveBeenCalledTimes(3);
  });

  it.skip('should render guidance modal and save guidance', () => {
    const datamodel = datamodels[0];
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      } else if (typeof initial !== 'string' && initial?.length === 0) {
        return [[{ id: 'test' }], mockSetState];
      } else if (typeof initial === 'object') {
        return [datamodel, mockSetState];
      }

      return [initial, mockSetState];
    });
    jest.spyOn(ReactHooks, 'useRef').mockImplementation(() => {
      return { current: { state: { value: 'test' }, editor: { root: { dataset: { placeholder: 'test' } } } } };
    });
    const wrapper = setUp();
    const guidanceModal = findByInstanceProp(wrapper, 'CL_DATAMODELS_LIST-ADDGUIDANCE-MODAL');
    guidanceModal.invoke('onPrimaryButtonClick')();
    expect(dispatchFn).toHaveBeenCalled();
  });

  it.skip('should render guidance modal and change tabs', () => {
    const mockGetText = jest.fn(() => {
      return 'test';
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      } else if (typeof initial !== 'string' && initial?.length === 0) {
        return [[{ id: 'test' }], mockSetState];
      } else if (typeof initial === 'object') {
        return [datamodels[0], mockSetState];
      }

      return [initial, mockSetState];
    });
    jest.spyOn(ReactHooks, 'useRef').mockImplementation(() => {
      return {
        current: {
          state: { value: 'test' },
          editor: { root: { dataset: { placeholder: 'test' } }, getText: mockGetText },
        },
      };
    });
    const wrapper = setUp();
    const guidanceTabs = findByInstanceProp(wrapper, `${PAGE_NAME}-Editor-tabs`);
    guidanceTabs.invoke('onTabClicked')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should render the name row of DMs table of data models list and navigate to DM detail', () => {
    const rows = datamodelsMock.datamodels.items;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [rows, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `CL_DATAMODELS_LIST-DataModelsListing-Table`);
    const renderTableForName = table.prop('headers')?.find(x => x.key === 'nameTech')?.render;
    shallow(renderTableForName(null, rows[0]));
    const renderTableForExample = table.prop('headers')?.find(x => x.key === 'example')?.render;
    const exmpleCSVWrapper = shallow(renderTableForExample(null, rows[0]));
    expect(exmpleCSVWrapper.exists()).toBeTruthy();
  });

  it.skip('should render the mapped DMs table of data models list', () => {
    const row = datamodelsMock.datamodels.items[0];
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [datamodelsMock.datamodels.items, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `CL_DATAMODELS_LIST-DataModelsListing-Table`);
    expect(table.length).toBe(1);
    const renderTableForDesc = table.prop('headers')?.find(x => x.key === 'description')?.render;
    const descWrapper = shallow(renderTableForDesc(null, row));
    const renderTableForCDM = table.prop('headers')?.find(x => x.key === 'cdmId')?.render;
    const cdmWrapper = shallow(renderTableForCDM(null, row));
    const renderTableForTags = table.prop('headers')?.find(x => x.key === 'tagIds')?.render;
    const tagsWrapper = shallow(renderTableForTags(null, row));
    const renderTableForState = table.prop('headers')?.find(x => x.key === 'currentState')?.render;
    const stateWrapper = shallow(renderTableForState(null, row));
    expect(descWrapper.exists()).toBeTruthy();
    expect(cdmWrapper.exists()).toBeTruthy();
    expect(tagsWrapper.exists()).toBeTruthy();
    expect(stateWrapper.exists()).toBeTruthy();
  });

  it.skip('should render the context menu option', () => {
    const rows = datamodelsMock.datamodels.items;
    const stopPropagation = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [rows, stopPropagation];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-DataModelsListing-Table`);
    const renderTableForMenu = table.prop('headers')?.find(x => x.key === 'context')?.render;
    const contextMenu = shallow(renderTableForMenu(null, rows));
    const menuBtn = findByInstanceProp(contextMenu, `${PAGE_NAME}-Context`);
    menuBtn.invoke('onClick')({ stopPropagation });
    expect(stopPropagation).toBeCalled();
  });

  it.skip('should render the popOver component menu', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [false, mockSetState];
      } else if (typeof initial === 'object') {
        return [datamodelsMock.datamodels.items[0], mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const popover = findByInstanceProp(wrapper, `${PAGE_NAME}-ContextMenu`);
    popover.invoke('onOptionClicked')({ id: 'edit' });
    popover.invoke('onOptionClicked')({ id: 'submit-review' });
    popover.invoke('onOptionClicked')({ id: 'delete' });
    popover.invoke('onOptionClicked')({ id: 'guidance' });
    popover.invoke('onOptionClicked')({ id: 'export' });
    popover.invoke('onOptionClicked')({ id: 'upload' });
    expect(mockSetState).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
