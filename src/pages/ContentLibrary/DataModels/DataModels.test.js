import React, * as ReactHooks from 'react';
import DataModels from './DataModels';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../hooks/useCheckAuth';
import * as NavContextHook from '../../../hooks/useNavContext';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { PagePermissions } from '../../../utils/permissionsHelper';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const HEADER_COMPONENT_NAME = 'CL_DATAMODELS-Header';

const setUp = (props = {}) => {
  return shallow(<DataModels {...props} />);
};

window.scrollTo = jest.fn();

describe('Content Library Data Models Page', () => {
  let store;
  let useSelectorFn;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isDeleting: false,
      }),
    });
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
  });

  it('should render header bar when user has permissions', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const header = findByInstanceProp(wrapper, HEADER_COMPONENT_NAME);
    expect(header.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const header = findByInstanceProp(wrapper, HEADER_COMPONENT_NAME);
    expect(header.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should render box when user has no permissions', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = false;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const Box = findByInstanceProp(wrapper, 'CL_DATAMODELS-NoPermissions');
    expect(Box.length).toBe(1);
  });

  it('should trigger on Primary Button Click', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const header = findByInstanceProp(wrapper, HEADER_COMPONENT_NAME);
    header.invoke('onPrimaryButtonClick')('CL_DATAMODELS');
    expect(header.length).toBe(1);
  });

  it.skip('should trigger openEditDMModal ', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const tabMenu = findByInstanceProp(wrapper, 'CL_DATAMODELS-DataModelsTabMenu');
    tabMenu.invoke('openEditDMModal')({});
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  it.skip('should trigger handleClose ', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const addDMModal = findByInstanceProp(wrapper, 'CL_DATAMODELS-AddDataModelModal');
    addDMModal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  it.skip('should trigger handleSearchChange ', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const addDMModal = findByInstanceProp(wrapper, HEADER_COMPONENT_NAME);
    addDMModal.invoke('onSearchChange')('searchText');
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
