import React, * as ReactHooks from 'react';
import AddDataModelModal from './AddDataModelModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { tags, datamodelsMock } from '../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import { cdmsMapMock } from '../../../../../store/contentLibrary/commonDataModels/tests/commonDMs.mock';
import { act } from 'react-test-renderer';
import { DM_INITIAL_STATE, NEW_DM_TYPES } from '../../constants/constants';

const setUp = (props = {}) => {
  return shallow(<AddDataModelModal {...props} />);
};

window.scrollTo = jest.fn();

describe('Add Data Model Modal', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      bundles: ImmutableMap({
        tagsList: tags,
        isTagsLoading: false,
      }),
      contentLibraryDMs: ImmutableMap({
        isIngestingDataModel: false,
      }),
      commonDatamodels: ImmutableMap({
        cdmsMap: cdmsMapMock,
      }),
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render the view', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: true,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const modal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-Modal`);
    expect(modal.length).toBe(1);
  });

  it.skip('should validate setState', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    wrapper.update();
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  it.skip('should invoke handleSubmit with case 0', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const modal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-Modal`);
    const modalProps = modal.getElements()[0].props;
    act(() => {
      modalProps.onPrimaryButtonClick();
    });
    expect(modal.length).toBe(1);
  });

  it.skip('should invoke handleSubmit with case 1 - Create with invalid form', () => {
    const mockFn = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === 0) {
        return [1, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const modal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-Modal`);
    const modalProps = modal.getElements()[0].props;
    act(() => {
      modalProps.onPrimaryButtonClick();
    });
    const createModal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-CreateNewDataModel`);
    act(() => {
      createModal.getElements()[0].props.handlePrimaryButtonClick();
      createModal.getElements()[0].props.handleChanges(DM_INITIAL_STATE);
      createModal.getElements()[0].props.handleFormState(DM_INITIAL_STATE, true);
      createModal.getElements()[0].props.handleFormState(DM_INITIAL_STATE, false);
      createModal.getElements()[0].props.handleClose();
    });
    expect(createModal.length).toBe(1);
  });

  it.skip('should invoke handleSubmit with case 1 - Create with valid form', () => {
    const mockFn = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === 0) {
        return [1, mockSetState];
      } else if (initial?.invalid) {
        return [{ invalid: false, value: datamodelsMock.datamodels.items[0] }, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const modal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-Modal`);
    modal.invoke('onPrimaryButtonClick')();
    const createModal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-CreateNewDataModel`);
    createModal.invoke('handleChanges')();
    createModal.invoke('handlePrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should invoke handleSubmit with case 2 - Upload', () => {
    const mockFn = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === 0) {
        return [2, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const modal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-Modal`);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledTimes(3);
  });

  it.skip('should invoke handleSubmit with case 3 - Ingest', () => {
    const mockFn = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (initial === 0) {
        return [3, mockSetState];
      } else if (initial?.nameTech === '') {
        return [{ nameTech: datamodelsMock.datamodels.items[0] }, mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const modal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-Modal`);
    modal.invoke('onPrimaryButtonClick')();
    const ingestModal = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-ModalIngestContent`);
    ingestModal.invoke('handleChanges')();
    expect(mockSetState).toHaveBeenCalledTimes(4);
  });

  it('should render AddDataModelOptions with case 0', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      isAddDM: false,
      selectedDM: datamodelsMock.datamodels.items[0],
    });
    const addDataModelOptions = findByInstanceProp(wrapper, `CL_DM_ADD_DM_MODAL-AddDataModelOptions`);
    const addDataModelOptionsProps = addDataModelOptions.getElements()[0].props;
    act(() => {
      addDataModelOptionsProps.onSelected(NEW_DM_TYPES.INGEST);
    });
    expect(addDataModelOptions.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
