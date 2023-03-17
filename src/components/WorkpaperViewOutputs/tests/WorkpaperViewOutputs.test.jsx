import React, * as ReactHooks from 'react';
import WorkPaperViewOutputs from '../WorkpaperViewOutputs';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { initialState as wpViewOutputInitialState } from '../../../store/wpViewOutputs/reducer';

const setUp = (props = {}) => {
  const mergedProps = { ...props };

  return shallow(<WorkPaperViewOutputs {...mergedProps} />);
};

window.scrollTo = jest.fn();

const mockData = [
  {
    tagId: '6543-2109-8765-4321',
    tagName: 'tag name mock',
    workpapers: [],
  },
];
const mockIsLoading = false;
const mockError = false;

describe('Wp View Outputs', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpViewOutputs: ImmutableMap({
        data: wpViewOutputInitialState.merge({ data: mockData }),
        isLoading: wpViewOutputInitialState.merge({ isLiading: mockIsLoading }),
        error: wpViewOutputInitialState.merge({ error: mockError }),
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    setUp();
    expect(useSelectorFn).toHaveBeenCalledTimes(4);
  });

  it.skip('should call useEffect when rendering ', () => {
    setUp();
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
