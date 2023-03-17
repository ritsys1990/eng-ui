import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import PublishWorkbookModal from '../PublishWorkbookModal';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as Step3Actions from 'src/store/workpaperProcess/step3/actions';

import { getModalOptions } from '../output.utils';

const t = () => {};
const exists = () => {};

const setUp = (props = {}) => {
  return shallow(<PublishWorkbookModal {...props} />);
};

const COMPONENT_NAME = 'PublishWorkbookModal';

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
};

const initialprops = {
  isOpen: true,
  onClose: () => {},
  workpaperId: '1234-5678-9123-4567',
  outputs: [],
};

describe('WpProcess publish workbook modal', () => {
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

  it('should render input', () => {
    const wrapper = setUp({ options, ...initialprops });
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-NameInput`);
    expect(input.length).toBe(1);
  });

  it('should render accordion', () => {
    const wrapper = setUp({ options, ...initialprops });
    const accordion = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Accordion`);
    expect(accordion.length).toBe(1);
  });

  it.skip('should update the input text when the input is changed', () => {
    const mockInputText = { target: { value: 'Test' } };
    const wrapper = setUp({ options, ...initialprops });
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-NameInput`);
    expect(input.length).toBe(1);
    input.invoke('onChange')(mockInputText);
    expect(mockSetState).toHaveBeenLastCalledWith(mockInputText.target.value);
  });

  it('should publish workbook when clicking the modal', () => {
    const mockAddEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(Step3Actions, 'publishWorkbook').mockImplementation(() => mockAddEntity);

    const wrapper = setUp({ options, ...initialprops });
    const modal = findByInstanceProp(wrapper, '', 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });
});
