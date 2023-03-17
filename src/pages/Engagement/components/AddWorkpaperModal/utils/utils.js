import { WorkpaperSource } from '../constants/new-workpaper';

export const getWorkpaperSourceOptions = t => {
  return [
    { value: WorkpaperSource.CORTEX, label: t('Components_AddNewWorkpaperModal_Cortex') },
    { value: WorkpaperSource.TRIFACTA, label: t('Components_AddNewWorkpaperModal_Trifacta') },
  ];
};
