/**
 *
 */

export const translate = (data, key, translation) => {
  return data.map(option => {
    return {
      ...option,
      [key]: translation(option[key]),
    };
  });
};

export const pluralize = (word, count, suffix = 's') => {
  return `${word}${count !== 1 ? suffix : ''}`;
};
