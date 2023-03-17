import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import ChooseCreateEngType from '../ChooseCreateEngType';
import { EngagementTypes } from '../../../constants/engagment.constants';

const COMPONENT_NAME = 'Client_Setup_Add_New_EngagementModal_Picker';

const defaultProps = {
  value: EngagementTypes.NEW,
  setSelectedValue: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ChooseCreateEngType {...mergedProps} />);
};

describe('Choose Create Engagement Type Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    const radio = box.childAt(0);
    expect(radio.length).toBe(1);
  });

  it('should update selected value', () => {
    const mockSetValue = jest.fn().mockImplementation(() => {});

    const wrapper = setUp({ setSelectedValue: mockSetValue });
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    const radio = box.childAt(0);
    expect(radio.length).toBe(1);
    radio.invoke('onOptionChange')(EngagementTypes.ROLLFORWARD);
    expect(mockSetValue).toHaveBeenLastCalledWith(EngagementTypes.ROLLFORWARD);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
