import { generateFilePathAlertMessage } from './Engagement.utils';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../utils/testUtils';

const t = key => {
  return LANGUAGE_DATA[`Engagement_${key}`];
};

describe('Engagement File Path Alert Utils', () => {
  it('Should return success text', () => {
    const component = shallow(generateFilePathAlertMessage(t, false));
    expect(component.length).toBe(1);
  });

  it('Should return error text', () => {
    const component = shallow(generateFilePathAlertMessage(t, true));
    expect(component.length).toBe(1);
  });

  it('Should handle button for retry', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const component = shallow(generateFilePathAlertMessage(t, true, mockFn));
    expect(component.length).toBe(1);
    const button = findByInstanceProp(component, 'RetryDownloadValidation');
    expect(button.length).toBe(1);
  });

  it('Should handle download click on button for error logs', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const component = shallow(generateFilePathAlertMessage(t, true, mockFn));
    expect(component.length).toBe(1);
    const button = findByInstanceProp(component, 'ErrorLogsDownloadValidation');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
