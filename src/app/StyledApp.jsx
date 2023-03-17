import styled, { withTheme, createGlobalStyle } from 'styled-components';
import { isLegacyMode } from '../utils/legacyUtils';

const StyledApp = withTheme(styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`);

const StyledContent = withTheme(styled.main`
  flex: 1;
  background-color: ${props => (isLegacyMode ? props.theme.colors.white : props.theme.colors.lightGray)};
`);

const StyledGlobal = createGlobalStyle`
  body {
    margin: 0;
  }
`;

export { StyledApp, StyledContent, StyledGlobal };
