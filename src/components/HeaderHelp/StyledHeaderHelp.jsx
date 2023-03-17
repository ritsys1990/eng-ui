import styled, { withTheme } from 'styled-components';
import { pxToRem } from 'cortex-look-book';

const ListShell = withTheme(styled.div`
  width: 100%;
  max-height: ${pxToRem(470)};
  padding: 0;
  margin: 0 0 ${props => pxToRem(props.theme.space[4])};
  overflow: auto;
`);

export { ListShell };
