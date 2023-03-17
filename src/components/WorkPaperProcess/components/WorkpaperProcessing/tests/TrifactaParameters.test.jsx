import React, * as ReactHooks from 'react';
import TrifactaParameters from '../TrifactaParameters';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { getModalOptions } from '../../WorkpaperOutputs/output.utils';
import { Theme } from 'cortex-look-book';
import { findByInstanceProp } from '../../../../../utils/testUtils';

const t = () => {};
const exists = () => {};

const COMPONENT_NAME = 'WorkpaperProcess';

const initialprops = {
  workpaperId: '1234-5678-9123-4567',
  isDMT: true,
};

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  wpProcess: {
    step2: ImmutableMap({
      progress: ImmutableMap({
        '1234-5678-9123-4567': {},
      }),
      trifactaParameters: ImmutableMap({
        '1234-5678-9123-4567': [{}, {}],
      }),
    }),
    general: ImmutableMap({
      dmts: ImmutableMap({
        '1432-5678-9043-0293': {},
      }),
    }),
  },
};

const setUp = (props = {}) => {
  const mergedProps = { ...initialprops, ...props };

  return shallow(<TrifactaParameters {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('WpProcess trifacta parameters', () => {
  let store;
  let translationfn;
  let state;
  let options;
  let mockSetState;
  let useSelectorFn;

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
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    translationfn = jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t, exists };
    });
    store.clearActions();
    options = getModalOptions(translationfn);
  });

  it.skip('should render JRSteps', () => {
    const wrapper = setUp({ options, ...initialprops });
    expect(wrapper.length).toBe(1);
  });

  it.skip('should call use selector', () => {
    const wrapper = setUp({ options, ...initialprops });
    expect(wrapper.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(6);
  });

  it.skip('should render accordion', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TrifactaParameterList`);
    expect(accordion.length).toBe(1);
  });

  it.skip('should update the state when the accordion button is clicked', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TrifactaParameterList`);
    expect(accordion.length).toBe(1);
    accordion.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });
});
