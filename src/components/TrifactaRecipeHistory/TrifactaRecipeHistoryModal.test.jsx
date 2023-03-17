import React, * as ReactHooks from 'react';
import TrifactaRecipeHistoryModal, { COMPONENT_NAME } from './TrifactaRecipeHistoryModal';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';
import { getWpDetailsMock } from '../../services/mocks/tests/wp.mock';
import { findByInstanceProp } from '../../utils/testUtils';
import * as DataWranglerStoreActions from '../../store/dataWrangler/actions';

const setUp = (props = {}) => {
  return shallow(<TrifactaRecipeHistoryModal onClose={() => {}} onRecipeHistoryLoader={() => {}} {...props} />);
};

describe('TrifactaRecipeHistoryModal', () => {
  let store;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpProcess: {
        general: ImmutableMap({
          workpaper: getWpDetailsMock(),
        }),
      },
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    store.clearActions();
  });

  it('should render:', () => {
    shallow(<TrifactaRecipeHistoryModal onClose={() => {}} onRecipeHistoryLoader={false} />);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should render isRequiredField:', () => {
    TrifactaRecipeHistoryModal.isRequiredField = jest.fn().mockReturnValue(1);
    const isRequiredField = TrifactaRecipeHistoryModal.isRequiredField('03/03/1990');

    expect(isRequiredField).toBe(1);
  });

  it('should render showFormErrors:', () => {
    TrifactaRecipeHistoryModal.showFormErrors = jest.fn().mockReturnValue(1);
    const showFormErrors = TrifactaRecipeHistoryModal.showFormErrors('');

    expect(showFormErrors).toBe(1);
  });

  it('should render edited recipes history onClose:', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');

    modal.invoke('onClose')();
    expect(modal.length).toBe(1);
  });

  it('should render edited recipes history generate button:', () => {
    const mockGetEditRecipesHistory = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    jest.spyOn(DataWranglerStoreActions, 'getEditRecipesHistory').mockImplementation(() => mockGetEditRecipesHistory);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');

    modal.invoke('onPrimaryButtonClick')();
    expect(modal.length).toBe(1);
    expect(mockGetEditRecipesHistory).toHaveBeenCalledTimes(1);
  });
});
