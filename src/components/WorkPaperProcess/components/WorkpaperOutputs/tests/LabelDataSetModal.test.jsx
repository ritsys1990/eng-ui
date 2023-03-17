import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import LabelDataSetModal from '../LabelDataSetModal';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { getModalOptions } from '../output.utils';
import * as Step3Actions from '../../../../../store/workpaperProcess/step3/actions';
import { Theme } from 'cortex-look-book';

const t = () => {};
const exists = () => {};

const setUp = (props = {}) => {
  return shallow(<LabelDataSetModal {...props} />);
};

const COMPONENT_NAME = 'Step3Output';

const initialState = {
  settings: ImmutableMap({
    language: { ...LANGUAGE_DATA },
  }),
  wpProcess: {
    step3: ImmutableMap({
      syncingOutputs: true,
      duplicateLableList: [],
      isFetchingLabels: true,
      isLabelUpdating: true,
      engagementLabels: [],
      activeWPLabels: {
        1: 1,
        2: 2,
        3: 3,
      },
      labelError: 'Error test',
      outputs: ImmutableMap({
        '1234-5678-9123-9012': {
          dataTable: [{}],
          dqc: [{}],
        },
      }),
    }),
  },
};

const initialprops = {
  isOpen: true,
  title: 'title test',
  onClose: () => {},
  workpaperId: '1234-5678-9123-9012',
  readOnlyfromWP: false,
  canvasType: null,
};

describe('label dataset modal', () => {
  let store;
  let translationfn;
  let state;
  let options;
  let mockSetState;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(cb => cb());
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initial, mockSetState];
    });
    translationfn = jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t, exists };
    });
    store.clearActions();
    options = getModalOptions(translationfn);
  });

  it.skip('should not render the label dataset alert', () => {
    const wrapper = setUp({ options, ...initialprops });
    const modal = findByInstanceProp(wrapper, '', 'Modal');
    expect(modal.length).toBe(1);
  });

  it.skip('should render the label dataset modal', () => {
    const wrapper = setUp({ options, ...initialprops });
    const outputs = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Outputs`);
    expect(outputs.length).toBe(1);
  });

  it.skip('should not call the dispatch', () => {
    const wrapper = setUp({ options, ...initialprops });
    const mockAddEntity = jest.fn().mockImplementation(() => Promise.resolve());
    jest.spyOn(Step3Actions, 'updateOutputDataSetNames').mockImplementation(() => mockAddEntity);

    const modal = findByInstanceProp(wrapper, '', 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(0);
  });
});
