import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ReactReduxHooks from 'react-redux';
import LinkedOmniaEngModal, { COMPONENT_NAME } from '../LinkedOmniaEngModal';
import { initialState as DataExchangeInitialState } from '../../../../store/dataExchange/reducer';
import { findByInstanceProp } from '../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';
import routerData from 'react-router';

window.scrollTo = jest.fn();

describe('LinkedOmniaEngModal test suite', () => {
  const renderProps = () => {
    return {
      linkedOmniaEngModal: false,
      handleClose: jest.fn(),
      cortexEngagementId: 7865,
      openFrom: 'engagement',
    };
  };

  const render = (props = renderProps()) => {
    return shallow(<LinkedOmniaEngModal {...props} />);
  };

  const exchangeState = {
    ...DataExchangeInitialState,
    linkedOmniaEngagements: [{ omniaEngagementId: 1, omniaEngagementName: 'XYZ', isReadyForDeletion: true }],
  };

  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      dataExchange: ImmutableMap(exchangeState),
      security: ImmutableMap({
        meRoles: {
          engagements: [
            {
              id: 7865,
              roles: [
                {
                  name: 'Engagement Admin',
                },
              ],
            },
          ],
          clients: [
            {
              id: 7865,
              roles: [
                {
                  name: 'Client Admin',
                },
              ],
            },
          ],
        },
      }),
      engagement: ImmutableMap({ myList: [], clientEngagementsList: [] }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(routerData, 'useParams').mockReturnValue({ clientId: 123 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render linkedOmniaModal', () => {
    const wrapper = render();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}_linkedOmniaModal`);
    expect(component.length).toBe(1);
  });

  it('should close linkedOmniaModal', () => {
    const props = renderProps();
    const wrapper = render(props);
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}_linkedOmniaModal`);
    component.props().onClose();
    component.props().onSecondaryButtonClick();
    expect(props.handleClose).toHaveBeenCalled();
  });

  describe('DeleteOmniaEngModal test suite', () => {
    it('should render DeleteOmniaEngModal', () => {
      const wrapper = render();
      const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}_deleteOmniaModal`);
      expect(component.length).toBe(1);
    });

    it.skip('should close DeleteOmniaEngModal', () => {
      const props = renderProps();
      const wrapper = render(props);
      const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}_deleteOmniaModal`);
      component.props().onSecondaryButtonClick();
      expect(mockSetState).toHaveBeenLastCalledWith(false);
    });

    it.skip('should delete OmniaEng', () => {
      const props = renderProps();
      props.linkedOmniaEngModal = true;
      const wrapper = shallow(<LinkedOmniaEngModal {...props} />);
      const listView = findByInstanceProp(wrapper, `${COMPONENT_NAME}_List`);
      const listViewComponent = shallow(listView.get(0));
      const table = listViewComponent.find('Table');
      const tableComponent = shallow(table.get(0));
      const icon = tableComponent.find('Icon');
      icon.invoke('onClick')();
      expect(mockSetState).toHaveBeenLastCalledWith(true);
    });
  });
});
