import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import FilterForm from '../components/FilterForm';
import { initialState as childWorkpaperState } from '../../../store/childWorkpapers/reducer';
import { initialState as errorInitialState } from '../../../store/errors/reducer';
import { initialState as workpaperInitialState } from '../../../store/workpaper/reducer';
import { initialState as engagementInitialState } from '../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../store/security/reducer';
import { COMPONENT_NAME } from '../constants/constants';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp, mockL10nContent } from '../../../utils/testUtils';

const childWP = { name: 'ChildPOCDemo', description: '' };

const defaultProps = {
  filterData: {
    filters: {
      id: null,
      tableId: null,
      tableName: 'table 1',
      columnName: 'col 1',
      filterValue: 'abc',
      hasFilter: true,
    },
  },
  formValue: { name: 'ChildPOCDemo', description: '' },
  formState: {
    invalid: true,
    submitted: false,
    value: {
      description: '',
      name: '',
    },
  },
  engagementId: '3a7edf71-301b-4d9b-8483-bce2f210756b',
  outputs: {
    dataTable: [
      {
        id: 1,
        name: 'one',
        source: 'trifacta',
      },
    ],
  },
  handleChanges: jest.fn(),
  handleFormState: jest.fn(),
  onChangeFilter: jest.fn(),
  scrollToTop: jest.fn(),
  output: {
    schema: [
      {
        name: 'one',
      },
    ],
  },
  workpaper: {
    Name: childWP.Name,
    workpaperSource: 'Trifacta',
  },
  editChildWPDetails: {
    filters: [{ id: 123, tableId: 'abc', tableName: 'one', columnName: 'one', filterValue: 'abc', hasFilter: true }],
  },
  editChildWPClick: true,
  hint: jest.fn(),
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<FilterForm {...mergedProps} />);
};

describe('Child WP Filter Form', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA }, content: mockL10nContent }),
      client: clientInitialState,
      security: securityInitialState,
      workpaper: ImmutableMap({
        ...workpaperInitialState,
        Name: childWP.Name,
        workpaperSource: 'Trifacta',
      }),

      childWorkpapers: childWorkpaperState.merge({
        isDeletingChildWorkpaper: true,
        savingChildWorkpaperFilterData: true,
        childWorkPapersList: [
          { id: '1000', name: 'test', description: 'test', childWorkPaperStatus: 'inprogress' },
          { id: '1000', name: 'test', description: 'test', childWorkPaperStatus: 'Draft' },
        ],
        childWpColumns: ['one', 'two'],
      }),
      wpProcess: {
        step3: ImmutableMap({
          output: {
            schema: [
              {
                name: 'one',
              },
              {
                name: 'two',
              },
            ],
          },
          childWpColumns: {},
          outputs: {
            dataTable: [
              {
                id: 1,
                name: 'one',
                source: 'trifacta',
              },
            ],
          },
        }),
      },
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
        value = 1;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should validate name & description controls', () => {
    const event = {
      target: {
        value: 'Child Workpaper',
      },
    };
    const output = setUp();
    const inputWpName = findByInstanceProp(output, `${COMPONENT_NAME}-WorkpaperName`);
    const inputWpDesc = findByInstanceProp(output, `${COMPONENT_NAME}-WorkpaperDescription`, 'Input');

    expect(output.length).toBe(1);
    expect(inputWpName.props().value).toBe(childWP.name);
    expect(inputWpDesc.props().value).toBe(childWP.description);
    inputWpName.invoke('onChange')(event);
    inputWpName.invoke('onBlur')(event);
    inputWpDesc.invoke('onChange')(event);
    expect(inputWpName.length).toBe(1);
  });

  it('should render outputs', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DrpDownRadioSelect`);

    expect(comp.length).toBe(1);
  });

  it('should render Text component on checkbox click', () => {
    const addValues = [{ id: 2, column: 'C2' }];
    const wrapper = setUp();
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DrpDownMultiSelect`);
    wrapperComponent.invoke('onChangeFilter')(addValues);

    expect(wrapperComponent.length).toBe(1);
  });

  it.skip('should get hint for workpaper name', () => {
    const wrapper = setUp();
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}_AddFilter`, 'Button');
    wrapperComponent.invoke('onClick')();
    expect(wrapperComponent.length).toBe(1);
  });

  it.skip('should get hint for workpaper name maximum length', () => {
    const wrapper = setUp();
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}-WorkpaperName`);
    wrapperComponent.invoke('onChange')({
      target: {
        value:
          'hi this is the test to check work paper name length. test test test test test test test test test test test test test test test test test test test test test test test test test',
      },
    });
    expect(mockSetState).toHaveBeenCalledTimes(11);
  });

  it.skip('should render save work paper button ', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'object') {
        value = {
          filters: [{ id: 123, tableName: 'test' }],
          name: 'ChildPOCDemo',
          description: '',
          mutliSelectDropdownData: [{ name: 'test', filterValue: 'test' }],
          parentWorkPaperId: 1234,
          editChildWPDetails: [{ name: 'test', filterValue: 'test' }],
        };
      }
      if (typeof initial === 'boolean') {
        value = false;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp({ childworkpaperCount: 1, maxChildWPLimit: 2 });
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SaveButton`);
    expect(wrapperComponent.length).toBe(1);
    wrapperComponent.invoke('onClick')();
  });

  it.skip('should render alert on error for name validation', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'boolean') {
        value = true;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp({});
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}_NameValidation`);
    expect(wrapperComponent.length).toBe(1);
    wrapperComponent.invoke('onClose')();
    const wrapperComponentWarningModified = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Warning_Modified`);
    expect(wrapperComponentWarningModified.length).toBe(1);
    wrapperComponentWarningModified.invoke('onClose')();
  });
  it.skip('should get hint for workpaper name on click', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'boolean') {
        value = true;
      }
      if (typeof initial === 'number') {
        value = 1;
      }

      return [value, mockSetState];
    });

    const wrapper = setUp();
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}_AddFilter`, 'Button');
    expect(wrapperComponent.length).toBe(1);
    wrapperComponent.invoke('onClick')();
  });
  it.skip('should render alert on error for name validation when ensure filter is false', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;
      if (typeof initial === 'object') {
        value = {
          name: 'ChildPOCDemo',
          description: '',
          mutliSelectDropdownData: [{ name: 'test', filterValue: 'test' }],
        };
      }
      if (typeof initial === 'boolean') {
        value = false;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp({});
    const wrapperComponent = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Warning_Modified_ensureValidation`);
    expect(wrapperComponent.length).toBe(1);
    wrapperComponent.invoke('onClose')();
  });
});
