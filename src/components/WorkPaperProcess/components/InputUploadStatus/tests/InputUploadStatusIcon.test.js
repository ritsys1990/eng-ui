import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import { InputUploadStatusIcon, COMPONENT_NAME } from '../InputUploadStatusIcon';

const setUp = (props = { inputStatusData: {}, workpaperType: '' }) => {
  return shallow(<InputUploadStatusIcon {...props} />);
};

describe('Input Upload Status Icon Component', () => {
  beforeEach(() => {
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
  });

  it.skip('should render component', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
