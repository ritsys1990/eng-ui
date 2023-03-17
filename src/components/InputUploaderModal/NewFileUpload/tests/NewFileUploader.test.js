import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { NewFileUploader } from '../NewFileUploader';
import { initialState as errorInitialState } from '../../../../store/errors/reducer';
import { initialState as clientInitialState } from '../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../store/security/reducer';
import { initialState as dataWranglerInitialState } from '../../../../store/dataWrangler/reducer';
import { initialState as step2InitialState } from '../../../../store/workpaperProcess/step2/reducer';
import { initialState as engagementInitialState } from '../../../../store/engagement/reducer';

import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants';
import routerData from 'react-router';
import { findByInstanceProp } from '../../../../utils/testUtils';

const defaultProps = {
  onBack: () => {},
  onClose: () => {},
  inputId: '',
  shouldClean: '',
  workpaperType: 'Trifacta',
  onFolderChange: () => {},
  isNewUpload: '',
  dataTableName: '',
  trifactaFlowId: '',
  handleLargeFileWarning: '',
  selectedInput: '',
  canvasType: 'TRIFACTA_CL_CANVAS',
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<NewFileUploader {...mergedProps} />);
};

describe('New File Uploader Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      wpProcess: {
        step1: ImmutableMap({ isAttachingFile: false }),
        step2: step2InitialState.merge({}),
      },
      dataWrangler: dataWranglerInitialState.merge({ isDatasetUpdating: false }),
      bundles: ImmutableMap({ selectIsFetchingDatamodelsListForWB: false }),
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      security: securityInitialState,
      engagement: engagementInitialState,
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
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
    jest.spyOn(routerData, 'useRouteMatch').mockReturnValue(() => ({ path: '' }));
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
        value = { 0: 'test' };
      }
      if (!initial && typeof initial === 'boolean') {
        value = true;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Header`);
    expect(modal.length).toBe(1);
  });
});
