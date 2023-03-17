import React, * as ReactHooks from 'react';
import DataModelTransformations from './DataModelTransformations';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as DataModelUtilities from '../../utils/DataModelsHelper';
import { initialState as BundleInitialState } from '../../../../../store/bundles/reducer';
import { initialState as WorkpaperInitialState } from '../../../../../store/workpaper/reducer';

const setUp = (props = {}) => {
  return shallow(<DataModelTransformations {...props} />);
};

window.scrollTo = jest.fn();

describe('Content Library Data Models Transformations Page', () => {
  let store;
  let useSelectorFn;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isDataModelsFetching: false,
        publishedDatamodels: [],
        isValidatingDMT: false,
        isCreatingNewDMT: false,
      }),
      workpaper: WorkpaperInitialState.merge({
        selectIsConfiguringBundle: false,
      }),
      bundles: BundleInitialState.merge({
        publishedBundleBase: [
          {
            id: '1232',
            name: 'test',
          },
        ],
      }),
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, jest.fn()]);
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(
      wrapper,
      'CL_DATAMODEL_TRANSFORMATIONS-DataModelsListing-Table-Container',
      'ForwardRef'
    );
    expect(useSelectorFn).toHaveBeenCalledTimes(13);
    expect(component.length).toBe(1);
  });

  it('should render table', () => {
    jest.spyOn(DataModelUtilities, 'isTableEmpty').mockReturnValueOnce(true);
    const wrapper = setUp({ selectedTab: 'standard-bundles' });
    const table = findByInstanceProp(wrapper, 'CL_DATAMODEL_TRANSFORMATIONS-StandartBundlesListing-Table');
    table.prop('renderInnerTemplate')({ bundleBaseId: '123' });
    table.prop('isRowExpandable')();
    expect(table.length).toBe(1);
  });

  it('should render StateView', () => {
    jest.spyOn(DataModelUtilities, 'isTableEmpty').mockReturnValueOnce(false);
    const wrapper = setUp({ selectedTab: 'standard-bundles' });
    const stateView = findByInstanceProp(wrapper, 'CL_DATAMODEL_TRANSFORMATIONS-DataModelsListing-NoRecords');
    expect(stateView.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
