import { PipelineSource } from '../constants/new-pipeline';

export const getWorkpaperSourceOptions = t => {
  return [
    { value: PipelineSource.CORTEX, label: t('Components_AddNewPipelineModal_Cortex') },
    { value: PipelineSource.TRIFACTA, label: t('Components_AddNewPipelineModal_Trifacta') },
  ];
};
