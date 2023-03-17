import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../utils/testUtils';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import FilterGrid from '../components/FilterGrid';

const COMPONENT_NAME = 'CHILD_WORKPAPER_FilterGrid';
const mockHistoryPush = jest.fn();

const filterData = {
  engagementId: '1122',
  parentWorkpaperId: '11234',
  childWorkpaperName: 'test',
  description: 'description',
  filters: [
    {
      id: 1234,
      tableId: '101',
      tableName: 'table1',
      columnName: 'columnName1',
      filterValue: 'test1',
    },
  ],
};

const defaultProps = {
  setFilterData: () => {},
  setIsOpenFirstStep: true,
  filterData,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<FilterGrid {...mergedProps} />);
};

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let useEffectFn;
  let useState;
  let useCallBackFn;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useCallBackFn = jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f());
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    wrapper.setProps({ filterData });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    wrapper.setProps({ filterData });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(modal.length).toBe(1);
    expect(useState).toHaveBeenCalledTimes(2);
  });

  it('should render Table ', () => {
    const wrapper = setUp();
    wrapper.setProps({ filterData });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(modal.length).toBe(1);
  });

  it.skip('should call useCallBack when rendering ', () => {
    const wrapper = setUp();
    wrapper.setProps({ filterData });
    expect(useCallBackFn).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
