import React, * as ReactHooks from 'react';
import AddCommonDataModelModal from './AddCommonDataModelModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<AddCommonDataModelModal {...props} />);
};

const COMPONENT_NAME = 'CREATE_NEW_CDM_MODAL';

window.scrollTo = jest.fn();

describe('Create or Edit Common Data Modal', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      commonDatamodels: ImmutableMap({
        isUpdatingCDM: false,
      }),
      errors: ImmutableMap({
        dmFieldErrors: [],
      }),
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render the add common datamodel view', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isAddCDM: false,
      isOpen: true,
      handleClose: mockFn,
      selectedCDM: null,
    });
    const addCDMModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Modal`);
    expect(addCDMModal.length).toBe(1);
  });

  it.skip('should change the input name field', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isAddCDM: false,
      isOpen: true,
      handleClose: mockFn,
      selectedCDM: null,
    });
    const inputNameField = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldName`);
    inputNameField.invoke('onChange')({ currentTarget: { value: 'test' } });
    expect(mockSetState).toBeCalled();
  });

  it.skip('should call the closeModal', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isAddCDM: true,
      isOpen: true,
      handleClose: mockFn,
      selectedCDM: null,
    });
    const addCDMModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Modal`);
    addCDMModal.invoke('onClose')();
    expect(mockSetState).toBeCalledTimes(4);
  });

  it.skip('should call the handle primary button click', () => {
    const mockFn = jest.fn();
    const formState = {
      invalid: false,
      value: {
        name: '',
        description: '',
      },
    };
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'object') {
        return [formState, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      isAddCDM: false,
      isOpen: true,
      handleClose: mockFn,
      selectedCDM: { name: 'test cdm' },
    });
    const addCDMModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Modal`);
    addCDMModal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toBeCalledTimes(3);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
