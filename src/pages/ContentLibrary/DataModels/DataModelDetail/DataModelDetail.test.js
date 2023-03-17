import React, * as ReactHooks from 'react';
import DataModelDetail from './DataModelDetail';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../hooks/useCheckAuth';
import * as NavContextHook from '../../../../hooks/useNavContext';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { PagePermissions } from '../../../../utils/permissionsHelper';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<DataModelDetail {...props} />);
};

const COMPONENT_NAME = 'Datamodel-Detail';

window.scrollTo = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { datamodelId: '12345' };
  }),
}));

describe('Content Library Data Models Page', () => {
  let store;
  let useSelectorFn;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isDMDataLoading: false,
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
    const header = findByInstanceProp(wrapper, 'Datamodel-Detail-HeaderBar');
    expect(header.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    wrapper.update();
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it('should render box when user has no permissions', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = false;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const Box = findByInstanceProp(wrapper, 'Datamodel-Detail-NoPermissions');
    expect(Box.length).toBe(1);
  });

  it('should trigger on Primary Button Click', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const header = findByInstanceProp(wrapper, 'Datamodel-Detail-HeaderBar');
    header.invoke('onPrimaryButtonClick')(COMPONENT_NAME);
    expect(header.length).toBe(1);
  });

  it('should trigger on handleClose', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const header = findByInstanceProp(wrapper, 'Datamodel-Detail-DataModelFieldsList');
    header.invoke('handleClose')();
    expect(header.props().isFieldModalShown).toBe(false);
  });

  it('should trigger on handleClose', () => {
    const pagePermissions = {};
    pagePermissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockReturnValue({ crumbs: [] });
    const wrapper = setUp();
    const header1 = findByInstanceProp(wrapper, 'Datamodel-Detail-DataModelFieldsList');
    header1.invoke('showFieldModal')();
    expect(header1.props().isAddField).toBe(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
