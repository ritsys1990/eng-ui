import React from 'react';
import { render } from 'enzyme';

const TestHook = ({ cb }) => {
  cb();

  return null;
};

export const testHook = cb => {
  render(<TestHook cb={cb} />);
};
