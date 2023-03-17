import { generateValidateAlertMessage } from './WorkpaperProcessing.utils';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';

const t = key => {
  return LANGUAGE_DATA[`Engagement_${key}`];
};

describe('Workpaper Processing Utils', () => {
  it('Should return success text', () => {
    const component = shallow(generateValidateAlertMessage(t, false));
    expect(component.length).toBe(1);
  });

  it('Should return error text', () => {
    const component = shallow(generateValidateAlertMessage(t, true));
    expect(component.length).toBe(1);
  });

  it('Should handle download click on button', () => {
    const mockFn = jest.fn().mockImplementation(() => {});
    const component = shallow(generateValidateAlertMessage(t, true, mockFn));
    expect(component.length).toBe(1);
    const button = findByInstanceProp(component, 'DownloadValidation');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
