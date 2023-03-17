import React, * as ReactHooks from 'react';
import DataModelFieldsList from './DataModelFieldsList';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import { datamodelsMock, fieldTypes } from '../../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import * as CheckAuthHooks from '../../../../../../hooks/useCheckAuth';
import { PagePermissions } from '../../../../../../utils/permissionsHelper';
import * as allHelperFn from '../../../utils/DataModelsHelper';
import { DM_FIELD_INITIAL_STATE, DM_FIELD_FORM_STATE } from '../../../constants/constants';

const setUp = (props = {}) => {
  return shallow(<DataModelFieldsList {...props} />);
};

window.scrollTo = jest.fn();

const COMPONENT_NAME = 'CL_DATAMODEL_FIELDS_LIST';
const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  contentLibraryDMs: ImmutableMap({
    datamodels: datamodelsMock.datamodels.items,
    datamodel: datamodelsMock.datamodels.items[0],
    isDataModelsFetching: false,
    isDMFieldUpdating: false,
    fieldTypes,
    isFetchingFieldTypes: false,
    security: ImmutableMap({ engagementPermissions: [] }),
  }),
};

describe('Content Library Data Models Fields List Page', () => {
  let store;
  let state;
  let useDispatchFn;
  const mockSetState = jest.fn();
  const mockedFormState = { ...DM_FIELD_FORM_STATE, invalid: false };
  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    const permissions = {};
    permissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    permissions.dataModels = { update: true };
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(allHelperFn, 'runFieldAliasValidation').mockImplementation(() => {
      return { isError: false };
    });

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render', () => {
    const wrapper = setUp({ searchText: 'Col' });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    expect(table.length).toBe(1);
  });

  it('should render no records', () => {
    state = {
      ...state,
      contentLibraryDMs: state.contentLibraryDMs.merge({
        datamodel: { id: '0af7568d-b696-49e2-94a3-444a18c1d3cb', fields: [] },
      }),
    };
    const wrapper = setUp();
    const stateView = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-NoRecords`);
    expect(stateView.length).toBe(1);
  });

  it('should render fields nameTech and nameNonTech', () => {
    state = {
      ...state,
      contentLibraryDMs: state.contentLibraryDMs.merge({
        datamodel: datamodelsMock.datamodels.items[0],
      }),
    };
    const wrapper = setUp({ isAddField: true });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    const renderTable1 = table.prop('headers')?.find(x => x.key === 'nameTech')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const nameComp = shallow(renderTable1(null, rows));
    expect(nameComp.exists()).toBe(true);
    const renderTable2 = table.prop('headers')?.find(x => x.key === 'nameNonTech')?.render;
    const nameNonTechComp = shallow(renderTable2(null, rows));
    expect(nameNonTechComp.exists()).toBe(true);
  });

  it('should render fields description, aliases and type', () => {
    const wrapper = setUp({ isAddField: true });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'description')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const descComp = shallow(renderTable(null, rows));
    expect(descComp.exists()).toBe(true);
    const renderTableType = table.prop('headers')?.find(x => x.key === 'type')?.render;
    const fieldTypeComp = shallow(renderTableType(null, rows));
    expect(fieldTypeComp.exists()).toBe(true);
    const renderTableAliases = table.prop('headers')?.find(x => x.key === 'aliases')?.render;
    const aliasesComp = shallow(renderTableAliases(null, rows));
    expect(aliasesComp.exists()).toBe(true);
  });

  it('should render fields key and mandatory', () => {
    const wrapper = setUp({ isAddField: true });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'isKey')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const keyComp = shallow(renderTable(null, rows));
    expect(keyComp.exists()).toBe(true);
    const renderTableType = table.prop('headers')?.find(x => x.key === 'isMandatory')?.render;
    const mandatoryComp = shallow(renderTableType(null, rows));
    expect(mandatoryComp.exists()).toBe(true);
  });

  it('should render more options', () => {
    const wrapper = setUp({ isAddField: true, showFieldModal: jest.fn() });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'menu')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const moreMenu = shallow(renderTable(null, rows));
    const menuBtn = moreMenu.find('Button');
    const e = {
      stopPropagation: jest.fn(),
      current: true,
    };
    menuBtn.invoke('onClick')(e, rows[0]);
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    contextMenu.invoke('onOptionClicked')({ id: '' });
    expect(contextMenu.exists()).toBe(true);
    contextMenu.invoke('onOptionClicked')({ id: 'edit' });
    expect(contextMenu.exists()).toBe(true);
  });

  it('should render more options delete', () => {
    const wrapper = setUp({ isAddField: true, showFieldModal: jest.fn() });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'menu')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const moreMenu = shallow(renderTable(null, rows));
    const menuBtn = moreMenu.find('Button');
    const e = {
      stopPropagation: jest.fn(),
      current: true,
    };
    menuBtn.invoke('onClick')(e, rows[0]);
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    contextMenu.invoke('onOptionClicked')({ id: 'delete' });
    const deleteConfirm = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Delete-Warning`);
    deleteConfirm.invoke('onPrimaryButtonClick')();
    deleteConfirm.invoke('onSecondaryButtonClick')();
    expect(deleteConfirm.exists()).toBe(true);
  });

  it('should render AddFieldModal', () => {
    jest.spyOn(allHelperFn, 'runFieldAliasValidation').mockImplementation(() => {
      return { isError: false };
    });

    const wrapper = setUp({ isAddField: true, isFieldModalShown: true });
    const fieldModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Field_modal`);
    fieldModal.invoke('handleChanges')({});
    fieldModal.invoke('handleFormState')({}, false);
    fieldModal.invoke('handlePrimaryButtonClick')(datamodelsMock.datamodels.items[0].fields[1]);
    expect(useDispatchFn).toHaveBeenCalled();
  });

  it('should render innerTable Component', () => {
    const mockedRow = datamodelsMock.datamodels.items[0];
    const wrapper = setUp({ isAddField: true });
    const topTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DataModelsFieldsList-TopTable`);
    topTable.prop('isRowExpandable')();
    const renderInnerFn = topTable.prop('renderInnerTemplate');
    const renderInnerTableWrapper = shallow(renderInnerFn(mockedRow));
    const innerTableComp = findByInstanceProp(
      renderInnerTableWrapper,
      `${COMPONENT_NAME}-DataModelsFieldsList-Inner-InnerTable`
    );
    const renderTable1 = innerTableComp.prop('headers')?.find(x => x.key === 'isTimeFilter')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const nameComp = shallow(renderTable1(null, rows));
    expect(nameComp.exists()).toBe(true);
  });

  it('should render Validation error', () => {
    jest
      .spyOn(ReactHooks, 'useState')
      .mockReturnValueOnce([mockedFormState, mockSetState])
      .mockReturnValueOnce([null, mockSetState])
      .mockReturnValueOnce([DM_FIELD_INITIAL_STATE, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce([[], mockSetState]);
    jest.spyOn(allHelperFn, 'runFieldAliasValidation').mockImplementation(() => {
      return { isError: true };
    });
    const wrapper = setUp({});
    const fieldModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add-Field_modal`);
    fieldModal.invoke('handlePrimaryButtonClick')(datamodelsMock.datamodels.items[0].fields[1]);
    expect(useDispatchFn).toHaveBeenCalledTimes(2);
  });

  it('should close the popover Menu', () => {
    const wrapper = setUp({});
    const popoverProps = findByInstanceProp(wrapper, `${COMPONENT_NAME}-MenuOpover`).getElements()[0].props;
    popoverProps.onClose();
    wrapper.update();
    expect(findByInstanceProp(wrapper, `${COMPONENT_NAME}-MenuOpover`).getElements()[0].props.isOpen).toBe(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
