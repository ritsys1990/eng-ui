import React, * as ReactHooks from 'react';
import StorageStatusRow, { COMPONENT_NAME } from '../StorageStatusRow';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../../../hooks/useCheckAuth';
import * as NavContextHook from '../../../../../../hooks/useNavContext';
import * as tagsHelper from '../../../../../../utils/tagsHelper';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import { findByInstanceAttr, findByInstanceProp } from '../../../../../../utils/testUtils';
import { ClientActionTypes } from '../../../../../../store/client/actionTypes';

const STYLED_DIV_COMPONENT = 'Styled(div)';

const setUp = props => {
  return shallow(<StorageStatusRow {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { clientId: '123' };
  }),
}));

describe('Client Setup Page - Step 1 Create storage space status row', () => {
  let store;
  let mockSetState;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    tagsHelper.filterTagsByTagGroup = jest.fn().mockReturnValue([
      {
        id: '6c6d766e-430b-4a9a-ad45-97e53291bed3',
        name: 'Manufacturing',
      },
    ]);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render success', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {} });
    const wrapper = setUp({
      isCreatedStorage: true,
      clientId: '123',
    });
    const box = findByInstanceAttr(wrapper, COMPONENT_NAME, STYLED_DIV_COMPONENT);
    expect(box.length).toBe(1);
  });

  it('should render fail', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {} });
    const wrapper = setUp({
      isCreatedStorage: false,
      clientId: '123',
    });
    const box = findByInstanceAttr(wrapper, COMPONENT_NAME, STYLED_DIV_COMPONENT);
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Create_Storage`, 'Button');
    expect(box.length).toBe(1);
    expect(button.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {} });
    const wrapper = setUp({
      isCreatedStorage: true,
      clientId: '123',
    });
    const box = findByInstanceAttr(wrapper, COMPONENT_NAME, STYLED_DIV_COMPONENT);
    expect(box.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(1);
  });

  it('should create storage space', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {} });
    const wrapper = setUp({
      isCreatedStorage: false,
      clientId: '123',
    });
    const box = findByInstanceAttr(wrapper, COMPONENT_NAME, STYLED_DIV_COMPONENT);
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Create_Storage`, 'Button');
    expect(box.length).toBe(1);
    expect(button.length).toBe(1);
    button.simulate('click');
    wrapper.update();
    const expectedActions = [{ type: ClientActionTypes.CREATE_CLIENT_STORAGE }];
    expect(store.getActions()).toEqual(expectedActions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
