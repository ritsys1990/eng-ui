import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../utils/testUtils';
import { PagePermissions } from '../../../../utils/permissionsHelper';
import InputMappingModal from './InputMappingModal';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../hooks/useCheckAuth';
import { initialState as SecurityInitialState } from '../../../../store/security/reducer';
import { initialState as wpProcessInitialState } from '../../../../store/workpaperProcess/reducer';
import { initialState as step1InitialState } from '../../../../store/workpaperProcess/step1/reducer';
import { initialState as step2InitialState } from '../../../../store/workpaperProcess/step2/reducer';

const defaultProps = { inputId: 'fde1cbfd-f642-44ba-a261-17680bbd1d4c', isModalOpen: true };

const COMPONENT_NAME = 'InputMappingModal';

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<InputMappingModal {...mergedProps} />);
};

describe('InputMappingModal: Initial render', () => {
  let store;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      wpProcess: {
        general: wpProcessInitialState,
        step1: step1InitialState.merge({
          inputRelationship: [
            {
              relationshipId: 'c32bd3f9-7aec-4eda-8e50-2246b8995ab6',
              sourceWPId: '68dc1f96-d80e-4d50-91f5-eb087bf52824',
              sourceOutputId: '99667542-0343-440e-a8f2-816e4d73d75c',
              targetWPId: 'b8ea0440-6936-4cd2-800a-696a800d92a4',
              targetInputId: 'fde1cbfd-f642-44ba-a261-17680bbd1d4c',
              mappings: [
                {
                  sourceFieldName: 'Do not import',
                  targetFieldName: 'ID',
                  type: 'Null',
                },
              ],
              isDeleted: false,
            },
          ],
        }),
        step2: step2InitialState,
      },
    });
    const pagePermissions = {
      [PagePermissions.CONTENT_LIBRARY_PIPELINES]: true,
    };
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
  });
});
