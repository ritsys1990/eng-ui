import React, * as ReactHooks from 'react';
import CreateNewDataModel from './CreateNewDataModel';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { tags } from '../../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import { DM_FORM_STATE, DM_INITIAL_STATE } from '../../../constants/constants';
import {
  commonDMsMock,
  cdmsMapMock,
} from '../../../../../../store/contentLibrary/commonDataModels/tests/commonDMs.mock';
import { act } from 'react-test-renderer';

const setUp = (props = {}) => {
  return shallow(<CreateNewDataModel {...props} />);
};

const COMPONENT_NAME = 'CREATE_NEW_DM_MODAL';

window.scrollTo = jest.fn();

describe('Create Data Modal', () => {
  let store;
  const mockSetState = jest.fn();
  let useEffectFn;
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isDMUpdating: false,
      }),
      bundles: ImmutableMap({
        tagsPublishedList: tags,
        fetchingTagsPublished: false,
      }),
      commonDatamodels: ImmutableMap({
        isFetchingCDMs: false,
        isUpdatingCDM: false,
        commonDatamodels: commonDMsMock,
        isFetchingMappedDMs: false,
        mappedDMs: [],
        cdmsMap: cdmsMapMock,
      }),
      errors: ImmutableMap({
        dmFieldErrors: [],
      }),
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render the view', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const inputNameTech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldNameTech`);
    expect(inputNameTech.length).toBe(1);
  });

  it('should render the Description Element', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const descriptionElement = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldDescription`);
    descriptionElement.invoke('onChange')({ currentTarget: { value: 'test' } });
    expect(descriptionElement.length).toBe(1);
  });

  it('should call onchange methods on edit', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: false,
    });
    const inputNametech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldNameTech`);
    inputNametech.invoke('onChange')({ currentTarget: { value: 'test' } });
    const inputNameNontech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldNameNonTech`);
    inputNameNontech.invoke('onChange')({ currentTarget: { value: 'test' } });
    const inputTableAlias = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TableAlias`);
    inputTableAlias.invoke('onChange')({ currentTarget: { value: 'test' } });
    const inputDesc = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldDescription`);
    inputDesc.invoke('onChange')({ currentTarget: { value: 'test' } });
    expect(mockFn).toHaveBeenCalledTimes(8);
  });

  it('should render the Alerthub', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const alertHubElement = wrapper.find('AlertHub');
    const alertHubElementProps = alertHubElement.getElements()[0].props;
    act(() => {
      alertHubElementProps.onClose();
    });
    expect(alertHubElement.length).toBe(1);
  });

  it('should render the Radio Buttons', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const radioElement = wrapper.find('Radio');
    const radioElementProps = radioElement.getElements()[0].props;
    act(() => {
      radioElementProps.onOptionSelected();
    });
    expect(radioElement.length).toBe(2);
  });

  it('should render the CommonDataModels Select', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const commonDataModelsElement = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldCommonDataModels`);
    commonDataModelsElement.invoke('onInputChange')(false);
    commonDataModelsElement.invoke('onInputChange')(true);
    expect(commonDataModelsElement.length).toBe(1);
  });

  it('should render the Tags Element', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const tagsElement = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Tags`);
    expect(tagsElement.length).toBe(1);
  });

  it('should render the Table Alias Element', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    const tableAliasElement = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TableAlias`);
    expect(tableAliasElement.length).toBe(1);
  });

  it.skip('should call useEffect for isAddDM', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      loading: false,
      formState: DM_FORM_STATE,
      formValue: DM_INITIAL_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      dataInstance: 'TEST',
      isModalOpen: true,
      isAddDM: true,
    });
    wrapper.setProps({ isAddDM: false });
    wrapper.update();
    expect(useEffectFn).toHaveBeenCalledTimes(6);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
