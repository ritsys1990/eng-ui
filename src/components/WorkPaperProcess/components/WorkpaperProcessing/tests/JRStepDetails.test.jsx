import React, * as ReactHooks from 'react';
import JRStepDetails from '../JRStepDetails';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { getModalOptions } from '../../WorkpaperOutputs/output.utils';
import { Theme } from 'cortex-look-book';
import * as Step2Actions from '../../../../../store/workpaperProcess/step2/actions';

const t = () => {};
const exists = () => {};

const COMPONENT_NAME = 'WorkpaperProcess';

const initialprops = {
  workpaperId: '1234-5678-9123-4567',
  jrStepDetails: [],
  stepDetails: {
    stepId: '1234',
    confirmed: true,
    stepName: 'step2',
    jrDescription: 'description test',
    stepNumber: 2,
  },
  transformationDetails: {},
};

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  wpProcess: {
    step2: ImmutableMap({
      progress: ImmutableMap({
        '1234-5678-9123-4567': {
          totalSteps: 0,
          completedSteps: 0,
        },
      }),
    }),
  },
};

const setUp = (props = {}) => {
  const mergedProps = { ...initialprops, ...props };

  return shallow(<JRStepDetails {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('WpProcess JRStepDetails', () => {
  let store;
  let translationfn;
  let state;
  let options;
  let mockSetState;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(cb => cb());
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initial, mockSetState];
    });
    translationfn = jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t, exists };
    });
    store.clearActions();
    options = getModalOptions(translationfn);
  });

  it.skip('should render accordion', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${initialprops.stepDetails.stepId}`);
    expect(accordion.length).toBe(1);
  });

  it.skip('should render button approve', () => {
    const wrapper = setUp({ options, ...initialprops });
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Approve`);
    expect(button.length).toBe(1);
  });

  it.skip('should render button view data', () => {
    const wrapper = setUp({ options, ...initialprops });
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ViewData`);
    expect(button.length).toBe(1);
  });

  it.skip('should update the opened state when the accordion is clicked', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-${initialprops.stepDetails.stepId}`);
    expect(accordion.length).toBe(1);
    accordion.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should dispatch approveJRStep when clicking on approve button', () => {
    const mockAddEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(Step2Actions, 'approveJRStep').mockImplementation(() => mockAddEntity);

    const wrapper = setUp({ options, ...initialprops });
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Approve`);
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });
});
