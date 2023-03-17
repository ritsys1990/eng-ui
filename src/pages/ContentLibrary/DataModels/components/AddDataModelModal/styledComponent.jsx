import styled, { withTheme } from 'styled-components';
import { Box, Text, pxToRem } from 'cortex-look-book';

const StyledInputArea = withTheme(styled(Box)`
  padding: ${props => pxToRem(props.theme.space[5])};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  border: ${props =>
    props.isConflictingAlias
      ? `2px solid ${props.theme.colors.errorBorder}`
      : `1px solid ${props.theme.components.input.borderColor}`};
  border-radius: 2px;
  Input {
    transition: all ease 0.2s;
    &:focus:hover {
      transform: translateY(-2px);
    }
  }

  .FREE-TEXT-ALIASES {
    input {
      border: none;
      border-bottom: ${props =>
        props.isFreeTextError
          ? `1px solid ${props.theme.colors.errorBorder}`
          : `1px solid ${props.theme.components.input.borderColor}`};
      transition: all ease 0.2s;
      &:hover,
      &:focus {
        outline: none;
        border: none !important;
        border-bottom: ${props =>
          props.isFreeTextError
            ? `1px solid ${props.theme.colors.errorBorder}`
            : `1px solid ${props.theme.components.input.focusBorderColor}`} !important;
      }
      &:focus:hover {
        transform: translateY(-2px);
      }
    }
  }

  &:hover {
    border: ${props =>
      props.isConflictingAlias
        ? `2px solid ${props.theme.components.input.intent.dark.error}`
        : `1px solid ${props.theme.components.input.focusBorderColor}`};
  }
`);

const ConflictedAliasHint = withTheme(styled(Text)`
  margin-top: 2px !important;
  color: ${props => props.theme.colors.errorBorder};
`);

export { StyledInputArea, ConflictedAliasHint };
