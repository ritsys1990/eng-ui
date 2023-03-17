import { PageModes } from './constants';

export const getPageMode = path => {
  if (path?.startsWith('/library')) {
    return PageModes.CONTENT_LIBRARY;
  }

  return PageModes.ENGAGEMENT;
};
