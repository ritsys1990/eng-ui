import React, * as ReactHooks from 'react';
import ProcessWorkpaper from '../ProcessWorkpaper';
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
  workpaperType: '',
};

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  wpProcess: {
    step1: ImmutableMap({
      inputs: [],
    }),
    step2: ImmutableMap({
      progress: ImmutableMap({
        '1234-5678-9123-4567': {
          totalSteps: 0,
          completedSteps: 0,
        },
      }),
      jrStepDetails: ImmutableMap({
        '1234-5678-9123-4567': {},
      }),
    }),
  },
};

const setUp = (props = {}) => {
  const mergedProps = { ...initialprops, ...props };

  return shallow(<ProcessWorkpaper {...mergedProps} />);
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

  it('should render warning modal', () => {
    const wrapper = setUp({ options, ...initialprops });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DMV-Warning`);
    expect(modal.length).toBe(1);
  });

  it('should render transference in progress modal', () => {
    const wrapper = setUp({ options, ...initialprops });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Trans-In-Progress`);
    expect(modal.length).toBe(1);
  });

  it.skip('should render primary button', () => {
    const wrapper = setUp({ options, ...initialprops });
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Primary`);
    expect(button.length).toBe(1);
  });

  it('should render secondary button', () => {
    const wrapper = setUp({ options, ...initialprops });
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Secondary`);
    expect(button.length).toBe(1);
  });

  it.skip('should update the state when the warning modal primary button is clicked', () => {
    const wrapper = setUp({ options, ...initialprops });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DMV-Warning`);
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should update the opened state when the warning modal secondary button is clicked', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DMV-Warning`);
    expect(accordion.length).toBe(1);
    accordion.invoke('onSecondaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should update the opened state when the progress modal primary button is clicked', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Trans-In-Progress`);
    expect(accordion.length).toBe(1);
    accordion.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should update the opened state when the primary button is clicked', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Primary`);
    expect(accordion.length).toBe(1);
    accordion.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should dispatch approveAllJRSteps when clicking secondary button', () => {
    const mockAddEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(Step2Actions, 'approveAllJRSteps').mockImplementation(() => mockAddEntity);

    const wrapper = setUp({ options, ...initialprops });
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Secondary`);
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });
});
