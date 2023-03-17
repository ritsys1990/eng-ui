import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Theme } from 'cortex-look-book';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { InputUploadStatusText, COMPONENT_NAME } from '../InputUploadStatusText';
import { initialState as SettingsInitialState } from '../../../../../store/settings/reducer';

const setUp = (props = { inputStatusData: {} }) => {
  return shallow(<InputUploadStatusText {...props} />);
};

describe('Input Upload Status Text Component', () => {
  beforeEach(() => {
    const store = configureStore([thunk])({
      settings: SettingsInitialState,
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
  });

  it('should render component', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
