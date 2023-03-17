import React, * as ReactHooks from 'react';
import DefineFilters from '../DefineFilters';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from 'src/utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from 'src/hooks/useNavContext';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { PAGE_NAME } from '../constants/constants';

const setUp = (props = {}) => {
  return shallow(<DefineFilters {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { bundleId: '12345' };
  }),
}));

describe('Filter Definition Page', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      bundles: ImmutableMap({
        isFetchingBundleNameDetails: false,
        bundleNameDetails: {
          sourceVersionId: '1223232-2323',
          currentState: {
            publishState: 'Draft',
          },
        },
        sourceVersionFilters: [
          {
            description: 'Tere',
            fieldId: 'a58fed83-d81f-41fe-aa63-84aca6223f22',
            fieldName: 'PARENT_FLEX_VALUE',
            id: 'f36b8543-a957-40f9-aee4-4b6bab464dd6',
            filterOperations: [],
            name: 'FilterNew',
            tableId: '9e723aeb-ad2d-45b2-9adc-50c464c773d8',
            tableName: 'FND_FLEX_VALUE_HIERARCHIES',
            type: 'suggested',
          },
        ],
      }),
      security: ImmutableMap({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${PAGE_NAME}`, 'Spinner');
    expect(spinner.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${PAGE_NAME}`, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(5);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${PAGE_NAME}`, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${PAGE_NAME}`, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(4);
  });

  it('should render HeaderBar', () => {
    const wrapper = setUp();
    const headerBar = findByInstanceProp(wrapper, `${PAGE_NAME}-HeaderBar`, 'HeaderBar');
    expect(headerBar.length).toBe(1);
  });

  it.skip('should render HeaderBar primary button click', () => {
    const wrapper = setUp();
    const headerBar = findByInstanceProp(wrapper, `${PAGE_NAME}-HeaderBar`, 'HeaderBar');
    headerBar.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render container', () => {
    const wrapper = setUp();
    const container = findByInstanceProp(wrapper, `${PAGE_NAME}-container`, 'Container');
    expect(container.length).toBe(1);
  });

  it.skip('should handle tab click ', () => {
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, `${PAGE_NAME}-Tabs`, 'Tabs');
    expect(tabs.length).toBe(1);
    tabs.invoke('onTabClicked')('test');
    expect(mockSetState).toHaveBeenLastCalledWith('test');
  });

  it('should render add filter modal ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${PAGE_NAME}-Filter-Modal`);
    expect(modal.length).toBe(1);
  });

  it('should render filter table ', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-Filter-Table`);
    expect(table.length).toBe(1);
  });

  it.skip('should handle edit filter row ', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-Filter-Table`);
    expect(table.length).toBe(1);
    table.invoke('editFilterRow')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should handle delete filter row ', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${PAGE_NAME}-Filter-Table`);
    expect(table.length).toBe(1);
    table.invoke('deleteFilterRow')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should render delete filter modal ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${PAGE_NAME}-Delete-Filter-Modal`);
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should handle add filter modal onclose ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${PAGE_NAME}-Filter-Modal`);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
