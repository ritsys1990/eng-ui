import React, * as ReactHooks from 'react';
import AddFilterForm from '../AddFilterForm';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from 'src/utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from 'src/hooks/useNavContext';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { COMPONENT_NAME } from '../constants';
import { initialState as engagementInitialState } from '../../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../../store/security/reducer';

const defaultProps = {
  selectedFilter: {
    description: 'test',
    fieldId: '123-234-45677-9c0a-a36efd99fe92',
    fieldName: 'FIELD_NAME',
    filterOperations: [
      {
        fieldName: 'FIELD_NAME',
        filterValue: '16',
        operation: '>',
        tableId: '12335353534-3453453-345',
        tableName: 'TEST_TABLE',
      },
    ],
    id: '34534-433453-4c345ac-45-345',
    name: 'Visw',
    tableId: '345-4-345-ae06-345',
    tableName: 'TEST_TABLE',
    type: 'Suggested',
  },
  handleClose: () => {},
  isEditMode: false,
  setIsChanged: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AddFilterForm {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { bundleId: '12345' };
  }),
}));

describe('Add Filter Form Page', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;
  let mockUseImperative;

  beforeEach(() => {
    store = configureStore([thunk])({
      bundles: ImmutableMap({
        isFetchingBundleNameDetails: false,
      }),
      security: securityInitialState,
      client: clientInitialState,
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useImperativeHandle').mockImplementation((a, b) => {
      mockUseImperative = b();
    });

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(spinner.length).toBe(1);
  });

  it.skip('should render usestate', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(spinner.length).toBe(1);
    expect(mockSetState).toHaveBeenCalledTimes(4);
  });

  it.skip('should render usestate when Edit mode', () => {
    const wrapper = setUp({ isEditMode: true });
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(spinner.length).toBe(1);
    expect(mockSetState).toHaveBeenCalledTimes(12);
  });

  it.skip('should render useeffect', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(11);
  });

  it.skip('should render useeffect when Edit mode', () => {
    const wrapper = setUp({ isEditMode: true });
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(11);
  });

  it('should render useselector', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(spinner.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(8);
  });

  it('should render FilterContextMenu', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const deleteFilterOperation = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose, deleteFilterOperation });
    const filterContext = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Context_Menu`);
    expect(filterContext.length).toBe(1);
  });

  it.skip('should handle FilterContextMenu onClose', () => {
    const mockClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose: mockClose });
    const filterContext = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Context_Menu`);
    expect(filterContext.length).toBe(1);
    filterContext.invoke('deleteFilterOperation')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render alert', () => {
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Alerts`, 'AlertHub');
    expect(alert.length).toBe(1);
  });

  it.skip('should handle FilterContextMenu onClose', () => {
    const mockClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose: mockClose });
    const filterContext = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Context_Menu`);
    expect(filterContext.length).toBe(1);
    filterContext.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render FilterContextMenu Button', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}-table`);
    expect(table.length).toBe(1);
  });

  it.skip('should handle filter name change', () => {
    const value = 'Name';
    const wrapper = setUp();
    const filterName = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Name`);
    expect(filterName.length).toBe(1);
    filterName.invoke('onChange')({ target: { value } });
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should handle filter description change', () => {
    const value = 'Desciption';
    const wrapper = setUp();
    const filterDesc = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Filter_Desc`);
    expect(filterDesc.length).toBe(1);
    filterDesc.invoke('onChange')({ target: { value } });
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should handle filter table value change', () => {
    const value = 'Desciption';
    const wrapper = setUp();
    const targeTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Target_Table`, 'Select');
    targeTable.simulate('change', value);
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should handle filter field value change', () => {
    const value = 'Desciption';
    const wrapper = setUp();
    const targeTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Table_Field`, 'Select');
    targeTable.simulate('change', value);
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should call useDispatch function  ', () => {
    const sourceVersionId = '12121322';
    const data = {
      Name: 'test',
      Description: 'test',
      Type: 'suggested',
      TableId: '42423',
      TableName: 'table',
      FieldId: '42423',
      FieldName: 'field',
      FilterOperations: ['<', '12'],
    };
    mockSetState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;
      if (typeof initial === 'boolean') {
        value = false;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const spyOnUseDispatch = jest.spyOn(ReactReduxHooks, 'useDispatch').mockReturnValue({ sourceVersionId, data });
    mockUseImperative.submit(spyOnUseDispatch);
    wrapper.update();
    expect(spyOnUseDispatch).toBeCalled();
  });

  it('should render radio buttons for filter type options', () => {
    const wrapper = setUp();
    const filterTypeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Type-Wrapper`);
    expect(filterTypeOptions.length).toBe(1);
  });

  it.skip('should handle onChange of  filter type options  ', () => {
    const wrapper = setUp();
    const filterTypeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Filter-Type-option-Suggested`);
    filterTypeOptions.invoke('onOptionSelected')('Mandatory');
    expect(mockSetState).toHaveBeenLastCalledWith('Mandatory');
  });

  it.skip('should handle onchange for Default Input', () => {
    let noOfState = 0;
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (noOfState === 17) {
        value = 'Mandatory';
      }
      ++noOfState;

      return [value, mockSetState];
    });

    const wrapper = setUp();
    const filterTypeOptions = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Mandatory_Default_value`);
    filterTypeOptions.invoke('onChange')({ target: { value: 'inputValue' } });
    expect(mockSetState).toHaveBeenLastCalledWith('inputValue');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
