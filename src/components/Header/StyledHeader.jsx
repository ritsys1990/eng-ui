import styled, { withTheme } from 'styled-components';

const StyledHeader = withTheme(styled.header`
  border-bottom: 1px solid ${props => props.theme.colors.gray2};
`);

export { StyledHeader };
