import React, * as ReactHooks from 'react';
import FiltersTable from '../FiltersTable';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from 'src/utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from 'src/hooks/useNavContext';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { initialState as engagementInitialState } from '../../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../../store/security/reducer';
import { COMPONENT_NAME } from '../constants';

const mockFieldId = 'a58fed83-d81f-41fe-aa63-84aca6223f22';
const mockFilterId = 'f36b8543-a957-40f9-aee4-4b6bab464dd6';
const mockTableId = '9e723aeb-ad2d-45b2-9adc-50c464c773d8';

const defaultProps = {
  isMenuOpen: true,
  setIsMenuOpen: () => {},
  deleteFilterRow: () => {},
  editFilterRow: () => {},
  handleClose: () => {},
  filterRows: [
    {
      description: 'Tere',
      fieldId: mockFieldId,
      fieldName: 'PARENT_FLEX_VALUE',
      id: mockFilterId,
      filterOperations: [
        {
          filterCriteria: '=',
          filterValue: '12',
        },
      ],
      name: 'FilterNew',
      tableId: mockTableId,
      tableName: 'FND_FLEX_VALUE_HIERARCHIES',
      type: 'suggested',
    },
  ],
  isBundlePublished: false,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<FiltersTable {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { bundleId: '12345' };
  }),
}));

describe('Add filter table Page', () => {
  let store;
  let mockSetState;
  let headers;

  beforeEach(() => {
    store = configureStore([thunk])({
      bundles: ImmutableMap({
        isFetchingBundleNameDetails: false,
        sourceVersionFilters: {
          description: 'Tere',
          fieldId: mockFieldId,
          fieldName: 'PARENT_FLEX_VALUE',
          id: mockFilterId,
          filterOperations: [
            {
              filterCriteria: '=',
              filterValue: '12',
            },
          ],
          name: 'FilterNew',
          tableId: mockTableId,
          tableName: 'FND_FLEX_VALUE_HIERARCHIES',
          type: 'suggested',
        },
      }),
      security: securityInitialState,
      client: clientInitialState,
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 5) {
        headers = arg;
      }
    });

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}-spinner`);
    expect(spinner.length).toBe(1);
  });

  it('should render filter table', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Table`);
    expect(table.length).toBe(1);
  });

  it('should render filter context menu', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Context-Menu`);
    expect(menu.length).toBe(1);
  });

  it.skip('should render button header and call action', () => {
    const filterRow = {
      id: '121',
      name: 'test',
      description: 'testt',
      type: 'suggested',
      filterOperations: [
        {
          filterCriteria: '=',
          filterValue: '10',
        },
      ],
      tableId: '122423',
      fieldId: '34234',
      tableName: 'teetse ete',
      fieldName: 'test test',
    };
    const handleContexButtonClick = jest.fn();

    const wrapper = setUp({ filterRows: [], handleContexButtonClick });
    expect(wrapper.exists()).toBe(true);
    expect(headers.length).toBeGreaterThanOrEqual(4);
    const buttonWrapper = shallow(headers[4].render(null, filterRow));
    expect(buttonWrapper.length).toBe(1);
    const button = findByInstanceProp(buttonWrapper, `${COMPONENT_NAME}-Filter-Table-Menu`, 'Button');
    button.invoke('onClick')('Test');
    expect(mockSetState).toHaveBeenLastCalledWith(filterRow);
  });

  it('should call onEditEntity when click edit', () => {
    const mockEditFilter = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ editFilterRow: mockEditFilter });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Context-Menu`);
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('editFilterRow')();
    expect(mockEditFilter).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteEntity when click delete', () => {
    const mockDeleteFilter = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ deleteFilterRow: mockDeleteFilter });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Context-Menu`);
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('deleteFilterRow')();
    expect(mockDeleteFilter).toHaveBeenCalledTimes(1);
  });

  it.skip('should call on close when click close', () => {
    const sourceVersionFilter = [
      {
        description: 'Tere',
        fieldId: mockFieldId,
        fieldName: 'PARENT_FLEX_VALUE',
        id: mockFilterId,
        filterOperations: [
          {
            fieldName: 'PARENT_FLEX_VALUE',
            filterValue: '12',
            operation: '=',
            tableId: mockTableId,
            tableName: 'FND_FLEX_VALUE_HIERARCHIES',
          },
        ],
        name: 'FilterNew',
        tableId: mockTableId,
        tableName: 'FND_FLEX_VALUE_HIERARCHIES',
        type: 'suggested',
      },
    ];
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Context-Menu`);
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(sourceVersionFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
