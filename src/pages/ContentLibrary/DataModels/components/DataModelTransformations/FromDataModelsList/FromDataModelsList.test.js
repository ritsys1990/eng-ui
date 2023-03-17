import React, * as ReactHooks from 'react';
import FromDataModelsList from './FromDataModelsList';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import {
  datamodelsMock,
  dmtsList,
  tags,
  dmMappingMock,
  dmtsMock,
} from '../../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import * as CheckAuthHooks from '../../../../../../hooks/useCheckAuth';
import { PagePermissions } from '../../../../../../utils/permissionsHelper';
import { MAPPING_MODAL_TYPE } from '../../../constants/constants';

const setUp = (props = {}) => {
  return shallow(<FromDataModelsList {...props} />);
};

window.scrollTo = jest.fn();

const COMPONENT_NAME = 'CL_FROM_DATAMODELS_LIST';
const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  contentLibraryDMs: ImmutableMap({
    isFetchingDMTsFromDM: false,
    dmtsList,
    security: ImmutableMap({ engagementPermissions: [] }),
    dmMapping: [],
    dmMappingError: [],
  }),
  dmtMappingModalRows: dmtsList[0],
};

const datamodelsList = datamodelsMock.datamodels.items;

const mockUseStateWithDM = (initial, mockSetState) => {
  if (typeof initial === 'boolean') {
    return [true, mockSetState];
  } else if (typeof initial === 'string') {
    return [MAPPING_MODAL_TYPE.DM_MAPPING, mockSetState];
  }

  return [initial, mockSetState];
};

