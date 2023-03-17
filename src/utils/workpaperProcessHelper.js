import { WORKPAPER_TYPES, WORKPAPER_CANVAS_TYPES } from './WorkpaperTypes.const';

// eslint-disable-next-line sonarjs/cognitive-complexity
const getCanvasType = workpaper => {
  if (workpaper) {
    if (workpaper.templateId) {
      switch (workpaper.workpaperSource) {
        case WORKPAPER_TYPES.CORTEX:
          return WORKPAPER_CANVAS_TYPES.CORTEX_ENGAGEMENT_WIZARD;
        case WORKPAPER_TYPES.TRIFACTA:
        default:
          return WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD;
      }
    } else if (!workpaper.engagementId) {
      if (workpaper.isDMT) {
        return WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS;
      }
      if (workpaper.bundleTransformation) {
        return WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS;
      }
      if (workpaper.workpaperSource === WORKPAPER_TYPES.NOTEBOOK) {
        return WORKPAPER_CANVAS_TYPES.NOTEBOOKS_CANVAS;
      }

      return WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS;
    }

    return WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_CANVAS;
  }

  return null;
};

export { getCanvasType };
