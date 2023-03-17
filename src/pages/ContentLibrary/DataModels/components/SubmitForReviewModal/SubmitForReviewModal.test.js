import React, * as ReactHooks from 'react';
import SubmitForReviewModal from './SubmitForReviewModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<SubmitForReviewModal {...props} />);
};

window.scrollTo = jest.fn();

describe('Add Data Model Options', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render comments modal when rendering', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      dataInstance: 'TEST',
      hideReviewComments: mockFn,
      submitForReview: mockFn,
      showReviewComments: true,
    });
    const modal = findByInstanceProp(wrapper, `TEST-Review-Comments-Modal`);
    expect(modal.length).toBe(1);
  });

  it('should trigger onPrimaryButtonClick', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      dataInstance: 'TEST',
      hideReviewComments: mockFn,
      submitForReview: mockFn,
      showReviewComments: true,
    });
    const modal = findByInstanceProp(wrapper, `TEST-Review-Comments-Modal`);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should change comments', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      dataInstance: 'TEST',
      hideReviewComments: mockFn,
      submitForReview: mockFn,
      showReviewComments: true,
    });
    const mockInputText = { currentTarget: { value: 'Test' } };
    const textArea = findByInstanceProp(wrapper, `TEST-Review-Comments-textarea`);
    textArea.invoke('onChange')(mockInputText);
    expect(textArea.length).toBe(1);
  });

  it('should change comments rationle', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      dataInstance: 'TEST',
      hideReviewComments: mockFn,
      submitForReview: mockFn,
      showReviewComments: false,
    });
    const mockInputText = { currentTarget: { value: 'Test11' } };
    const textArea = findByInstanceProp(wrapper, `TEST-Review-Rationale-Comments-textarea`);
    textArea.invoke('onChange')(mockInputText);
    expect(textArea.length).toBe(1);
  });

  it('should update selected value', () => {
    const mockFn = jest.fn();
    const mockSetValue = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({
      dataInstance: 'TEST',
      hideReviewComments: mockFn,
      submitForReview: mockFn,
      showReviewComments: false,
      setSelectedValue: mockSetValue,
    });
    const mockOutput = 'Major';
    const box = findByInstanceProp(wrapper, `TEST-releaseOptions`);
    box.invoke('onOptionChange')(mockOutput);
    expect(box.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
