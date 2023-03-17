import React, * as ReactHooks from 'react';
import WorkPaperInputData from './WorkPaperInputData';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from '../../hooks/useNavContext';
import LANGUAGE_DATA from '../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const CONTINUE_BUTTON_COMPONENT_NAME = 'WorkPaperInputData-Continue';

const setUp = (props = {}) => {
  return shallow(<WorkPaperInputData {...props} />);
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

describe('Trifacta Input Data View Page', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      isFetchingInputData: false,
      input: ImmutableMap({ name: 'testdata' }),
      workpaper: ImmutableMap({ id: '343434-fdfdf-55353f-fsf53-dsdsf' }),
      wpProcess: {
        general: ImmutableMap({
          workpaper: ImmutableMap({ engagementId: 'ewewe-rwerw-42424-fsfs-4224' }),
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
          input: ImmutableMap({
            id: '32323f-fsfsfs-43442-dsdsd',
          }),
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

  it.skip('should render input data file', () => {
    const wrapper = setUp();
    const file = findByInstanceProp(wrapper, 'WorkPaperInputData-FilePreview', 'FilePreview');
    expect(useSelectorFn).toHaveBeenCalledTimes(5);
    expect(useEffect).toHaveBeenCalledTimes(2);
    expect(file.length).toBe(1);
  });

  it.skip('should not render see more option when row count < 200', () => {
    const wrapper = setUp();
    const seeMoreButton = findByInstanceProp(wrapper, 'WorkPaperInputData-SeeMore', 'Button');
    expect(seeMoreButton.length).toBe(0);
  });

  it.skip('should render back to workpaper button', () => {
    const wrapper = setUp();
    const continueButton = findByInstanceProp(wrapper, CONTINUE_BUTTON_COMPONENT_NAME, 'Button');
    expect(continueButton.length).toBe(1);
  });

  it.skip('Redirects to WP on click', () => {
    const wrapper = setUp();
    const continueButton = findByInstanceProp(wrapper, CONTINUE_BUTTON_COMPONENT_NAME, 'Button');
    continueButton.invoke('onClick')(CONTINUE_BUTTON_COMPONENT_NAME);
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
