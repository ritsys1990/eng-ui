import styled, { withTheme } from 'styled-components';
import { Box } from 'cortex-look-book';

const StyledEditor = withTheme(styled(Box)`
  margin: 10px 0px !important;
  .ql-container {
    height: 60vh !important;
  }
`);

const StyledPill = withTheme(styled(Box)`
  border: 1px solid;
  border-color: ${props => props.dicColor};
  color: ${props => props.dicColor};
  border-radius: 16px;
  padding-left: 5px;
  padding-right: 12px;
  background-color: white;
  font-size: 12px;
  width: 100px;
  height: 24px;
  line-height: 20px;
`);

const StyledLink = withTheme(styled(Box)`
  .ADD_EDIT_LINK {
    & a {
      &:active {
        font-weight: bold;
      }
    }
  }
`);

export { StyledEditor, StyledPill, StyledLink };
