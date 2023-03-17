import React, * as ReactHooks from 'react';
import WorkpaperDataModelTransformation from '../WorkpaperDataModelTransformation';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { initialState as wpProcessInitialState } from '../../../../../store/workpaperProcess/reducer';
import { initialState as step2InitialState } from '../../../../../store/workpaperProcess/step2/reducer';
import { initialState as errorInitialState } from '../../../../../store/errors/reducer';
import { initialState as dataWranglerInitialState } from '../../../../../store/dataWrangler/reducer';
import { WORKPAPER_CANVAS_TYPES, WORKPAPER_TYPES } from '../../../../../utils/WorkpaperTypes.const';

const COMPONENT_NAME = 'WorkpaperDataModelTransformation';
const mockDMTId = '1234-5678-9012-3456';

const defaultProps = {
  workpaperType: WORKPAPER_TYPES.TRIFACTA,
  canvasType: WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD,
  workpaperId: mockDMTId,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<WorkpaperDataModelTransformation {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Workpaper Data Model Transformation', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpProcess: {
        general: wpProcessInitialState.merge({ dmts: [{ id: mockDMTId, name: 'DMT' }] }),
        step2: step2InitialState.merge({
          isLoading: ImmutableMap({
            [mockDMTId]: false,
          }),
          fetchingTrifactaParams: ImmutableMap({
            [mockDMTId]: false,
          }),
          fetchingTrifactaJRSteps: ImmutableMap({
            [mockDMTId]: false,
          }),
        }),
      },
      errors: errorInitialState.merge({
        workpaperProcessingErrors: ImmutableMap({
          [mockDMTId]: [],
        }),
      }),
      dataWrangler: dataWranglerInitialState.merge({
        isFetchingFlowDetails: ImmutableMap({
          [mockDMTId]: false,
        }),
        isRunningSpecificDataFlows: ImmutableMap({
          [mockDMTId]: false,
        }),
        isValidatingFlow: ImmutableMap({
          [mockDMTId]: false,
        }),
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(8);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
