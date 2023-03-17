import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import OutputList from '../OutputList';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { OUTPUT_TYPES } from '../output.consts';

import { getModalOptions } from '../output.utils';

import * as Step3Actions from '../../../../../store/workpaperProcess/step3/actions';
import * as WarningModalHooks from '../../../../../hooks/useWarningModal';

const t = () => {};
const exists = () => {};

const setUp = (props = {}) => {
  return shallow(<OutputList {...props} />);
};

const COMPONENT_NAME = 'Step3Output';

const initialState = {
  settings: ImmutableMap({
    language: { ...LANGUAGE_DATA },
  }),
  wpProcess: {
    general: ImmutableMap({
      workpaper: {},
      readOnlyfromWP: false,
    }),
    step2: ImmutableMap({
      progress: ImmutableMap({
        '1234-5678-9123-4567': {
          totalSteps: 0,
          completedSteps: 0,
        },
      }),
    }),
    step3: ImmutableMap({
      output: {},
    }),
  },
  engagement: ImmutableMap({
    engagement: null,
  }),
};

const initialprops = {
  title: 'title test',
  itemDescription: 'description test',
  isDMT: false,
  type: OUTPUT_TYPES.TABLEAU,
  data: {},
  workpaperId: '1234-5678-9123-4567',
  mainWorkpaperId: '4321-0765-0219-1234',
  cardsLoading: false,
  cardsState: false,
  config: {
    step3: {
      manageTableau: true,
    },
  },
};

describe('WpProcess output list', () => {
  let store;
  let translationfn;
  let state;
  let options;
  let mockSetState;
  let warningModalFn;
  let callbackFn;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(cb => cb());

    warningModalFn = jest.fn().mockImplementationOnce((text, callback) => {
      callbackFn = callback;
    });
    jest.spyOn(WarningModalHooks, 'default').mockImplementation(() => ({
      renderWarningModal: jest.fn(),
      showWarningModal: warningModalFn,
    }));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initial, mockSetState];
    });
    translationfn = jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t, exists };
    });
    store.clearActions();
    options = getModalOptions(translationfn);
  });

  it('should render remove workbook', () => {
    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RemoveWorkbook`);
    expect(outputContextMenu.length).toBe(1);
  });

  it('should render download all button', () => {
    const newProps = { ...initialprops, type: OUTPUT_TYPES.DQC };
    const wrapper = setUp({ options, ...newProps });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DownloadAll-${newProps.type}`);
    expect(outputContextMenu.length).toBe(1);
  });

  it('should download all the outputs when click on download all button', () => {
    const newProps = { ...initialprops, type: OUTPUT_TYPES.DQC };
    const wrapper = setUp({ options, ...newProps });
    const mockAddEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(Step3Actions, 'downloadAllOutputs').mockImplementation(() => mockAddEntity);

    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DownloadAll-${newProps.type}`);
    expect(outputContextMenu.length).toBe(1);
    outputContextMenu.invoke('onClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });

  it('should remove the workbooks when click on remove button', () => {
    const wrapper = setUp({ options, ...initialprops });
    const mockAddEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(Step3Actions, 'removeWorkbooks').mockImplementation(() => mockAddEntity);

    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RemoveWorkbook`);
    expect(outputContextMenu.length).toBe(1);
    outputContextMenu.invoke('onClick')();
    callbackFn();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });
});
