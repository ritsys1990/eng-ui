import React, * as ReactHooks from 'react';
import DataModelsTabMenu from './DataModelsTabMenu';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from '../../../../../hooks/useNavContext';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { DATAMODEL_TABS } from '../../constants/constants';
import * as DataModelsHelper from '../../utils/DataModelsHelper';
import { tags } from '../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';

const TABS_COMPONENT_NAME = 'CL_DATAMODELS_TAB_MENU-tabs';
const dmtTabId = 'datamodel-transformations';
const PAGE_NAME = 'CL_DATAMODELS_TAB_MENU';

const defaultProps = {
  searchTextHandle: jest.fn(),
  handlerPrimaryButton: jest.fn(),
  setIsCDMTab: jest.fn(),
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DataModelsTabMenu {...mergedProps} />);
};

window.scrollTo = jest.fn();

const mockFn = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: { pathname: 'datamodels' },
    push: mockFn,
  }),
  useLocation: () => ({
    pathname: 'datamodels',
  }),
}));

describe('Content Library Data Models Tab Menu', () => {
  let store;

  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      bundles: ImmutableMap({
        tagsPublishedList: {
          items: [
            {
              id: '123',
              parentId: '456',
              lastUpdated: '',
              lastUpdatedBy: 'email@deloitte.com',
              name: 'While',
              description: '',
            },
          ],
        },
      }),
    });

    mockSetState = jest.fn().mockImplementation(() => {});
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render with Datamodels selected', () => {
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, TABS_COMPONENT_NAME);
    expect(tabs.length).toBe(1);
  });

  it.skip('should render with DMTs selected', () => {
    const tempMockFn = jest.fn();
    const wrapper = setUp({ handlePrimaryButtonText: tempMockFn, searchText: 'test', openEditDMModal: mockFn });
    const tabs = findByInstanceProp(wrapper, TABS_COMPONENT_NAME);
    tabs.invoke('onTabClicked')(dmtTabId);
    wrapper.update();
    expect(mockSetState).toHaveBeenCalledWith(dmtTabId);
  });

  it.skip('should render DMTs tab and select tags', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === '') {
        return [DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS, mockSetState];
      }

      return [initial, mockSetState];
    });
    jest.spyOn(DataModelsHelper, 'isActiveStandardBundleTab').mockImplementation(initial => {
      if (initial) {
        return true;
      }

      return false;
    });
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, `${PAGE_NAME}-Select-Tags`);
    const selectedTags = tags.items;
    tabs.invoke('onChange')(selectedTags);
    expect(mockSetState).toBeCalled();
  });

  it.skip('should render DMs Listing tabs', () => {
    const mockedDMTabs = DATAMODEL_TABS.DATAMODELS;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === '') {
        return [mockedDMTabs, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({ openEditDMModal: mockFn });
    const tabs = findByInstanceProp(wrapper, TABS_COMPONENT_NAME);
    tabs.invoke('onTabClicked')(dmtTabId);
    const updatedTabs = findByInstanceProp(wrapper, `${PAGE_NAME}-DMListing`);
    updatedTabs.invoke('openEditDMModal')(true);
    expect(mockFn).toBeCalled();
  });

  it.skip('should invoke DMs Listing tabs', () => {
    const mockedTabDM = DATAMODEL_TABS.DATAMODELS;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === '') {
        return [mockedTabDM, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({ openEditDMModal: mockFn });
    const tabs = findByInstanceProp(wrapper, `${PAGE_NAME}-tabs`);
    tabs.invoke('onTabClicked')(DATAMODEL_TABS.COMMON_DATAMODELS);
    tabs.invoke('onTabClicked')('');
    expect(mockFn).toBeCalledTimes(2);
  });

  it.skip('should render handleDMTTabClick method', () => {
    const mockedDMT = DATAMODEL_TABS.DATAMODEL_TRANSFORMATIONS;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === '') {
        return [mockedDMT, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, `${PAGE_NAME}-DMT_tabs`);
    tabs.invoke('onTabClicked')(DATAMODEL_TABS.DATAMODELS);
    tabs.invoke('onTabClicked')('');
    expect(mockFn).toBeCalledTimes(2);
  });

  it.skip('should invoke Common DMs Listing tabs', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === '') {
        return [DATAMODEL_TABS.COMMON_DATAMODELS, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({ openEditDMModal: mockFn });
    const tabs = findByInstanceProp(wrapper, `${PAGE_NAME}-Common-Datamodels`);
    expect(tabs.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
