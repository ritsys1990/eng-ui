import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import ModalIngestDMT from './ModalIngestDMT';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import { initialState as errorInitialState } from '../../../../../../store/errors/reducer';

const setUp = (props = {}) => {
  return shallow(<ModalIngestDMT {...props} />);
};

window.scrollTo = jest.fn();

describe('Ingest DMTs Status Modal', () => {
  let store;
  let mockSetState;
  let useDispatchFn;
  const mockCloseFn = jest.fn();

  const mockedProps = {
    ingestDMTOpen: true,
    handleIngestDMTModal: mockCloseFn,
    activeDMT: {
      bundleBaseId: 'cd098e54-2d26-4c00-aa6a-d829dd23b74a',
      bundleId: '594de46d-a8d8-4540-9e1b-5a274ef7636e',
      bundleName: '463686_bundle',
      sourceSystemName: 'Oracle Financials',
      sourceVersionId: 'f5c95d03-6a58-46eb-acf9-3d397c1415ab',
      sourceVersionName: 'R12',
    },
  };

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        allEnvironments: [],
        selectIngestDMTErrors: [],
        environmentContentDMT: [{}],
        isFetchingEnvironments: true,
        isFetchingEnvContent: false,
        isIngestingDMT: false,
      }),
      security: ImmutableMap({
        me: {
          email: '123@123',
        },
      }),
      errors: errorInitialState,
    });

    mockSetState = jest.fn();
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
  });

  it('should render the ingest dmts list in the modal', () => {
    const wrapper = setUp({ ...mockedProps });
    const modal = findByInstanceProp(wrapper, `CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT-DMT_INGEST-MODAL`);
    expect(modal.length).toBe(1);
  });

  it('should close errors', () => {
    const wrapper = setUp({ ...mockedProps });
    const alert = findByInstanceProp(
      wrapper,
      `CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT-DMT_INGEST-MODAL-ALERTHUB`
    );
    alert.prop('onClose');
    expect(useDispatchFn).toBeCalled();
  });

  it('should fetch ENV Content', () => {
    const wrapper = setUp({ ...mockedProps });
    const select = findByInstanceProp(
      wrapper,
      `CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT-DMT_INGEST-MODAL-BODY-DMT-SELECT`
    );
    select.invoke('onChange')([{ name: 'dev1' }]);
    expect(useDispatchFn).toBeCalled();
  });

  it('should close the modal', () => {
    const wrapper = setUp({ ...mockedProps });
    const modal = findByInstanceProp(wrapper, `CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT-DMT_INGEST-MODAL`);
    modal.prop('onClose')();
    expect(mockCloseFn).toBeCalled();
  });

  it('should handle ingest DMT', () => {
    const wrapper = setUp({ ...mockedProps });
    const modal = findByInstanceProp(wrapper, `CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT-DMT_INGEST-MODAL`);
    modal.prop('onPrimaryButtonClick')();
    expect(useDispatchFn).toBeCalled();
  });

  it('should handle ingest SBT', () => {
    const value = [{ trifactaTransformationId: '123' }, { trifactaTransformationId: '234' }];
    jest
      .spyOn(ReactHooks, 'useState')
      .mockReturnValueOnce([value, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([true, mockSetState]);

    const wrapper = setUp({ ...mockedProps });
    const modal = findByInstanceProp(wrapper, `CL_DATAMODEL_TRANSFORMATIONS_MODAL_INGEST_DMT-DMT_INGEST-MODAL`);
    modal.prop('onPrimaryButtonClick')();
    expect(useDispatchFn).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
