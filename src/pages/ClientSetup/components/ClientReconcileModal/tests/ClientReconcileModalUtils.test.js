import { getTableHeaders, getEntityRepeatableOptions, getEngagementRepeatableOptions } from '../utils/utils';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { shallow } from 'enzyme';

describe('Client Reconcile Modal Utils', () => {
  const content = LANGUAGE_DATA;
  const t = key => {
    return content[`Engagement_${key}`];
  };

  it('Should return client headers', () => {
    const headers = getTableHeaders(t);
    expect(headers.length).toBe(3);
  });

  it('Should call render for client header', () => {
    const name = 'Test Name';
    const headers = getTableHeaders(t);
    expect(headers.length).toBe(3);
    const clientHeader = headers[0];
    const column = clientHeader.render(name);
    const wrapper = shallow(column);
    expect(wrapper.length).toBe(1);
    expect(wrapper.text()).toBe(name);
  });

  it('Should call render for manual header', () => {
    const mockFunction = jest.fn().mockImplementation(() => {});
    const headers = getTableHeaders(t);
    expect(headers.length).toBe(3);
    const clientHeader = headers[1];
    clientHeader.render(mockFunction);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('Should call render for mat header', () => {
    const mockFunction = jest.fn().mockImplementation(() => {});
    const headers = getTableHeaders(t);
    expect(headers.length).toBe(3);
    const clientHeader = headers[2];
    clientHeader.render(mockFunction);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('Should return entity repeatable options', () => {
    const headers = getEntityRepeatableOptions(t);
    expect(headers.length).toBe(1);
    expect(headers[0].name.length).toBeGreaterThan(0);
  });

  it('Should return engagements repeatable options', () => {
    const headers = getEngagementRepeatableOptions(t);
    expect(headers.length).toBe(1);
    expect(headers[0].name.length).toBeGreaterThan(0);
  });
});
