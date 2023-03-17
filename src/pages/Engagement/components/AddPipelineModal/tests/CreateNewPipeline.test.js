import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import CreateNewPipeline from '../CreateNewPipeline';
import { initialState as SecurityInitialState } from '../../../../../store/security/reducer';
import { initialState as EngagementPipelinesInitialState } from '../../../../../store/engagement/pipelines/reducer';
import { PIPELINE_DETAILS, PIPELINE_TYPE } from '../../../../ContentLibrary/Pipelines/constants/constants';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';

const VALID_FORM = {
  [PIPELINE_DETAILS.ID]: '1',
  [PIPELINE_DETAILS.NAME]: 'Test1',
  [PIPELINE_DETAILS.DESCRIPTION]: 'Test 1 description',
  [PIPELINE_DETAILS.SOURCE]: PIPELINE_TYPE.CORTEX,
};

const VALID_FORM_STATE = {
  invalid: false,
  submitted: false,
  value: {
    ...VALID_FORM,
  },
};
const defaultProps = {
  isEditModal: false,
  formValue: VALID_FORM,
  formState: VALID_FORM_STATE,
  handleChanges: () => {},
  handleFormState: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<CreateNewPipeline {...mergedProps} />);
};

describe('CreateNewPipeline: Initial render', () => {
  let store;
  let handleChangesMock;
  let handleFormStateMock;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      engagementPipelines: EngagementPipelinesInitialState,
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    handleChangesMock = jest.fn();
    handleFormStateMock = jest.fn();
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-CreateNewPipeline`);
    expect(component.length).toBe(1);
  });

  it('should set correct values: FieldName', () => {
    const wrapper = setUp({ handleChanges: handleChangesMock, handleFormState: handleFormStateMock });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldName`);
    component.invoke('onChange')({ currentTarget: { value: 'NewTest' } });

    expect(handleChangesMock).toHaveBeenCalledWith({ ...VALID_FORM, [PIPELINE_DETAILS.NAME]: 'NewTest' });
    expect(handleFormStateMock).toHaveBeenCalledWith({ ...VALID_FORM, [PIPELINE_DETAILS.NAME]: 'NewTest' }, false);
  });

  it('should set correct values: FieldDescription', () => {
    const wrapper = setUp({
      isEditModal: true,
      handleChanges: handleChangesMock,
      handleFormState: handleFormStateMock,
    });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldDescription`);
    component.invoke('onChange')({ currentTarget: { value: 'NewDescription' } });

    expect(handleChangesMock).toHaveBeenCalledWith({ ...VALID_FORM, [PIPELINE_DETAILS.DESCRIPTION]: 'NewDescription' });
    expect(handleFormStateMock).toHaveBeenCalledWith(
      { ...VALID_FORM, [PIPELINE_DETAILS.DESCRIPTION]: 'NewDescription' },
      false
    );
  });

  it('should set correct values: FieldSource', () => {
    const wrapper = setUp({
      handleChanges: handleChangesMock,
      handleFormState: handleFormStateMock,
    });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-FieldSource`);
    component.invoke('onOptionChange')(PIPELINE_TYPE.TRIFACTA);

    expect(handleChangesMock).toHaveBeenCalledWith({
      ...VALID_FORM,
      [PIPELINE_DETAILS.SOURCE]: PIPELINE_TYPE.TRIFACTA,
    });
    expect(handleFormStateMock).toHaveBeenCalledWith(
      { ...VALID_FORM, [PIPELINE_DETAILS.SOURCE]: PIPELINE_TYPE.TRIFACTA },
      false
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
