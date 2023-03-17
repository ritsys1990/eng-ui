import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp, mockL10nContent } from '../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import ChildWorkpaperTable from './ChildWorkpaperTable';
import { initialState as errorInitialState } from '../../../../store/errors/reducer';
import { initialState as workpaperInitialState } from '../../../../store/workpaper/reducer';
import { initialState as clientInitialState } from '../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../store/security/reducer';
import { Theme } from 'cortex-look-book';

const COMPONENT_NAME = 'Child_WorkpaperTable';
const mockHistoryPush = jest.fn();

const rows = [
  {
    id: '123',
    name: 'Test name',
    description: 'Test description',
    status: 'InPRogress',
    childWorkPaperStatus: 'Not Generated',
    history: {},
  },
];

const defaultProps = {
  isMenuOpen: true,
  isActionModalOpen: true,
  setIsMenuOpen: () => {},
  rows,
  selectedChildWps: [],
  onChildWpChecked: () => {},
  setFiltersOpen: () => {},
  setEditChildWPClick: () => {},
  setEditChildWPDetails: () => {},
  hideGenerateOutputErrorMessage: () => {},
  onCheckboxAllChecked: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ChildWorkpaperTable {...mergedProps} />);
};

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('ListPopover: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let headers = [];
  window.scrollTo = jest.fn();
  let onChangeSelect;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      client: clientInitialState,
      security: securityInitialState,
      workpaper: ImmutableMap({ ...workpaperInitialState }),
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockSetState = jest.fn().mockImplementation(value => {
      if (Array.isArray(value) && value.length === 5) {
        headers = value;
      }
    });

    onChangeSelect = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
  });

  it('should render table', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(table.length).toBe(1);
  });

  it.skip('should render field nameTech', () => {
    setUp({ rows });
    const renderName = headers?.find(x => x.key === 'childWorkPaperName')?.render;
    const nameCol = shallow(renderName(null, rows));
    expect(nameCol.exists()).toBe(true);
  });

  it.skip('should render field description', () => {
    setUp({ rows });
    const renderDescription = headers?.find(x => x.key === 'description')?.render;
    const descriptionCol = shallow(renderDescription(null, rows));
    expect(descriptionCol.exists()).toBe(true);
  });

  it.skip('should render field status', () => {
    setUp({ rows });
    const renderStatus = headers?.find(x => x.key === 'childWorkPaperStatus')?.render;
    const statusCol = shallow(renderStatus(null, rows));
    expect(statusCol.exists()).toBe(true);
  });

  it('should render context menu', () => {
    const wrapper = setUp({ isAddField: true, showFieldModal: jest.fn() });
    const contextMenuComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    expect(contextMenuComponent.exists()).toBe(true);
  });

  it.skip('should render checkbox against child workpaper ', () => {
    const wrapper = setUp({ onChildWpChecked: onChangeSelect, selectedChildWps: [] });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);

    const header = shallow(headers[0].render(null, { id: 1 }));
    const checkbox = findByInstanceProp(header, `${COMPONENT_NAME}-1-checkbox`);
    checkbox.invoke('onChange')();
    expect(onChangeSelect).toHaveBeenCalledTimes(1);
  });

  it.skip('should run onClose with default option from Popover', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-PopoverMenu`);
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });

  it('should run handleOptionClicked with EDIT option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    menu.invoke('onOptionClicked')({ id: 'EDIT' });
    expect(menu.length).toBe(1);
  });
  it('should run handleOptionClicked with DELETE option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    menu.invoke('onOptionClicked')({ id: 'DELETE' });
    expect(menu.length).toBe(1);
  });
  it.skip('should render delete child work paper modal', () => {
    const wrapper = setUp();
    const deleteModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Delete_Modal`);
    expect(deleteModal.length).toBe(1);
    deleteModal.invoke('onClose')();
    expect(mockSetState).toHaveBeenCalledTimes(2);
  });
  it('should run handleOptionClicked with default option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    menu.invoke('onOptionClicked')({ id: 'DEFAULT' });
    expect(menu.length).toBe(1);
  });
  it.skip('should render all checkbox and trigger onChnage fn', () => {
    setUp({ rows, onCheckboxAllChecked: onChangeSelect, selectedChildWps: [] });
    const instance = headers?.[0]?.title?.props?.dataInstance;
    expect(instance).toEqual(`${COMPONENT_NAME}-checkboxAll_0`);
    const childInstance = headers?.[0]?.title?.props?.children?.props?.dataInstance;
    expect(childInstance).toEqual(`${COMPONENT_NAME}-checkboxAll`);
    headers?.[0]?.title?.props?.children?.props?.onChange();
    expect(onChangeSelect).toHaveBeenCalledTimes(1);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
