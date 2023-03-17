import React, * as ReactHooks from 'react';
import IngestStatusModal from './IngestStatusModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import { dmtsIngestionMock } from '../../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<IngestStatusModal {...props} />);
};

window.scrollTo = jest.fn();

describe('Ingest DMTs Status Modal', () => {
  let store;
  const mockSetState = jest.fn();
  const mockFn = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isFetchingDMTsIngestStatus: false,
        dmtsIngestionStatus: dmtsIngestionMock,
      }),
    });

    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
  });

  it('should render the ingest dmts list in the modal', () => {
    const wrapper = setUp({
      handleClose: mockFn,
      isOpen: true,
      selectedDM: { nameTech: 'test', bundleBaseName: 'bundlebaseName' },
    });
    const modal = findByInstanceProp(wrapper, `INGEST_STATUS-Modal`);
    expect(modal.length).toBe(1);
  });

  it('should call handle close', () => {
    const wrapper = setUp({
      handleClose: mockFn,
      isOpen: true,
      selectedDM: { nameTech: 'test' },
      ingestType: 'DMT',
    });
    const modal = findByInstanceProp(wrapper, `INGEST_STATUS-Modal`);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockFn).toBeCalled();
  });

  it('should show empty dmts state view in the modal', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isFetchingDMTsIngestStatus: false,
        dmtsIngestionStatus: [],
      }),
    });
    const wrapper = setUp({
      handleClose: mockFn,
      isOpen: true,
      selectedDM: { nameTech: 'test' },
    });
    const stateview = findByInstanceProp(wrapper, `INGEST_STATUS-DMTIngestion-NoRecords`);
    expect(stateview.length).toBe(1);
  });

  it('should all the headers for ingest status modal', () => {
    const wrapper = setUp({ handleClose: mockFn, isOpen: true, selectedDM: { nameTech: 'test' } });
    const table = findByInstanceProp(wrapper, `INGEST_STATUS-Table`);
    const renderTableForType = table.prop('headers')?.find(x => x.key === 'type')?.render;
    const rows = dmtsIngestionMock;
    shallow(renderTableForType(null, rows));
    const renderTableForName = table.prop('headers')?.find(x => x.key === 'name')?.render;
    shallow(renderTableForName(null, rows));
    const renderTableForStatus = table.prop('headers')?.find(x => x.key === 'status')?.render;
    shallow(renderTableForStatus(null, rows));
    const renderTableForfromEnv = table.prop('headers')?.find(x => x.key === 'fromEnv')?.render;
    shallow(renderTableForfromEnv(null, rows));
    const renderTableForfromError = table.prop('headers')?.find(x => x.key === 'errorMessage')?.render;
    shallow(renderTableForfromError(null, rows));
    expect(table.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
