import { getFilterErrors, getHeaders } from './utils';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { shallow } from 'enzyme';
import { findByInstanceProp } from 'src/utils/testUtils';
import { OPERATIONS } from '../constants';

const result = {
  fieldValue: null,
  filterDesc: null,
  filterErrorLength: 1,
  filterName: null,
  operatorErrorLength: 1,
  rows: null,
  selectedFilterValue: [null, null, null, null, null, null],
  selectedOperation: [null, null, null, null, null, null],
  tableValue: null,
  defaultValueError: null,
};

const row = {
  name: 'Test',
  orgUUID: 1001,
  orgId: 1123,
  installToken: {
    test: 'test',
  },
  active: true,
  readyToRun: false,
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn()),
}));

describe('utils funtion', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  const operation = OPERATIONS;
  const selectedOperation = [[{ rowId: '12', name: 'test' }]];
  const selectedFilterValue = [{ id: '12', name: 'test' }];
  const rows = [
    {
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
  ];

  it('Should return call ', () => {
    const receivedResult = getFilterErrors(
      'test',
      'test',
      [{ id: '12', name: 'test' }],
      [{ id: '12', name: 'test' }],
      [
        {
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
      ],
      [[{ rowId: '12', name: 'test' }]],
      [{ id: '12', name: 'test' }],
      '12345',
      'Mandatory',
      true,
      t
    );

    expect(receivedResult.fieldValue).toBe(result.fieldValue);
    expect(receivedResult.filterDesc).toBe(result.filterDesc);
    expect(receivedResult.filterErrorLength).toBe(result.filterErrorLength);
    expect(receivedResult.filterName).toBe(result.filterName);
    expect(receivedResult.operatorErrorLength).toBe(result.operatorErrorLength);
    expect(receivedResult.rows).toBe(result.rows);
    expect(receivedResult.tableValue).toBe(result.tableValue);
    expect(receivedResult.defaultValueError).toBe(result.defaultValueError);
  });

  it('Should render first column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const isRendering = shallow(
      getHeaders(t, operation, selectedOperation, selectedFilterValue, mockFn, mockFn, mockFn, mockFn, rows)[0].render(
        'test',
        row
      )
    );
    expect(isRendering.length).toBe(1);
    const select = findByInstanceProp(isRendering, `AddNewFilter_Criteria`, 'Select');
    expect(select.length).toBe(1);
    select.invoke('onChange')('test');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('Should render second column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const isRendering = shallow(
      getHeaders(t, operation, selectedOperation, selectedFilterValue, mockFn, mockFn, mockFn, mockFn, rows)[1].render(
        'test',
        row
      )
    );
    expect(isRendering.length).toBe(1);
    const input = findByInstanceProp(isRendering, `AddNewFilter-value`);
    expect(input.length).toBe(1);
    input.invoke('onChange')('test');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('Should render second column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const isRendering = shallow(
      getHeaders(t, operation, selectedOperation, selectedFilterValue, mockFn, mockFn, mockFn, mockFn, rows)[2].render(
        'test',
        row
      )
    );
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, `AddNewFilter_Context_Button`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks(t);
  });
});
