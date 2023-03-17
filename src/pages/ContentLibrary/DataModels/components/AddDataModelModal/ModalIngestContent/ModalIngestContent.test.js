import React, * as ReactHooks from 'react';
import ModalIngestContent from './ModalIngestContent';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { DM_FORM_STATE, DM_INITIAL_STATE } from '../../../constants/constants';

const setUp = (props = {}) => {
  return shallow(<ModalIngestContent {...props} />);
};

window.scrollTo = jest.fn();

describe('Ingest Data Model Modal', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      errors: ImmutableMap({
        dmFieldErrors: [
          {
            key: '0',
            type: 'error',
            message: 'sample message',
          },
        ],
      }),
      contentLibraryDMs: ImmutableMap({
        isIngestingDataModel: false,
        allEnvironments: [{ name: 'qas1' }, { name: 'qas' }],
        isFetchingEnvironments: false,
        environmentContent: [],
        isFetchingEnvContent: false,
        ingestingModalContent: {
          dataModelName: 'HELLO_WORLD',
        },
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
      formValue: DM_INITIAL_STATE,
      formState: DM_FORM_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      handlePrimaryButtonClick: mockFn,
    });
    const modal = findByInstanceProp(wrapper, `MODAL_INGEST_CONTENT-env`);
    expect(modal.length).toBe(1);
  });

  it('should render the view with Alerts and close', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      formValue: DM_INITIAL_STATE,
      formState: DM_FORM_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      handlePrimaryButtonClick: mockFn,
    });
    const modal = findByInstanceProp(wrapper, `MODAL_INGEST_CONTENT-AlertHub`);
    modal.invoke('onClose')('errorKey');
    expect(modal.length).toBe(1);
  });

  it('should render the view and change value of environment', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      formValue: DM_INITIAL_STATE,
      formState: DM_FORM_STATE,
      handleChanges: mockFn,
      handleFormState: mockFn,
      handlePrimaryButtonClick: mockFn,
    });
    const modal = findByInstanceProp(wrapper, `MODAL_INGEST_CONTENT-env`);
    const e = { currentTarget: { value: 'qas1' } };
    modal.invoke('onChange')(e);
    expect(modal.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
