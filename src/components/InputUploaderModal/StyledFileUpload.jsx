import styled from 'styled-components';
import { Button, Flex } from 'cortex-look-book';

export const DropZoneStyle = styled(Flex)`
  box-sizing: border-box;
  outline: ${props => (props.isDragged ? '2px dashed #0076A8' : '1px dashed grey')};
  cursor: pointer;
  flex: 1;
  justify-content: center;
`;

export const DropZoneWrapper = styled(Flex)`
  align-items: baseline;
  flex-grow: 1;
`;

export const Preview = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const BackButton = styled(Button)`
  position: absolute;
`;

export const TreeMenu = styled(Flex)`
  min-height: 300px;
  height: 65vh;
  overflow: auto;
`;

export const FileSettings = styled(Flex)`
  & > div {
    margin-right: ${({ theme }) => theme.space[9]}px;
  }

  & > div:last-child {
    flex-grow: 1;
    margin-right: ${({ theme }) => theme.space[6]}px;
  }
`;
