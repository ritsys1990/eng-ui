export const convertBytes = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

  return Math.round(bytes / 1024 ** i, 2) + sizes[i];
};

export const downloadFileFromStream = (stream, fileName, fileExtension, fileType) => {
  const blob = new Blob([stream], {
    type: fileType,
  });
  // Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
  const a = document.createElement('a');
  a.style = 'display: none';
  document.body.appendChild(a);
  // Create a DOMString representing the blob and point the link element towards it
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `${fileName}.${fileExtension}`;
  // programatically click the link to trigger the download
  a.click();
  // release the reference to the file by revoking the Object URL
  window.URL.revokeObjectURL(url);
};