describe('Content Library From Data Models List Page', () => {
  let store;
  let state;
  let useDispatchFn;
  let mockSetState;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    const permissions = {};
    permissions[PagePermissions.CONTENT_LIBRARY_DATA_MODELS] = true;
    permissions.dataModels = { update: true };
    mockSetState = jest.fn().mockImplementation(() => {});

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      } else if (typeof initial === 'string') {
        return [MAPPING_MODAL_TYPE.DMT_MAPPING, mockSetState];
      }

      return [initial, mockSetState];
    });
  });

  it('should render', () => {
    const wrapper = setUp({ datamodelsList });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    expect(table.length).toBe(1);
  });

  it('should render fields nameTech and description', () => {
    const wrapper = setUp({ datamodelsList });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable1 = table.prop('headers')?.find(x => x.key === 'nameTech')?.render;
    const rows = datamodelsList;
    const nameComp = shallow(renderTable1(null, rows));
    expect(nameComp.exists()).toBe(true);
    const renderTable2 = table.prop('headers')?.find(x => x.key === 'description')?.render;
    const descriptionComp = shallow(renderTable2(null, rows));
    expect(descriptionComp.exists()).toBe(true);
  });

  it('should render fields mappings and tagIds', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'mappings')?.render;
    const rows = datamodelsList;
    const mappingsComp = shallow(renderTable(null, rows));
    expect(mappingsComp.exists()).toBe(true);
    const renderTableType = table.prop('headers')?.find(x => x.key === 'tagIds')?.render;
    const tagIdsComp = shallow(renderTableType(null, rows));
    expect(tagIdsComp.exists()).toBe(true);
  });

  it('should render more options and add DMT', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'menu')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const moreMenu = shallow(renderTable(null, rows));
    const menuBtn = moreMenu.find('Button');
    const e = {
      stopPropagation: jest.fn(),
      current: true,
    };
    menuBtn.invoke('onClick')(e, rows[0], true);
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    contextMenu.invoke('onOptionClicked')({ id: 'add' });
    expect(contextMenu.exists()).toBe(true);
  });

  it('should render more options and edit DMT', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'menu')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const moreMenu = shallow(renderTable(null, rows));
    const menuBtn = moreMenu.find('Button');
    const e = {
      stopPropagation: jest.fn(),
      current: true,
    };
    menuBtn.invoke('onClick')(e, rows[0], false);
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    contextMenu.invoke('onOptionClicked')({ id: 'edit' });
    expect(contextMenu.exists()).toBe(true);
  });

  it.skip('should render AddDMTModal', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const dmtModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddDMTModal`);
    dmtModal.invoke('handleSubmit')({ dmtInputName: 'test' });
    dmtModal.invoke('handleClose')({});
    expect(useDispatchFn).toHaveBeenCalled();
  });

  it('should render onRowClick', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    table.invoke('onExpandItemClick')(0, datamodelsList);
    expect(useDispatchFn).toHaveBeenCalled();
  });

  it('should render innerDMTs', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const innerTemplate = table.invoke('renderInnerTemplate')();
    const innerTemplateWrapper = shallow(innerTemplate);
    expect(innerTemplateWrapper.length).toBe(1);
  });

  it.skip('should render DMT mappedTo Table when Map Count is greater than 0', () => {
    state = {
      ...state,
      contentLibraryDMs: state.contentLibraryDMs.merge({
        dmMapping: [...dmMappingMock],
      }),
    };
    store = configureStore([thunk])(() => state);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      } else if (typeof initial === 'string') {
        return [MAPPING_MODAL_TYPE.DMT_MAPPING, mockSetState];
      } else if (Array.isArray(initial)) {
        return [[{ id: 1 }], mockSetState];
      }

      return [initial, mockSetState];
    });

    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const dmtMappedTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Mapped-DM-Table`);
    const rows = datamodelsList;

    const headersCol = ['nameTech', 'description', 'currentState'];

    headersCol.forEach(eachCol => {
      const renderCol = dmtMappedTable.prop('headers')?.find(x => x.key === eachCol)?.render;
      const colComp = shallow(renderCol(rows[0], rows));
      expect(colComp.exists()).toBe(true);
    });

    expect(dmtMappedTable.length).toBe(1);
  });

  it.skip('should not render DMT mappedTo Table when Map Count that is less than 1', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      } else if (typeof initial === 'string') {
        return [MAPPING_MODAL_TYPE.DMT_MAPPING, mockSetState];
      } else if (Array.isArray(initial)) {
        return [[], mockSetState];
      }

      return [initial, mockSetState];
    });

    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const noRecordStateView = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DMTMappingModalBody_NoData`);
    expect(noRecordStateView.length).toBe(1);
  });

  it.skip('should close rendered DMT mappedTo Modal onClick cancel', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const mappedToModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-MappingModal`);
    expect(mappedToModal.length).toBe(1);
    mappedToModal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render not DM mappedFrom Modal when Map Count that is less than 1', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return mockUseStateWithDM(initial, mockSetState);
    });

    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const noDataStateView = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DMMappingModalBody_NoData`);
    expect(noDataStateView.length).toBe(1);
  });

  it.skip('should render DM mappedFrom Modal when Map Count that is greater than 0', () => {
    state = {
      ...state,
      contentLibraryDMs: state.contentLibraryDMs.merge({
        dmMapping: [...dmMappingMock],
      }),
    };
    store = configureStore([thunk])(() => state);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return mockUseStateWithDM(initial, mockSetState);
    });

    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const dmMappedToBody = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DMMappingModalBody-Flex`);
    expect(dmMappedToBody.length).toBe(1);
  });

  it.skip('should render Alert hub in case of Error', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return mockUseStateWithDM(initial, mockSetState);
    });

    const wrapper = setUp({ datamodelsList, tagsList: tags.items[0].tags });
    const dmMappedToBody = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DM_Mapping_Alert`);
    expect(dmMappedToBody.length).toBe(1);
  });

  it.skip('should render open DM Mapping modal', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'mappings')?.render;
    const rows = datamodelsList;
    const mappingsComp = shallow(renderTable(null, rows));
    mappingsComp.invoke('onClick')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should render open DM Mapping modal for inner table', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const innerTemplate = table.invoke('renderInnerTemplate')();
    const innerTemplateWrapper = shallow(innerTemplate);
    const innerTable = findByInstanceProp(innerTemplateWrapper, `${COMPONENT_NAME}-FromDataModelsListing-InnerTable`);
    const rows = dmtsMock;
    const innerTableCols = ['workpaperSource', 'name', 'creationDate', 'outputs', 'tagIds'];

    innerTableCols.forEach(eachColumn => {
      const renderEachCol = innerTable.prop('headers')?.find(x => x.key === eachColumn)?.render;
      const colComp = shallow(renderEachCol(null, rows));
      expect(colComp.exists()).toBe(true);
    });

    const renderContextMenuOpt = innerTable.prop('headers')?.find(x => x.key === '')?.render;
    const CMOComp = shallow(renderContextMenuOpt(null, rows));
    expect(CMOComp.exists()).toBe(true);
    const innerButton = findByInstanceProp(CMOComp, `${COMPONENT_NAME}-ContextMenu`);
    const e = {
      stopPropagation: jest.fn(),
      current: true,
    };
    innerButton.invoke('onClick')(e, rows[0], false);
    expect(mockSetState).toHaveBeenCalled();

    const renderOutputs = innerTable.prop('headers')?.find(x => x.key === 'outputs')?.render;
    const ouptupComp = shallow(renderOutputs(null, rows));
    expect(ouptupComp.exists()).toBe(true);
    ouptupComp.invoke('onClick')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should call handle DMT configure', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    table.invoke('isRowExpandable')();
    const innerTemplate = table.invoke('renderInnerTemplate')();
    const innerTemplateWrapper = shallow(innerTemplate);
    const innerTable = findByInstanceProp(innerTemplateWrapper, `${COMPONENT_NAME}-FromDataModelsListing-InnerTable`);
    const renderTable = innerTable.prop('headers')?.find(x => x.key === 'tagIds')?.render;
    const rows = dmtsMock;
    const mappingsComp = shallow(renderTable(null, rows));
    mappingsComp.invoke('onClick')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should render ingest DMT modal', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'menu')?.render;
    const rows = datamodelsMock.datamodels.items[0].fields;
    const moreMenu = shallow(renderTable(null, rows));
    const menuBtn = moreMenu.find('Button');
    const e = {
      stopPropagation: jest.fn(),
      current: true,
    };
    menuBtn.invoke('onClick')(e, rows[0], true);
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ContextMenu`);
    contextMenu.invoke('onOptionClicked')({ id: 'INGEST_DMT' });
    const ingestModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Ingest_SelectorModal`);
    ingestModal.invoke('handleSubmit')('dev1', dmtsMock[0]);
    expect(ingestModal.length).toBe(1);
  });

  it.skip('should render open Ingest DMT status modal', () => {
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    const renderTable = table.prop('headers')?.find(x => x.key === 'id')?.render;
    const rows = datamodelsList;
    const dmtStatusComp = shallow(renderTable(null, rows));
    dmtStatusComp.invoke('onClick')();
    const ingestStatusModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Ingest_StatusModal`);
    ingestStatusModal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should render ingest DMT modal', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      } else if (typeof initial === 'string') {
        return ['dev1', mockSetState];
      } else if (typeof initial === 'object') {
        return [dmtsMock[0], mockSetState];
      }

      return [initial, mockSetState];
    });
    const wrapper = setUp({ datamodelsList, tagsList: tags.items });
    const dmtWarningModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-dmt-name-warning`);
    dmtWarningModal.invoke('onPrimaryButtonClick')();
    dmtWarningModal.invoke('onSecondaryButtonClick')();
    dmtWarningModal.invoke('onClose')();
    expect(mockSetState).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
