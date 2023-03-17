import React, * as ReactHooks from 'react';
import IngestDataModelRenameOptions from './IngestDataModelRenameOptions';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<IngestDataModelRenameOptions {...props} />);
};

window.scrollTo = jest.fn();

describe('Ingest Data Model Rename Modal', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        isIngestingDataModel: false,
        showRenamePopoup: false,
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
      value: '',
      onSelected: mockFn,
      dataInstance: 'TEST',
      setDmRenameValue: mockFn,
      dmRenameValue: 'world',
    });
    const modal = findByInstanceProp(wrapper, `TEST`);
    expect(modal.length).toBe(1);
  });

  it('should render the view with new name input', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      value: 'newName',
      onSelected: mockFn,
      dataInstance: 'TEST',
      setDmRenameValue: mockFn,
      dmRenameValue: 'world',
    });
    const modal = findByInstanceProp(wrapper, `TEST`);
    expect(modal.length).toBe(1);
  });

  it('should render the view with new name input and handle input change', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      value: 'newName',
      onSelected: mockFn,
      dataInstance: 'TEST',
      setDmRenameValue: mockFn,
      dmRenameValue: 'world',
    });
    const modal = findByInstanceProp(wrapper, `TEST-FieldNameTech`);
    const e = { currentTarget: { value: 'qas1' } };
    modal.invoke('onChange')(e);
    expect(modal.length).toBe(1);
  });

  it('should render the view with new name input and an error for empty name', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      value: 'newName',
      onSelected: mockFn,
      dataInstance: 'TEST',
      setDmRenameValue: mockFn,
      dmRenameValue: '',
    });
    const modal = findByInstanceProp(wrapper, `TEST`);
    expect(modal.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
