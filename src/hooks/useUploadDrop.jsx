import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const COMPONENT_NAME = 'DropZone';

export const fileTypesToString = fileTypesObj =>
  Object.values(fileTypesObj)
    .map(fileType => `.${fileType}`)
    .join(',');

const validateFileTypes = (fileData, types) => {
  if (fileData.length > 0) {
    for (let i = 0; i < fileData.length; i++) {
      if (!types.some(ft => fileData.item(i).name.indexOf(ft) !== -1)) {
        return null;
      }
    }

    return fileData[0];
  }

  return null;
};

export const useUploadDrop = (onUpload, StyledDropZone, allowedTypes = ['xlsx', 'xls', 'csv', 'txt']) => {
  const ref = useRef(null);

  const [dragging, setDragging] = useState(false);

  const onChange = event => {
    const { files } = event.target;
    onUpload(validateFileTypes(files, allowedTypes));
  };

  const onClick = () => {
    ref.current.click();
  };

  const onDragOverHandler = isOver => event => {
    event.preventDefault();
    setDragging(isOver);
  };

  const onDropHandler = event => {
    event.stopPropagation();
    event.preventDefault();

    const { files } = event.dataTransfer;
    onUpload(validateFileTypes(files, allowedTypes));

    setDragging(false);
  };

  const HiddenInput = () => {
    return (
      <input
        type='file'
        ref={ref}
        onChange={onChange}
        style={{ display: 'none' }}
        accept={fileTypesToString(allowedTypes)}
        data-instance={`${COMPONENT_NAME}-Input`}
      />
    );
  };

  const DropZone = props => {
    return (
      <StyledDropZone
        onDragEnter={onDragOverHandler(true)}
        onDragLeave={onDragOverHandler(false)}
        onDragOver={onDragOverHandler(true)}
        onDrop={onDropHandler}
        {...props}
      >
        {props.children}
      </StyledDropZone>
    );
  };

  DropZone.propType = {
    message: PropTypes.string,
  };

  return {
    DropZone,
    HiddenInput,
    onClick,
    dragging,
  };
};
