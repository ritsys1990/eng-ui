import React, * as ReactHooks from 'react';
import { Theme } from 'cortex-look-book';
import AddDMFieldModal from './AddDMFieldModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { fieldTypes } from '../../../../../../store/contentLibrary/datamodels/tests/datamodels.mock';
import { DM_FIELD_INITIAL_STATE } from '../../../constants/constants';

const ref = {
  dmFieldNameRef: '',
  dmFieldAlisesRef: '',
};

const mockFn = jest.fn();
const mockedClose = jest.fn();

const mockedProps = {
  handleClose: mockedClose,
  loading: false,
  formState: {
    invalid: true,
    submitted: false,
    value: {
      ...DM_FIELD_INITIAL_STATE,
      aliases: ['NormalAlias1'],
      conflictedAliases: ['ConflictedAlias1'],
    },
  },
  formValue: { ...DM_FIELD_INITIAL_STATE, aliases: ['NormalAlias1'], conflictedAliases: ['ConflictedAlias1'] },
  handleChanges: mockFn,
  handleFormState: mockFn,
  dataInstance: 'TEST',
  isModalOpen: true,
};

const setUp = (params = {}) => {
  const props = {
    ...mockedProps,
    ...params,
    ref,
  };

  return shallow(<AddDMFieldModal {...props} />);
};

const COMPONENT_NAME = 'DM_FIELD_MODAL';

window.scrollTo = jest.fn();

describe('Add Data Model Fields Modal', () => {
  let store;
  const mockSetState = jest.fn();
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryDMs: ImmutableMap({
        fieldTypes,
      }),
      errors: ImmutableMap({
        dmFieldErrors: [],
      }),
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp({});
    const modal = findByInstanceProp(wrapper, `TEST_${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
  });

  it('should update input nameTech field', () => {
    const wrapper = setUp({});
    const inputNameTech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Field-NAME_TECH`);
    inputNameTech.invoke('onChange')({ currentTarget: { value: 'test#$' } });
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should update input name NonTech and desc field', () => {
    const wrapper = setUp({});
    const inputNameNonTech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Field-NAME_NONTECH`);
    inputNameNonTech.invoke('onChange')({ currentTarget: { value: 'test' } });
    const inputDescription = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Field-DESCRIPTION`);
    inputDescription.invoke('onChange')({ currentTarget: { value: 'test' } });
    expect(mockFn).toHaveBeenCalledTimes(4);
  });

  it('should close the Modal', () => {
    const wrapper = setUp({});
    const modal = findByInstanceProp(wrapper, `TEST_${COMPONENT_NAME}`);
    modal.invoke('onClose')();
    expect(mockedClose).toHaveBeenCalledTimes(1);
  });

  it('should update all input Fileds', () => {
    const wrapper = setUp({});
    const inputNameNonTech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Field-NAME_TECH`);
    inputNameNonTech.invoke('onChange')({ currentTarget: { value: 'test' } });
    const inputDescription = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Field-DESCRIPTION`);
    inputDescription.invoke('onChange')({ currentTarget: { value: 'test' } });
    const modelTags = findByInstanceProp(wrapper, `${COMPONENT_NAME}-MODEL_TAGS`);
    modelTags.invoke('onChange')({ currentTarget: { value: 'test' } });
    const release = findByInstanceProp(wrapper, `${COMPONENT_NAME}-RELEASE`);
    release.invoke('onChange')({ currentTarget: { value: 'test' } });
    const analyticsSupport = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ANALYTICS_SUPPORT`);
    analyticsSupport.invoke('onChange')({ currentTarget: { value: 'test' } });
    const sourceOfTerm = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SOURCE_OF_TERM`);
    sourceOfTerm.invoke('onChange')({ currentTarget: { value: 'test' } });
    const aliases = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ALIASES`);
    aliases.invoke('onChange')({ currentTarget: { value: 'test' } });
    const businessRules = findByInstanceProp(wrapper, `${COMPONENT_NAME}-BUSINESS_RULES`);
    businessRules.invoke('onChange')({ currentTarget: { value: 'test' } });
    const transformationRules = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TRANSFORMATON_RULES`);
    transformationRules.invoke('onChange')({ currentTarget: { value: 'test' } });

    expect(mockFn).toHaveBeenCalledTimes(18);
  });

  it('should update all checkboxes', () => {
    const wrapper = setUp({});
    const fieldKey = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Field_KEY`);
    fieldKey.invoke('onChange')({ target: { checked: true } });
    const fieldMandatory = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Field_MANDATORY`);
    fieldMandatory.invoke('onChange')({ target: { checked: true } });
    const fieldReconciliation = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Field_RECONCILIATION`);
    fieldReconciliation.invoke('onChange')({ target: { checked: true } });
    const isTimeFilter = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Field_TIME_FILTER`);
    isTimeFilter.invoke('onChange')({ target: { checked: true } });
    const isEntityFilter = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Field_ENTITY_FILTER`);
    isEntityFilter.invoke('onChange')({ target: { checked: true } });
    expect(mockFn).toHaveBeenCalledTimes(10);
  });

  it('should update the select component', () => {
    const wrapper = setUp({});

    const fieldType = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TYPE`);
    fieldType.invoke('onChange')({ 1: 'option1', 2: 'option2' });
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should render Alias chip', () => {
    const wrapper = setUp({});
    const nonConflictingAlias = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-Field-ALIASES-CHIPS-NonConflicting-NormalAlias1`
    );
    expect(nonConflictingAlias.length).toBe(1);
    const conflictingAlias = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-Field-ALIASES-CHIPS-Conflicting-ConflictedAlias1`
    );
    expect(conflictingAlias.length).toBe(1);
  });

  it('should handle close event on Normal Alias chip', () => {
    const wrapper = setUp({});
    const nonConflictingAlias = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-Field-ALIASES-CHIPS-NonConflicting-NormalAlias1`
    );

    nonConflictingAlias.invoke('onClose')();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle close event on Conflicted Alias chip', () => {
    const wrapper = setUp({});
    const conflictingAlias = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-Field-ALIASES-CHIPS-Conflicting-ConflictedAlias1`
    );

    conflictingAlias.invoke('onClose')();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle Edit event on Conflicted Alias chip', () => {
    const wrapper = setUp({});
    const conflictingAlias = findByInstanceProp(
      wrapper,
      `${COMPONENT_NAME}-Field-ALIASES-CHIPS-Conflicting-ConflictedAlias1`
    );

    conflictingAlias.invoke('onEditText')({ target: { value: 'newText' } });
    expect(mockFn).toHaveBeenCalled();
  });

  it('should Render conflict Filed Message', () => {
    const wrapper = setUp({
      formState: {
        invalid: true,
        submitted: false,
        value: {
          ...DM_FIELD_INITIAL_STATE,
          aliases: ['NormalAlias1'],
          conflictedAliases: ['ConflictedAlias1'],
          isNameTechConflicting: 'Field Name conflict',
        },
      },
    });
    const inputNameTech = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Field-NAME_TECH`);
    expect(inputNameTech.prop('hint')).toBe('Field Name conflict');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
