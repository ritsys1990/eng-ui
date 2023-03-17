import styled, { withTheme } from 'styled-components';
import { Button } from 'cortex-look-book';

const StyledNotificationsButton = withTheme(styled(Button)`
  button {
    height: auto;
    padding: 0;
    color: ${props => props.theme.colors.white};
    outline: none;

    &:hover {
      color: ${props => props.theme.colors.white};
    }
  }
`);

export { StyledNotificationsButton };
