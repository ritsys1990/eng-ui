import React, * as ReactHooks from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import OutputOptionsModal from './OutputOptionsModal';
import * as useTranslationHooks from 'src/hooks/useTranslation';
import { findByInstanceProp } from 'src/utils/testUtils';

import { getModalOptions } from 'src/components/WorkPaperProcess/components/WorkpaperOutputs/output.utils';

const t = () => {};
const exists = () => {};

const setUp = (props = {}) => {
  return shallow(<OutputOptionsModal {...props} />);
};

const COMPONENT_NAME = 'Step3Output';

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  wpProcess: {
    step3: ImmutableMap({
      inputId: null,
      isLoading: true,
      isFilePreviewLoading: false,
      folderStructureMap: ImmutableMap({}),
      datamodelTreeData: {},
      error: {},
      root: false,
      preview: {
        data: {},
        schema: {},
      },
      nodeId: null,
    }),
    general: ImmutableMap({
      workpaper: {
        id: '43a0f3ca-bf21-4b68-a648-de2752f35cbb',
      },
    }),
  },
  dialogs: {
    attachFilesDialog: ImmutableMap({
      inputId: null,
      isLoading: true,
      isFilePreviewLoading: false,
      folderStructureMap: ImmutableMap({}),
      datamodelTreeData: {},
      error: {},
      root: false,
      preview: {
        data: {},
        schema: {},
      },
      nodeId: null,
    }),
  },
  dataExchange: ImmutableMap({
    isLinkingEngagementToOmnia: false,
    omniaLinkResponse: null,
    isSendingWPOutputToOmnia: false,
    isFetchingWPOutputStatus: false,
    sendWPOutputStatus: null,
    sendToOmniaOutputHistory: [],
    isFetchingSendToOmniaOutputHistory: false,
  }),
};

const initialprops = {
  isModalOpen: true,
  setIsModalOpen: true,
  setIsMappingScreenOpen: false,
  setIsTableauTailoringOpen: false,
  output: { id: '234', datamodelId: '345', name: 'randomName' },
  workpaperId: '1234',
  rename: false,
  canvasType: 'TRIFACTA_DMT_CANVAS',
  resetOmniaDescription: () => {},
};

describe('WpProcessStep1 test suite', () => {
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

  it('should render', () => {
    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Context-Menu-Wrapper`);
    expect(outputContextMenu.length).toBe(1);
  });

  it.skip('should render edit datamodel Warning', () => {
    jest
      .spyOn(ReactHooks, 'useState')
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['JE', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([{}, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce([{}, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([null, mockSetState])
      .mockReturnValueOnce([false, mockSetState]);

    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Warning-Modal-Wrapper`);
    expect(outputContextMenu.length).toBe(1);
  });

  it.skip('should render datamodel tree', () => {
    jest
      .spyOn(ReactHooks, 'useState')
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['JE', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([{}, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([
        {
          123: { typeOfNode: 0, level: 1, name: 'abc', id: '123' },
        },
        mockSetState,
      ])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([null, mockSetState])
      .mockReturnValueOnce([false, mockSetState]);

    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree-wrapper`);
    expect(outputContextMenu.length).toBe(1);
  });

  it.skip('should render Preview Component', () => {
    jest
      .spyOn(ReactHooks, 'useState')
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['JE', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([{}, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([
        {
          123: { typeOfNode: 0, level: 1, name: 'abc', id: '123' },
        },
        mockSetState,
      ])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([null, mockSetState])
      .mockReturnValueOnce([false, mockSetState]);

    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Connet-DataModel-Right-Pane-Preview`);
    expect(outputContextMenu.length).toBe(1);
  });

  it.skip('should render Connected Datamodel name', () => {
    jest
      .spyOn(ReactHooks, 'useState')
      .mockReturnValueOnce([false, mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['JE', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([{}, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([true, mockSetState])
      .mockReturnValueOnce([
        {
          123: { typeOfNode: 0, level: 1, name: 'abc', id: '123' },
        },
        mockSetState,
      ])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce(['', mockSetState])
      .mockReturnValueOnce([null, mockSetState])
      .mockReturnValueOnce([false, mockSetState]);

    const wrapper = setUp({ options, ...initialprops });
    const outputContextMenu = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-Connet-DataModel-Current-connected-Datamodel`
    );
    expect(outputContextMenu.length).toBe(1);
  });
});
