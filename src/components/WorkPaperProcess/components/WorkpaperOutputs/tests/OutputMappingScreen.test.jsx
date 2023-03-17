import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import OutputMappingScreen from '../OutputMappingScreen';
import * as useTranslationHooks from '../../../../../hooks/useTranslation';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { getModalOptions } from '../output.utils';
import * as Step3Actions from '../../../../../store/workpaperProcess/step3/actions';

const t = () => {};
const exists = () => {};

const setUp = (props = {}) => {
  return shallow(<OutputMappingScreen {...props} />);
};

const COMPONENT_NAME = 'Step3Output';

const initialState = {
  settings: ImmutableMap({
    language: { ...LANGUAGE_DATA },
  }),
  wpProcess: {
    step3: ImmutableMap({
      isSavingToSql: false,
      isLoadingSchema: false,
    }),
  },
};

const initialprops = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  output: {
    nodePath: null,
    nodeId: '123',
    id: '1234-8765-9234-0394',
    fieldMappings: [],
    tableName: 'table test',
  },
  workpaperId: '1234-5678-9123-5678',
  isCentralizedDSUpdated: true,
  savedToSql: false,
};

describe('WpProcess output mapping screen component', () => {
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

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initial, mockSetState];
    });
    translationfn = jest.spyOn(useTranslationHooks, 'default').mockImplementation(() => {
      return { t, exists };
    });
    store.clearActions();
    options = getModalOptions(translationfn);
  });

  it('should render output mapping screen', () => {
    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(outputContextMenu.length).toBe(1);
  });

  it('should to dispatch save to sql when click on the primary button of the modal', () => {
    const newProps = { ...initialprops, savedToSql: true };
    const wrapper = setUp({ options, ...newProps });
    const mockAddEntity = jest.fn().mockImplementation(() => Promise.resolve());
    jest.spyOn(Step3Actions, 'saveToSql').mockImplementation(() => mockAddEntity);

    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(outputContextMenu.length).toBe(1);
    outputContextMenu.invoke('onPrimaryButtonClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });

  it('should to dispatch save tableau tailoring when click on the primary button of the modal and savetoSql option is false', () => {
    const wrapper = setUp({ options, ...initialprops });
    const mockAddEntity = jest.fn().mockImplementation(() => Promise.resolve());
    jest.spyOn(Step3Actions, 'tableauTailoring').mockImplementation(() => mockAddEntity);

    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(outputContextMenu.length).toBe(1);
    outputContextMenu.invoke('onPrimaryButtonClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });
});
