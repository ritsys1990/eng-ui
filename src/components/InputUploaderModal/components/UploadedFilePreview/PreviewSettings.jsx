import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Flex,
  Select,
  SelectTypes,
  Box,
  Text,
  TextTypes,
  FileTypes,
  Icon,
  IconTypes,
  Tooltip,
  TooltipPosition,
} from 'cortex-look-book';
import { FileIndicator } from '../FileIndicator/FileIndicator';
import { Delimiter } from '../Delimeter/Delimiter';
import { FileSettings, Preview } from '../../StyledFileUpload';
import { useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { SelectSheets } from '../SelectSheets/SelectSheets';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { stagingSelectors } from '../../../../store/staging/selectors';
import { COMPONENT_NAME } from './constants';
import { noop } from '../../../../utils/errorHelper';
import useTranslation from 'src/hooks/useTranslation';
import path from 'path';

export const PreviewSettings = ({
  fileName,
  warningNote,
  sheets,
  isNameCanClose,
  valid,
  onDeleteFile,
  onDelimiterChange,
  onSheetChange,
  onLastSelectedChange,
  onChange,
  children,
  workpaperType,
  selectedFolder,
  isNewUpload,
  showDelimeter = true,
  indicatorType = 'File',
  hideSheetSelect,
  isExistingFile,
}) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const isExcel = path.extname(fileName)?.toLowerCase() === '.xlsx' || fileName?.endsWith('.xlsx.enc');
  const isLegacyExcel = fileName.split('.').pop() === FileTypes.XLS;
  const folders = useSelector(stagingSelectors.engagementFolders);
  const [inputFolders, setInputFolders] = useState([]);

  useEffect(() => {
    setInputFolders(folders);
  }, [folders]);

  const handleInputChange = text => {
    if (text) {
      const listFolders =
        text.length > 0 ? folders.filter(mat => mat.fileName.toLowerCase().includes(text.toLowerCase())) : [];
      setInputFolders(listFolders);
    } else {
      setInputFolders(folders);
    }
    onChange(text);
  };

  return (
    <>
      <FileSettings theme={theme}>
        <Flex>
          <Box width='30%' minWidth='260px' mr={3}>
            {fileName && (
              <Flex>
                <FileIndicator
                  mr={8}
                  label={t(`Pages_EngagementWorkpapers_AttachSourceModal_Indicator_${indicatorType}`)}
                  fileName={fileName}
                  isNameCanClose={isNameCanClose}
                  onDeleteFile={onDeleteFile}
                />
                {warningNote && (
                  <Tooltip
                    display='inline-block'
                    direction={TooltipPosition.RIGHT}
                    showOnHover
                    tooltipContent={warningNote}
                    dataInstance='COMPONENT_NAME-NoteToolTip'
                  >
                    <Icon type={IconTypes.WARNING} color='yellow' size={30} mr={2} mt={22} />
                  </Tooltip>
                )}
              </Flex>
            )}
          </Box>
          <Box width='40%' mr={3}>
            {!isExcel && fileName && showDelimeter && (
              <Delimiter
                theme={theme}
                onDelimiterChange={delimiterValue => {
                  onDelimiterChange(delimiterValue);
                }}
              />
            )}
            {isExcel && !hideSheetSelect && (
              <SelectSheets
                sheets={sheets}
                onSheetChange={onSheetChange}
                onLastSelectedChange={onLastSelectedChange}
                valid={valid}
              />
            )}
          </Box>
          <Box width='30%' mr={3}>
            {workpaperType === WORKPAPER_TYPES.TRIFACTA && isNewUpload && (
              <Select
                type={SelectTypes.SINGLE}
                label={t('Pages_EngagementWorkpapers_AttachSourceModal_Label_SaveInUser')}
                options={inputFolders}
                value={selectedFolder}
                filtering
                required
                onChange={onChange}
                onInputChange={handleInputChange}
                inputChangeDebounce={1000}
                optionValueKey='fileName'
                optionTextKey='fileName'
                dataInstance={COMPONENT_NAME}
              />
            )}
          </Box>
        </Flex>
      </FileSettings>

      {children && !(isLegacyExcel && !isExistingFile) && (
        <Flex height='32rem' flexGrow={2} mr={4}>
          <Preview>{children}</Preview>
        </Flex>
      )}
      {isLegacyExcel && !isExistingFile && (
        <Flex height='32rem' flexGrow={2} mr={4} mt={8}>
          <Text type={TextTypes.BODY}>{t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_NoPreview')}</Text>
          <Box display='none'>{children}</Box>
        </Flex>
      )}
    </>
  );
};

PreviewSettings.propTypes = {
  fileName: PropTypes.string,
  sheets: PropTypes.array,
  isNameCanClose: PropTypes.bool,
  valid: PropTypes.func,
  onDeleteFile: PropTypes.func,
  onDelimiterChange: PropTypes.func,
  onSheetChange: PropTypes.func,
  hideSheetSelect: PropTypes.bool,
  showDelimeter: PropTypes.bool,
  indicatorType: PropTypes.string,
  isExistingFile: PropTypes.bool,
};

PreviewSettings.defaultProps = {
  fileName: '',
  sheets: [],
  isNameCanClose: false,
  valid: noop,
  onDeleteFile: noop,
  onDelimiterChange: noop,
  onSheetChange: noop,
  hideSheetSelect: false,
  showDelimeter: true,
  indicatorType: 'File',
  isExistingFile: false,
};
