import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getStagingFileDL } from '../../store/staging/actions';
import { noop } from '../../utils/errorHelper';
import useTranslation from '../../hooks/useTranslation';

export const TRANSLATION_KEY = 'Components_PDFViewer';

const SecureAgentTOU = props => {
  const { t } = useTranslation();
  const { url, pdfName, setIsLoadingFile } = props;
  const [localURL, setLocalURL] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalURL('');
    setIsLoadingFile(true);
    dispatch(getStagingFileDL(url)).then(blob => {
      const newUrl = (window.URL ? window.URL : window.webkitURL).createObjectURL(blob);
      setLocalURL(newUrl);
      setIsLoadingFile(false);
    });
  }, [dispatch, url]);

  return (
    <object data={localURL} type='application/pdf' width='100%' height='600'>
      {t(`${TRANSLATION_KEY}_PDFError`)}{' '}
      <a href={localURL} download={pdfName}>
        {t(`${TRANSLATION_KEY}_PDFErrorDownload`)}
      </a>
    </object>
  );
};

SecureAgentTOU.defaultProps = {
  setIsLoadingFile: noop,
};

export default SecureAgentTOU;
