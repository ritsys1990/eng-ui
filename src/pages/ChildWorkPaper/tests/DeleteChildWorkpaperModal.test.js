import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../utils/testUtils';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import DeleteChildWorkpaperModal from '../components/ChildWorkpaperTable/DeleteChildWorkpaperModal';
import { initialState } from '../../../store/childWorkpapers/reducer';
import * as ChildWorkPapersStoreActions from '../../../store/childWorkpapers/actions';

const COMPONENT_NAME = 'DeleteChildWorkpaperModal';

const defaultProps = {
  isOpen: true,
  onClose: () => {},
  workpaper: { id: '123' },
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteChildWorkpaperModal {...mergedProps} />);
};

describe('Delete Child Workpaper Modal Wrapper Component', () => {
  let store;
  let useEffectFn;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      workpaper: initialState.merge({
        isDeletingChildWorkpaper: false,
        isOpen: true,
      }),
      childWorkpapers: ImmutableMap({
        isDeletingChildWorkpaper: true,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(0);
  });

  it('should dispatch action on primary click', () => {
    const mockClose = jest.fn();
    const mockDeleteChildWorkpaper = jest.fn().mockImplementation(() => {});

    jest.spyOn(ChildWorkPapersStoreActions, 'deleteChildWorkPaper').mockImplementation(() => mockDeleteChildWorkpaper);

    const wrapper = setUp({ onClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockDeleteChildWorkpaper).toHaveBeenCalled();
  });

  it('should close modal on secondary button', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ onClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
