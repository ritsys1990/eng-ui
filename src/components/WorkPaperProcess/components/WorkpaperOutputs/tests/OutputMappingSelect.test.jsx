import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import OutputMappingSelect from '../OutputMappingSelect';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { getModalOptions } from '../output.utils';

const t = () => {};
const exists = () => {};

const setUp = (props = {}) => {
  return shallow(<OutputMappingSelect {...props} />);
};

const COMPONENT_NAME = 'Step3Output';

const initialState = {
  settings: ImmutableMap({
    language: { ...LANGUAGE_DATA },
  }),
};

const initialprops = {
  field: '',
  value: 'test value',
  onFieldChange: () => {},
  options: [],
  inputChangeDebounce: () => {},
  filtering: null,
  isCentralizedDSUpdated: false,
};

describe('WpProcess output mapping select component', () => {
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

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initial, mockSetState];
    });
    translationfn = jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t, exists };
    });
    store.clearActions();
    options = getModalOptions(translationfn);
  });

  it('should render output mapping select', () => {
    const wrapper = setUp({ options, ...initialprops });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
  });
});
