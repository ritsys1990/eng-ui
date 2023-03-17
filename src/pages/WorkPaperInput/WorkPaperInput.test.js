import React, * as ReactHooks from 'react';
import WorkPaperInput from './WorkPaperInput';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from '../../hooks/useNavContext';
import LANGUAGE_DATA from '../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const COMPONENT_NAME = 'WorkPaperInput';

const mockWorkpaperId = '343434-fdfdf-55353f-fsf53-dsdsf';
const mockEngagementId = 'ewewe-rwerw-42424-fsfs-4224';
const mockInputId = 'sdsd434-rerr34-43434-r3432';

const CONTINUE_BUTTON = 'WorkPaperInput-Continue';

const setUp = (props = {}) => {
  return shallow(<WorkPaperInput {...props} />);
};

window.scrollTo = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { inputId: '12345', workpaperId: '212vv-dsdsd-4dsdsd-dsdsds' };
  }),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Mapping Page', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      isFetchingInputData: false,

      workpaper: ImmutableMap({ id: mockWorkpaperId, status: 'Draft' }),
      wpProcess: {
        general: ImmutableMap({
          workpaper: ImmutableMap({ engagementId: mockEngagementId }),
          readOnlyfromWP: false,
        }),
        step1: ImmutableMap({
          inputDetails: ImmutableMap({
            data: [
              ['tax_1', 'tax_2'],
              ['1', '10'],
              ['2', '11'],
            ],
          }),
          existingMappings: [{ source: 't1', target: 'tax_1' }],
          input: {
            id: mockInputId,
            name: 'testdata',
            error: {
              code: 'automap_failed',
            },
            mappings: [
              { source: '', target: 'tax_1', automap: true },
              { source: '', target: 'tax_2', automap: true },
            ],
            fileSchema: ['tax_1', 'tax_2'],
          },
          isLoading: false,
        }),
      },
    });
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
    store.clearActions();
  });

  it.skip('should render page title', () => {
    setUp();
    expect(document.title).toContain('Omnia Cortex');
  });

  it.skip('should render input file', () => {
    const wrapper = setUp();
    const file = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FilePreview`, 'FilePreview');
    expect(useSelectorFn).toHaveBeenCalled();
    expect(useEffect).toHaveBeenCalled();
    expect(file.length).toBe(1);
  });

  it('should render back to workpaper button', () => {
    const wrapper = setUp();
    const continueButton = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Continue`, 'Button');
    expect(continueButton.length).toBe(1);
  });

  it('should render toggle mapping', () => {
    const wrapper = setUp();
    const toggle = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Toggle');
    expect(toggle.length).toBe(1);
  });

  /* it('should render mapping select', () => {
     const wrapper = setUp();
     const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-MappingSelect`, 'MappingSelect');
     expect(select.length).toBe(1);
     select.invoke('onFieldChange')(`${COMPONENT_NAME}-MappingSelect`);
   });
 */
  it.skip('should render set existing button', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SetExisting`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')(`${COMPONENT_NAME}-SetExisting`);
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should render refresh button', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Refresh`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')(`${COMPONENT_NAME}-Refresh`);
  });

  it('Opens continue modal', () => {
    const wrapperModal = setUp();
    const continueButton = findByInstanceProp(wrapperModal, `${COMPONENT_NAME}-Continue`, 'Button');
    continueButton.invoke('onClick')(CONTINUE_BUTTON);
    const modal = findByInstanceProp(wrapperModal, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')(`${COMPONENT_NAME}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Mapping Page with no mapping errors', () => {
  let store;

  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      isFetchingInputData: false,
      workpaper: ImmutableMap({ id: mockWorkpaperId, status: 'Draft' }),
      wpProcess: {
        general: ImmutableMap({
          workpaper: ImmutableMap({ engagementId: mockEngagementId }),
          readOnlyfromWP: false,
        }),
        step1: ImmutableMap({
          inputDetails: ImmutableMap({
            data: [
              ['tax_1', 'tax_2'],
              ['1', '10'],
              ['2', '11'],
            ],
          }),
          input: {
            id: mockInputId,
            name: 'testdata',
            existingMapping: {},
            mappings: [
              { source: '', target: 'tax_1', automap: false },
              { source: '', target: 'tax_2', automap: false },
            ],
          },
          isLoading: false,
          readOnlyfromWP: true,
          isCentralizedDSUpdated: true,
        }),
      },
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
    store.clearActions();
  });

  it('should redirect to WP', () => {
    const wrapperRedirect = setUp();
    const continueButton = findByInstanceProp(wrapperRedirect, `${COMPONENT_NAME}-Continue`, 'Button');
    continueButton.invoke('onClick')(CONTINUE_BUTTON);
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });
});

describe('Mapping Page with errors during centralized data update', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      isFetchingInputData: false,
      workpaper: ImmutableMap({ id: mockWorkpaperId, status: 'Draft', isDMT: true }),
      wpProcess: {
        general: ImmutableMap({
          workpaper: ImmutableMap({ engagementId: mockEngagementId }),
          readOnlyfromWP: false,
        }),
        step1: ImmutableMap({
          inputDetails: ImmutableMap({
            data: [
              ['tax_1', 'tax_2'],
              ['1', '10'],
              ['2', '11'],
            ],
          }),
          input: {
            id: mockInputId,
            name: 'testdata',
            error: ImmutableMap({
              code: 'automap_failed',
            }),
            existingMapping: {},
            mappings: [
              { source: '', target: 'tax_1', automap: false },
              { source: '', target: 'tax_2', automap: false },
            ],
          },
          isLoading: false,
          readOnlyfromWP: true,
          isCentralizedDSUpdated: true,
        }),
      },
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
    store.clearActions();
  });

  it.skip('should set readonly false', () => {
    setUp();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should redirect to WP for DMT', () => {
    const wrapperWp = setUp();
    const continueButton = findByInstanceProp(wrapperWp, `${COMPONENT_NAME}-Continue`, 'Button');
    continueButton.invoke('onClick')(CONTINUE_BUTTON);
    expect(mockHistoryPush).toHaveBeenCalledTimes(2);
  });
});

describe('Mapping Page with other errors', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      isFetchingInputData: false,
      workpaper: ImmutableMap({ id: mockWorkpaperId, status: 'Draft', bundleTransformation: true }),
      wpProcess: {
        general: ImmutableMap({
          workpaper: ImmutableMap({ engagementId: mockEngagementId }),
          readOnlyfromWP: false,
        }),
        step1: ImmutableMap({
          inputDetails: ImmutableMap({
            data: [
              ['tax_1', 'tax_2'],
              ['1', '10'],
              ['2', '11'],
            ],
          }),
          input: {
            id: mockInputId,
            name: 'testdata',
            error: ImmutableMap({
              code: 'data_error',
            }),
            existingMapping: {},
            mappings: [
              { source: '', target: 'tax_1', automap: false },
              { source: '', target: 'tax_2', automap: false },
            ],
          },
          isLoading: false,
          readOnlyfromWP: true,
          isCentralizedDSUpdated: true,
        }),
      },
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
    store.clearActions();
  });

  it.skip('should set showUnmapped true', () => {
    setUp();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });
  it('should redirect to WP for Bundle Transformation', () => {
    const wrapperContinue = setUp();
    const continueButton = findByInstanceProp(wrapperContinue, `${COMPONENT_NAME}-Continue`, 'Button');
    continueButton.invoke('onClick')(CONTINUE_BUTTON);
    expect(mockHistoryPush).toHaveBeenCalledTimes(3);
  });
});
