import React, * as ReactHooks from 'react';
import CommonDataModels from './CommonDataModels';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import {
  commonDMsMock,
  datamodelsMock,
  cdmsMapMock,
} from '../../../../../store/contentLibrary/commonDataModels/tests/commonDMs.mock';

const setUp = (props = {}) => {
  return shallow(<CommonDataModels {...props} />);
};

window.scrollTo = jest.fn();
const PAGE_NAME = 'CL_COMMON_DATAMODELS_LIST';

describe('Common Data Models Listing', () => {
  let store;
  const mockSetState = jest.fn();
  const mockFn = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      commonDatamodels: ImmutableMap({
        isFetchingCDMs: false,
        isUpdatingCDM: false,
        commonDatamodels: commonDMsMock,
        isFetchingMappedDMs: false,
        mappedDMs: [],
        cdmsMap: cdmsMapMock,
      }),
    });

    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
  });

  it('should render the common datamodels list screen', () => {
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: true,
    });
    const tableContainer = findByInstanceProp(wrapper, `${PAGE_NAME}-CommonDataModels-Table-Container`);
    expect(tableContainer.length).toBe(1);
  });

  it('should show empty state view instead of list', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      commonDatamodels: ImmutableMap({
        isFetchingCDMs: false,
        isUpdatingCDM: false,
        commonDatamodels: [],
      }),
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const stateview = findByInstanceProp(wrapper, `${PAGE_NAME}-CommonDataModels-NoRecords`);
    expect(stateview.length).toBe(1);
  });

  it.skip('should all the headers for common data models list', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [commonDMsMock, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-CommonDataModels-Table`);
    const renderTableForDesc = table.prop('headers')?.find(x => x.key === 'description')?.render;
    const rows = commonDMsMock;
    shallow(renderTableForDesc(null, rows));
    const renderTableForName = table.prop('headers')?.find(x => x.key === 'name')?.render;
    shallow(renderTableForName(null, rows));
    expect(table.length).toBe(1);
  });

  it.skip('should render the context menu', () => {
    const mockedCommonDMsMock = commonDMsMock;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [mockedCommonDMsMock, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-CommonDataModels-Table`);
    const renderTableForMenu = table.prop('headers')?.find(x => x.key === 'context')?.render;
    const rows = commonDMsMock;
    const contextMenu = shallow(renderTableForMenu(null, rows));
    const menuBtn = findByInstanceProp(contextMenu, `${PAGE_NAME}-Context`);
    menuBtn.invoke('onClick')({ stopPropagation: mockFn });
    expect(mockSetState).toBeCalled();
  });

  it.skip('should render the context menu', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const popover = findByInstanceProp(wrapper, `${PAGE_NAME}-ContextMenu`);
    popover.invoke('onOptionClicked')({ id: 'edit' });
    popover.invoke('onOptionClicked')({ id: 'delete' });
    popover.invoke('onOptionClicked')({ id: '' });
    expect(mockSetState).toBeCalled();
  });

  it('should handle the close menu modal', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockFn];
      }

      return [initial, mockFn];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const addCDMModal = findByInstanceProp(wrapper, `${PAGE_NAME}-AddCommonDM`);
    addCDMModal.invoke('handleClose')();
    expect(mockFn).toBeCalled();
  });

  it.skip('should open the history modal', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockFn];
      } else if (typeof initial === 'object') {
        return [datamodelsMock[0], mockFn];
      }

      return [initial, mockFn];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const dmHistoryModal = findByInstanceProp(wrapper, `${PAGE_NAME}-Version-History-Modal`);
    dmHistoryModal.invoke('onClose')();
    expect(mockFn).toBeCalled();
  });

  it.skip('should render the empty table for mapped DMs of data models list', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [commonDMsMock, mockFn];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-CommonDataModels-Table`);
    const renderMappedDMsTable = table.prop('renderInnerTemplate');
    const dMsSubTable = shallow(renderMappedDMsTable());
    expect(dMsSubTable.exists()).toBe(true);
  });

  it.skip('should render the mapped DMs table of data models list', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      commonDatamodels: ImmutableMap({
        isFetchingCDMs: false,
        isUpdatingCDM: false,
        commonDatamodels: [],
        isFetchingMappedDMs: false,
        mappedDMs: datamodelsMock,
      }),
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object' && initial?.length === 0) {
        return [commonDMsMock, mockSetState];
      }

      return [initial, mockFn];
    });
    const wrapper = setUp({
      closeAddEditModal: mockFn,
      isAddCDMModalShown: false,
    });
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-CommonDataModels-Table`);
    const renderMappedDMsTable = table.prop('renderInnerTemplate');
    const dMsSubTableWrapper = shallow(renderMappedDMsTable());
    const dmsSubTable = findByInstanceProp(dMsSubTableWrapper, `${PAGE_NAME}-FromCDMs-MappedDMs-Table`);
    const renderTableForDesc = dmsSubTable.prop('headers')?.find(x => x.key === 'description')?.render;
    const row = datamodelsMock[0];
    shallow(renderTableForDesc(null, row));
    const renderTableForName = dmsSubTable.prop('headers')?.find(x => x.key === 'nameTech')?.render;
    shallow(renderTableForName(null, row));
    const renderTableForState = dmsSubTable.prop('headers')?.find(x => x.key === 'currentState')?.render;
    shallow(renderTableForState(row.currentState, row));
    expect(dMsSubTableWrapper.exists()).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
