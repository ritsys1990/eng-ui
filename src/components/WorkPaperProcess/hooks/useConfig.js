import { useEffect, useState } from 'react';
import { WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';
import { getConfig as getTrifactaCLCanvasConfig } from '../config/TrifactaCLCanvas.config';
import { getConfig as getNotebookCLCanvasConfig } from '../../NotebookWPProcess/config/NotebookCLCanvas.config';
import { getConfig as getTrifactaEngagementCanvasConfig } from '../config/TrifactaEngagementCanvas.config';
import { getConfig as getTrifactaEngagementWizardConfig } from '../config/TrifactaEngagementWizard.config';
import { getConfig as getCortexEngagementWizardConfig } from '../config/CortexEngagementWizard.config';
import { getConfig as getTrifactaDMTCanvasConfig } from '../config/TrifactaDMTCanvas.config';
import { getConfig as getTrifactaBundleTransformationCanvasConfig } from '../config/TrifactaBundleTransformationCanvas.config';

import useTranslation from 'src/hooks/useTranslation';

const getWorkPaperProcessConfig = (canvasType, t) => {
  switch (canvasType) {
    case WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS:
      return getTrifactaCLCanvasConfig(t);
    case WORKPAPER_CANVAS_TYPES.NOTEBOOKS_CANVAS:
      return getNotebookCLCanvasConfig(t);
    case WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_CANVAS:
      return getTrifactaEngagementCanvasConfig(t);
    case WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD:
      return getTrifactaEngagementWizardConfig(t);
    case WORKPAPER_CANVAS_TYPES.CORTEX_ENGAGEMENT_WIZARD:
      return getCortexEngagementWizardConfig(t);
    case WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS:
      return getTrifactaDMTCanvasConfig(t);
    case WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS:
      return getTrifactaBundleTransformationCanvasConfig(t);
    default:
      throw new Error(
        `${t('Pages_WorkpaperProcess_ProcessConfig_Error_WokpaperCanvasType')} ${canvasType} ${t(
          'Pages_WorkpaperProcess_ProcessConfig_Error_NotImplemented'
        )}`
      );
  }
};

const useConfig = canvasType => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(getWorkPaperProcessConfig(canvasType, t));

  useEffect(() => {
    setConfig(getWorkPaperProcessConfig(canvasType, t));
  }, [canvasType]);

  return { config };
};

export default useConfig;
