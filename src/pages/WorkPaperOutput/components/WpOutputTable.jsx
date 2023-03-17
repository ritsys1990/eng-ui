import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Text, Table, TableTypes, Spinner } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import useConfig from '../../../components/WorkPaperProcess/hooks/useConfig';
import useTranslation from '../../../hooks/useTranslation';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import { wpStep3Selectors } from '../../../store/workpaperProcess/step3/selectors';
import { notebookWPStep3Selector } from '../../../store/notebookWorkpaperProcess/step3/selectors';
import { mapOutputRenderer } from '../utils/WorkPaperOutput.utils';
import WpOutputSeeMore from './WpOutputSeeMore';

const WpOutputTable = props => {
  const { output, wpData, canvasType, workpaperId } = props;
  const theme = useContext(ThemeContext);
  const { config } = useConfig(canvasType);
  const { t } = useTranslation();

  const selectIsFetchingOutput = useSelector(
    wpData?.workpaperSource === WORKPAPER_TYPES.NOTEBOOK
      ? notebookWPStep3Selector.selectIsFetchingOutput
      : wpStep3Selectors.selectIsFetchingOutput
  );

  const outputTableHeaders = () => {
    const headerArr = [];

    if (output?.schema && output?.schema.length) {
      output.schema.forEach(col => {
        if (!col?.isInternal) {
          headerArr.push({
            title: col.name,
            key: col.name,
            render: value => mapOutputRenderer(value, col, wpData.workpaperSource),
          });
        }
      });
    }

    return headerArr;
  };

  const enableSeeMore = () => {
    if ((output?.rowCount || output?.totalRowCount) > 250) {
      if (config?.outputPage?.seeMore) {
        return <WpOutputSeeMore workpaperId={workpaperId} />;
      }

      return <Text>{t('Pages_WorkpaperProcess_Output_View_More')}</Text>;
    }

    return null;
  };

  return (
    <Spinner spinning={selectIsFetchingOutput}>
      <Container mb={11}>
        <Box>
          {output && (
            <Table
              headers={outputTableHeaders()}
              type={TableTypes.FILE_PREVIEW_FULL_SCREEN}
              rows={output.data}
              my={8}
              width='100%'
              minHeight={475}
              sx={{
                borderRadius: '.15%',
                borderWidth: '1px',
                borderStyle: 'none',
                borderColor: theme.colors['gray2'],
              }}
            />
          )}
        </Box>
        {enableSeeMore()}
      </Container>
    </Spinner>
  );
};

export default WpOutputTable;
