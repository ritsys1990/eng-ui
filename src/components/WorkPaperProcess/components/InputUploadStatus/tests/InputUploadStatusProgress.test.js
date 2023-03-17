import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { InputUploadStatusProgress, COMPONENT_NAME } from '../InputUploadStatusProgress';
import { initialState as WorkpaperProcessInitialState } from '../../../../../store/workpaperProcess/reducer';
import { initialState as SettingsInitialState } from '../../../../../store/settings/reducer';

const setUp = (props = { inputStatusData: {} }) => {
  return shallow(<InputUploadStatusProgress {...props} />);
};

describe('Input Upload Status Icon Component', () => {
  beforeEach(() => {
    const store = configureStore([thunk])({
      wpProcess: {
        general: WorkpaperProcessInitialState,
      },
      settings: SettingsInitialState,
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
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
