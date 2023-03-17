import { getFilterHeaders, sortDataByTableName } from './Utils';
import { shallow } from 'enzyme';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { findByInstanceProp } from '../../../utils/testUtils';

const COMPONENT_NAME = 'CHILD_WORKPAPER';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn()),
}));

const row = [
  {
    id: 1234,
    tableId: '101',
    tableName: 'table1',
    columnName: 'columnName1',
    filterValue: 'test1',
  },
];

const unSortedData = [
  {
    id: 1234,
    tableId: '101',
    tableName: 'table1',
    columnName: 'columnName1',
    filterValue: 'test1',
  },
  {
    id: 12345,
    tableId: '121',
    tableName: 'table2',
    columnName: 'columnName2',
    filterValue: 'test12',
  },
  {
    id: 123456,
    tableId: '103',
    tableName: 'table3',
    columnName: 'columnName3',
    filterValue: 'test3',
  },
];
jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn()),
}));

describe('filter grid utils', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  it('Should render first column', () => {
    const isRendering = shallow(getFilterHeaders(t)[0].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render second column', () => {
    const isRendering = shallow(getFilterHeaders(t)[1].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render third column', () => {
    const isRendering = shallow(getFilterHeaders(t)[2].render('test', row));
    expect(isRendering.length).toBe(1);
  });

  it('Should render fourth column', () => {
    const mockFn = jest.fn().mockImplementation(() => {});

    const isRendering = shallow(getFilterHeaders(t, mockFn)[3].render('test', row));
    expect(isRendering.length).toBe(1);
    const button = findByInstanceProp(isRendering, `${COMPONENT_NAME}_Delete`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')('Test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('Should render sort Data', () => {
    const sortedData = unSortedData.sort(sortDataByTableName);
    expect(unSortedData).toEqual(expect.arrayContaining(sortedData));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
