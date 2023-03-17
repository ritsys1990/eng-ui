import React, * as ReactHooks from 'react';
import AddNewDMTModal from './AddNewDMTModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<AddNewDMTModal {...props} />);
};

window.scrollTo = jest.fn();

describe('Add New Data Model Transformation Modal', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render the add new DMT modal', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      handleClose: mockFn,
      handleSubmit: mockFn,
      isOpen: true,
      dmtName: 'test',
    });
    const modal = findByInstanceProp(wrapper, `CL_DMTS_ADD_NEW_DMT-Modal`);
    expect(modal.length).toBe(1);
  });

  it.skip('should call onchange method on edit', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      handleClose: mockFn,
      handleSubmit: mockFn,
      isOpen: true,
      dmtName: 'test',
    });
    const input = findByInstanceProp(wrapper, `CL_DMTS_ADD_NEW_DMT-NameInput`);
    input.invoke('onChange')({ currentTarget: { vaue: 'test change' } });
    expect(mockSetState).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
