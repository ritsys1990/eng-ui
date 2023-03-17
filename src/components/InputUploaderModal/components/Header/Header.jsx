import React, { useContext } from 'react';
import { Text, TextTypes } from 'cortex-look-book';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';

export const Header = ({ titleText, noteText, children }) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Text type={TextTypes.H2} theme={theme} fontWeight='s' mb={3}>
        {titleText || children}
      </Text>
      <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
        {noteText}
      </Text>
    </>
  );
};

Header.propTypes = {
  titleText: PropTypes.string,
  noteText: PropTypes.string,
};

Header.defaultProps = {
  titleText: '',
  noteText: '',
};
