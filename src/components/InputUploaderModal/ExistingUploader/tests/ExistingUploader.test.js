import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { ExistingUploader } from '../ExistingUploader';
import { initialState as errorInitialState } from '../../../../store/errors/reducer';
import { initialState as engagementInitialState } from '../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../store/security/reducer';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp, findByInstanceAttr } from '../../../../utils/testUtils';
import { COMPONENT_NAME } from '../constants';
import routerData from 'react-router';

const defaultProps = {
  onBack: () => {},
  onClose: () => {},
  inputId: '',
  shouldClean: '',
  workpaperType: 'Trifacta',
  isNewUpload: '',
  dataTableName: '',
  trifactaFlowId: '',
  uploadtype: 'select',
  selectedInput: '',
  canvasType: 'TRIFACTA_CL_CANVAS',
  isDMT: '',
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ExistingUploader {...mergedProps} />);
};

describe('Existing Uploader Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      dialogs: {
        attachFilesDialog: ImmutableMap({
          error: '',
          folderStructureMap: {},
          datamodelStructureMap: {},
          preview: {
            data: { 0: ['test1'] },
            schema: {},
          },
          isLoading: false,
          previewLoading: false,
          isAttachingFile: false,
          folderStructure: {},
        }),
      },
      wpProcess: {
        step1: ImmutableMap({ isAttachingFile: false }),
      },
      dataWrangler: ImmutableMap({ isDatasetUpdating: false }),
      bundles: ImmutableMap({ datamodelsListForWB: '' }),
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      security: securityInitialState,
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(routerData, 'useRouteMatch').mockReturnValue(() => ({ path: '' }));

    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = null;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(routerData, 'useParams').mockReturnValue({ workpaperId: 123, outputId: 123 });
  });

  it('should render model', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Model`);
    expect(modal.length).toBe(1);
  });

  it.skip('should render radio button', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = null;
      }
      if (!initial && typeof initial === 'object') {
        value = [{ 0: 'test' }];
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Header`);
    expect(modal.length).toBe(1);
  });

  it('should render DM Tree Component', () => {
    const wrapper = setUp();
    const treeComponent = findByInstanceAttr(wrapper, `${COMPONENT_NAME}-LeftBody-Tree-wrapper`);
    expect(treeComponent.length).toBe(1);
  });

  it('should render Search Component', () => {
    const wrapper = setUp({ uploadtype: 'add datamodel' });
    const searchComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Search_Datamodel_Bundle`);
    expect(searchComponent.length).toBe(1);
  });

  it('should render preview Component', () => {
    const wrapper = setUp({ uploadtype: 'add datamodel' });
    const searchComponent = findByInstanceAttr(wrapper, `${COMPONENT_NAME}-RightBody-Preview`);
    expect(searchComponent.length).toBe(1);
  });
});
