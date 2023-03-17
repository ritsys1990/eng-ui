import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  ModalSizes,
  Box,
  Text,
  FileDropZone,
  Input,
  Accordion,
  TextTypes,
  Flex,
  Radio,
  Alert,
  AlertTypes,
} from 'cortex-look-book';
import { publishWorkbook, updateWorkbookDataSource } from 'src/store/workpaperProcess/step3/actions';
import useTranslation from 'src/hooks/useTranslation';
import {
  COMPONENT_NAME,
  FILE_TYPES,
  RADIO_GROUP_NAME,
  WORKBOOK_DATA_SOURCE,
  OUTPUT_TABLE_NAME,
  getDataSourceOptions,
} from './constants';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { publishWorkbook as publishNotebookWB } from '../../../../store/notebookWorkpaperProcess/step3/actions';

const PublishWorkbookModal = ({ isOpen, onClose, workpaperId, workpaperType, workbookDataSource, outputs }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [files, setFiles] = useState();
  const [dataSource, setDataSource] = useState(WORKBOOK_DATA_SOURCE.DATABRICKS_SQL);
  const [outputTableName, setOutputTableName] = useState('');
  const [showWarning, setShowWarning] = useState(workpaperType === WORKPAPER_TYPES.NOTEBOOK);
  const file = files?.[0];
  const isValid = !!file && name?.length > 0;

  const { t } = useTranslation();

  const handleSubmit = () => {
    if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
      dispatch(publishNotebookWB(workpaperId, name, file));
    } else if (
      workpaperType === WORKPAPER_TYPES.TRIFACTA &&
      dataSource.toLowerCase() !== workbookDataSource.toLowerCase()
    ) {
      dispatch(updateWorkbookDataSource(workpaperId, dataSource)).then(() => {
        dispatch(publishWorkbook(workpaperId, name, file));
      });
    } else {
      dispatch(publishWorkbook(workpaperId, name, file));
    }
    onClose();
  };

  useEffect(() => {
    if (dataSource === WORKBOOK_DATA_SOURCE.DATABRICKS_SQL) {
      setOutputTableName(OUTPUT_TABLE_NAME.DATABRICKS_SQL);
    } else {
      setOutputTableName(OUTPUT_TABLE_NAME.AZURE_SQL);
    }
  }, [dataSource]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={onClose}
      primaryButtonText={t('Pages_WorkpaperProcess_Step3_PublishWorkbook_PublishButton')}
      secondaryButtonText={t('Pages_WorkpaperProcess_Step3_PublishWorkbook_CancelButton')}
      size={ModalSizes.SMALL}
      disablePrimaryButton={!isValid}
    >
      <Box>
        <Text>{t('Pages_WorkpaperProcess_Step3_PublishWorkbook_Title')}</Text>
        {showWarning && (
          <Alert
            message={t('Pages_WorkpaperProcess_Step3_Data_Source_Note')}
            type={AlertTypes.WARNING}
            mt={5}
            onClose={() => {
              setShowWarning(false);
            }}
          />
        )}
        <Input
          label={t('Pages_WorkpaperProcess_Step3_PublishWorkbook_NameField')}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
          dataInstance={`${COMPONENT_NAME}-NameInput`}
          required
          mt={4}
        />
        <Flex my={8} dataInstance={`${COMPONENT_NAME}-Data-Source-Wrapper`}>
          {getDataSourceOptions(t).map(eachOption => {
            return (
              <Radio
                key={`${COMPONENT_NAME}-Data-Source-Option-${eachOption.text}`}
                dataInstance={`${COMPONENT_NAME}-Data-Source-Option-${eachOption.text}`}
                name={RADIO_GROUP_NAME}
                label={eachOption.text}
                value={eachOption.value}
                mb={4}
                pr={4}
                radioSize={16}
                fontSize={14}
                fontWeight='s'
                checked={eachOption.value === dataSource}
                disabledButton={
                  workpaperType === WORKPAPER_TYPES.NOTEBOOK && eachOption.value === WORKBOOK_DATA_SOURCE.AZURE_SQL
                }
                onOptionSelected={value => {
                  setDataSource(value);
                }}
              />
            );
          })}
        </Flex>
        <FileDropZone
          my={8}
          p={8}
          style={{ wordBreak: 'break-word' }}
          files={files}
          onChange={setFiles}
          accept={FILE_TYPES}
          hint={t('Pages_WorkpaperProcess_Step3_PublishWorkbook_DropHint')}
        />
        <Accordion
          header={{
            title: t('Pages_WorkpaperProcess_Step3_PublishWorkbook_SQLOutputs'),
          }}
          // titleBg={theme.colors.lightGray2}
          // bodyBg={theme.colors.white}
          dataInstance={`${COMPONENT_NAME}-Accordion`}
          mb={8}
        >
          {outputs
            ?.filter(x => !!x[outputTableName])
            .map((output, i) => (
              <Box key={output.id} mt={i > 0 ? 4 : 0}>
                <Text type={TextTypes.H4} color='blue4'>
                  {output.name}
                </Text>
                <Text ellipsis>{output[outputTableName]}</Text>
              </Box>
            ))}
        </Accordion>
      </Box>
    </Modal>
  );
};

export default PublishWorkbookModal;
