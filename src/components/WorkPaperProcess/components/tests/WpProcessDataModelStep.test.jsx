import React, * as ReactHooks from 'react';
import WpProcessDataModelStep from '../WpProcessDataModelStep';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { initialState as wpProcessInitialState } from '../../../../store/workpaperProcess/reducer';
import { initialState as step1InitialState } from '../../../../store/workpaperProcess/step1/reducer';
import { initialState as step2InitialState } from '../../../../store/workpaperProcess/step2/reducer';
import { WORKPAPER_CANVAS_TYPES, WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';

const COMPONENT_NAME = 'WpProcessDataModelStep';

const defaultProps = {
  workpaperType: WORKPAPER_TYPES.TRIFACTA,
  canvasType: WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<WpProcessDataModelStep {...mergedProps} />);
};

window.scrollTo = jest.fn();

const mockDMTId1 = '1234-5678-9012-3456';
const mockDMTId2 = '6543-2109-8765-4321';

describe('Wp Process Data Model Step', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpProcess: {
        general: wpProcessInitialState.merge({ dmts: [{ id: mockDMTId1 }, { id: mockDMTId2 }] }),
        step1: step1InitialState.merge({
          inputs: [{ name: 'Input', dataRequestInfo: [{ bundleTransformationId: mockDMTId1 }] }],
        }),
        step2: step2InitialState.merge({ isDMTStepShown: true }),
      },
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
    const accordion = findByInstanceProp(wrapper, COMPONENT_NAME, 'Accordion');
    expect(accordion.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, COMPONENT_NAME, 'Accordion');
    expect(accordion.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(10);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, COMPONENT_NAME, 'Accordion');
    expect(accordion.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(4);
  });

  it('should render header', () => {
    const wrapper = setUp();
    const accordion = findByInstanceProp(wrapper, COMPONENT_NAME, 'Accordion');
    expect(accordion.length).toBe(1);
    const header = shallow(accordion.prop('header').render());
    expect(header.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
