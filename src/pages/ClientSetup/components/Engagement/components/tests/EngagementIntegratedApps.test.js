import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import EngagementIntegratedApps from '../EngagementIntegratedApps';
import routerData from 'react-router';

const COMPONENT_NAME = 'EngagementIntegratedApps';

const setUp = (props = { handleOpen: () => {} }) => {
  return shallow(<EngagementIntegratedApps {...props} />);
};

describe('EngagementIntegratedApps Component', () => {
  let store;
  let mockSetState;

  window.scrollTo = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(routerData, 'useParams').mockReturnValue({ clientId: '123' });
  });

  it('should render', () => {
    const wrapper = setUp({ isConnectedToMAT: false, isConnectedToGlobalscape: false, isConnectedToOmnia: false });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(component.length).toBe(1);
  });

  it('should render globalscape', () => {
    const wrapper = setUp({ isConnectedToMAT: false, isConnectedToGlobalscape: true, isConnectedToOmnia: false });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Globalscape`, 'Tooltip');
    expect(component.length).toBe(1);
  });

  it('should render omnia', () => {
    const wrapper = setUp({ isConnectedToMAT: false, isConnectedToGlobalscape: false, isConnectedToOmnia: true });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Omnia`, 'Tooltip');
    expect(component.length).toBe(1);
  });

  it.skip('should render icon', () => {
    const mockOpen = jest.fn();
    const wrapper = setUp({
      isConnectedToMAT: true,
      isConnectedToGlobalscape: false,
      isConnectedToOmnia: true,
      handleOpen: mockOpen,
    });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Omnia-icon`);
    expect(component.length).toBe(1);
    component.invoke('onClick')();
    expect(mockSetState).toHaveBeenCalledWith(true);
  });

  it.skip('should handle onclose', () => {
    const handleClose = jest.fn();
    const wrapper = setUp({
      handleClose,
      isConnectedToMAT: true,
      isConnectedToGlobalscape: false,
      isConnectedToOmnia: true,
    });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Linked-Omnia`);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
