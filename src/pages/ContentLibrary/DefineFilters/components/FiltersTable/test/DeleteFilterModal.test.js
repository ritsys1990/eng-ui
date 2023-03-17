import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from 'src/utils/testUtils';
import DeleteFilterModal from '../DeleteFilterModal';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { COMPONENT_NAME } from '../constants';

const selectedFilter = { id: '2344', description: 'test', name: 'Test2' };

const defaultProps = {
  handleClose: () => {},
  sourceVersionId: 123123 - 3234243,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteFilterModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
  let useSelectorFn;
  let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      bundles: ImmutableMap({
        isFetchingBundleNameDetails: false,
        sourceVersionFilters: {
          description: 'Tere',
          fieldId: 'a58fed83-d81f-41fe-aa63-84aca6223f22',
          fieldName: 'PARENT_FLEX_VALUE',
          id: 'f36b8543-a957-40f9-aee4-4b6bab464dd6',
          filterOperations: [
            {
              filterCriteria: '=',
              filterValue: '12',
            },
          ],
          name: 'FilterNew',
          tableId: '9e723aeb-ad2d-45b2-9adc-50c464c773d8',
          tableName: 'FND_FLEX_VALUE_HIERARCHIES',
          type: 'suggested',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should call useEffect when rendering ', () => {
    const wrapper = setUp({ selectedFilter });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Delete`, 'Modal');
    expect(comp.length).toBe(1);
  });

  it('should render useselector', () => {
    const wrapper = setUp({ selectedFilter });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Delete`, 'Modal');
    expect(comp.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should call on submit ', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose, selectedFilter });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Delete`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
