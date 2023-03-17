import styled, { withTheme } from 'styled-components';
import { Text, pxToRem, Flex } from 'cortex-look-book';

const StyledHeaderNotificationList = withTheme(styled.div`
  width: ${pxToRem(400)};
  padding: ${props => pxToRem(props.theme.space[4])} 0;
`);

const ListHeader = withTheme(styled(Flex)`
  padding: 0 ${props => pxToRem(props.theme.space[6])} ${props => pxToRem(props.theme.space[4])};
  border-bottom: 1px solid ${props => props.theme.colors.gray2};
`);

const ListBody = withTheme(styled.div`
  width: 100%;
  max-height: ${pxToRem(450)};
  padding: 0;
  margin: 0 0 ${props => pxToRem(props.theme.space[4])};
  overflow: auto;
`);

const StyledTabText = withTheme(styled(Text)`
  border-bottom: 2px solid ${props => props.theme.colors.black};
`);

export { StyledHeaderNotificationList, ListHeader, ListBody, StyledTabText };
