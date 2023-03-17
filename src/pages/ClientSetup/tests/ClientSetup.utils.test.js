import { Intent } from 'cortex-look-book';
import { isFirstNotCompletedStep, getStepStatus, getStepTitle } from '../utils/ClientSetup.utils';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { shallow } from 'enzyme';

const t = key => {
  return LANGUAGE_DATA[`Engagement_${key}`];
};

describe('Client Setup Utils', () => {
  it('Should return success status for step', () => {
    const returnedValue = getStepStatus(true);
    expect(returnedValue).toBe(Intent.SUCCESS);
  });

  it('Should return info status for step', () => {
    const returnedValue = getStepStatus(false);
    expect(returnedValue).toBe(Intent.INFO);
  });

  it('Should detect step 1 is the first not completed', () => {
    const clientSetupState = {
      isStep1Completed: false,
      isStep2Completed: false,
      isStep3Completed: false,
      isStep4Completed: false,
      isStep5Completed: false,
      isStep6Completed: false,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 1);
    expect(returnedValue).toBe(true);
  });

  it('Should detect step 2 is the first not completed', () => {
    const clientSetupState = {
      isStep1Completed: true,
      isStep2Completed: false,
      isStep3Completed: false,
      isStep4Completed: false,
      isStep5Completed: false,
      isStep6Completed: false,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 2);
    expect(returnedValue).toBe(true);
  });

  it('Should detect step 3 is the first not completed', () => {
    const clientSetupState = {
      isStep1Completed: true,
      isStep2Completed: true,
      isStep3Completed: false,
      isStep4Completed: false,
      isStep5Completed: false,
      isStep6Completed: false,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 3);
    expect(returnedValue).toBe(true);
  });

  it('Should detect step 4 is the first not completed', () => {
    const clientSetupState = {
      isStep1Completed: true,
      isStep2Completed: true,
      isStep3Completed: true,
      isStep4Completed: false,
      isStep5Completed: false,
      isStep6Completed: false,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 4);
    expect(returnedValue).toBe(true);
  });

  it('Should detect step 5 is the first not completed', () => {
    const clientSetupState = {
      isStep1Completed: true,
      isStep2Completed: true,
      isStep3Completed: true,
      isStep4Completed: true,
      isStep5Completed: false,
      isStep6Completed: false,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 5);
    expect(returnedValue).toBe(true);
  });

  it('Should detect step 6 is the first not completed', () => {
    const clientSetupState = {
      isStep1Completed: true,
      isStep2Completed: true,
      isStep3Completed: true,
      isStep4Completed: true,
      isStep5Completed: true,
      isStep6Completed: false,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 6);
    expect(returnedValue).toBe(true);
  });

  it('Should detect return false for default value', () => {
    const clientSetupState = {
      isStep1Completed: true,
      isStep2Completed: true,
      isStep3Completed: true,
      isStep4Completed: true,
      isStep5Completed: true,
      isStep6Completed: true,
    };
    const returnedValue = isFirstNotCompletedStep(clientSetupState, 0);
    expect(returnedValue).toBe(false);
  });

  it('Should return step title not disabled', () => {
    const result = getStepTitle(1, t, false);

    expect(Object.prototype.hasOwnProperty.call(result, 'title')).toBe(true);
  });

  it('Should return step title disabled step 1', () => {
    const result = getStepTitle(1, t, true);

    expect(Object.prototype.hasOwnProperty.call(result, 'render')).toBe(true);
    const title = shallow(result.render());
    expect(title.length).toBe(1);
  });

  it('Should return step title disabled step 2', () => {
    const result = getStepTitle(2, t, true);

    expect(Object.prototype.hasOwnProperty.call(result, 'render')).toBe(true);
    const title = shallow(result.render());
    expect(title.length).toBe(1);
  });

  it('Should return step title disabled step 3', () => {
    const result = getStepTitle(3, t, true);

    expect(Object.prototype.hasOwnProperty.call(result, 'render')).toBe(true);
    const title = shallow(result.render());
    expect(title.length).toBe(1);
  });

  it('Should return step title disabled step 4', () => {
    const result = getStepTitle(4, t, true);

    expect(Object.prototype.hasOwnProperty.call(result, 'render')).toBe(true);
    const title = shallow(result.render());
    expect(title.length).toBe(1);
  });

  it('Should return step title disabled step 5', () => {
    const result = getStepTitle(5, t, true);

    expect(Object.prototype.hasOwnProperty.call(result, 'render')).toBe(true);
    const title = shallow(result.render());
    expect(title.length).toBe(1);
  });

  it('Should return step title disabled step 6', () => {
    const result = getStepTitle(6, t, true);

    expect(Object.prototype.hasOwnProperty.call(result, 'render')).toBe(true);
    const title = shallow(result.render());
    expect(title.length).toBe(1);
  });
});
