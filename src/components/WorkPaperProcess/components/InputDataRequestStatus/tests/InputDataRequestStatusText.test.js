import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { InputDataRequestStatusText, COMPONENT_NAME } from '../InputDataRequestStatusText';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { Theme } from 'cortex-look-book';
import { DATA_REQUEST_STATUS } from '../constants/InputDataRequestStatus.const';

const setUp = (props = {}) => {
  return shallow(<InputDataRequestStatusText {...props} />);
};

describe('Input Data Request Status Text Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      engagement: engagementInitialState,
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
  });

  it('should render component', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.DRAFT]: 1 },
      dataRequestId: '23432',
    });

    const component = findByInstanceProp(wrapper, COMPONENT_NAME);
    expect(component.length).toBe(1);
  });

  it("should not render link if status is not 'draft'", () => {
    const wrapper = setUp({
      dataRequestStatus: { foo: 0 },
    });
    const link = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ReviewAndSubmitLink`, 'Link');

    expect(link.length).toBe(0);
  });

  it("should render link if status is 'draft'", () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.DRAFT]: 1 },
    });
    const link = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ReviewAndSubmitLink`, 'Link');

    expect(link.length).toBe(1);
  });

  it('should render link if status is an empty object', () => {
    const wrapper = setUp({
      dataRequestStatus: {},
    });
    const link = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ReviewAndSubmitLink`, 'Link');

    expect(link.length).toBe(1);
  });

  it('should render link if status is null', () => {
    const wrapper = setUp({
      dataRequestStatus: null,
    });
    const link = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ReviewAndSubmitLink`, 'Link');

    expect(link.length).toBe(1);
  });

  it('should render link if status is undefined', () => {
    const wrapper = setUp({
      dataRequestStatus: undefined,
    });
    const link = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ReviewAndSubmitLink`, 'Link');

    expect(link.length).toBe(1);
  });

  it.skip('should render status text with the correct color error statuses', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.REJECTED_BY_AUDITOR]: 1 },
    });
    const statusText = findByInstanceProp(wrapper, `${COMPONENT_NAME}-StatusText`, 'Text');

    expect(statusText.props().color).toBe(Theme.colors.errorText);
  });

  it.skip('should render status text with the correct color for successful statuses', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.TRANSFER_COMPLETE]: 1 },
    });
    const statusText = findByInstanceProp(wrapper, `${COMPONENT_NAME}-StatusText`, 'Text');

    expect(statusText.props().color).toBe(Theme.colors.successText);
  });

  it.skip('should render status text with the correct color for info statuses', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.DRAFT]: 1 },
    });
    const statusText = findByInstanceProp(wrapper, `${COMPONENT_NAME}-StatusText`, 'Text');

    expect(statusText.props().color).toBe(Theme.colors.infoText);
  });

  it('should render comma text if there are two or more statuses', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.DRAFT]: 1, [DATA_REQUEST_STATUS.EXTRACTION_FAILED]: 2 },
    });
    const commaText = findByInstanceProp(wrapper, `${COMPONENT_NAME}-CommaText`, 'Text');

    expect(commaText.length).toBe(1);
  });

  it('should not render comma text if there is just one status', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.DRAFT]: 1 },
    });
    const commaText = findByInstanceProp(wrapper, `${COMPONENT_NAME}-CommaText`, 'Text');

    expect(commaText.length).toBe(0);
  });
});
