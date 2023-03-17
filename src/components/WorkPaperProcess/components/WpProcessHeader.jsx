import React, { useContext, useState, useEffect } from 'react';
import { Box, Button, ButtonTypes, Flex, IconTypes, Text, TextTypes } from 'cortex-look-book';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import env from 'env';
import WorkpaperHistoryModal from '../../WorkpaperHistoryModal/WorkpaperHistoryModal';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { COMPONENT_NAME, CONTENT_LIBRARY_WP } from '../constants/WorkPaperProcess.const';
import { setClient } from '../../../store/client/actions';
import { setEngagement } from '../../../store/engagement/actions';
import { WORKPAPER_TYPES, WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';
import { exportTrifactaWorkpaper } from '../../../store/workpaperProcess/actions';
import useTranslation from 'src/hooks/useTranslation';
import useConfig from '../hooks/useConfig';
import { isLegacyMode } from '../../../utils/legacyUtils';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WpProcessHeader = ({ wp, workpaperType, canvasType }) => {
  const dispatch = useDispatch();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { config } = useConfig(canvasType);
  const buttonLoading = useSelector(wpProcessSelectors.buttonLoading);
  const theme = useContext(ThemeContext);
  const history = useHistory();
  const { t } = useTranslation();

  const onExportWorkpaper = () => {
    if (wp?.id) {
      dispatch(exportTrifactaWorkpaper(wp.id, wp.name));
    }
  };

  const onEditAdvanced = () => {
    if (WORKPAPER_TYPES.TRIFACTA === workpaperType) {
      if (wp.engagementId) {
        history.push(`/workpapers/${wp.id}/data`);
      } else {
        history.push(`/library/workpapers/${wp.id}/data`);
      }
    } else {
      window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${wp.id}/data`;
    }
  };

  useEffect(() => {
    if (wp && wp.id && !wp.engagementId) {
      dispatch(setClient({ id: CONTENT_LIBRARY_WP.CLIENT_ID }));
      dispatch(setEngagement({ id: CONTENT_LIBRARY_WP.ENGAGEMENT_ID }));
    }
  }, [wp]);

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center' fontSize={theme.fontSizes.s} mb={theme.space[9] - 4}>
        <Text textAlign='left' type={TextTypes.H1}>
          {wp?.name} {isLegacyMode && wp?.templateId !== null && t('Pages_WorkpaperProcess_CortexUITailored')}
        </Text>
        <Flex alignItems='center'>
          {config?.showWorkpaperHistory && wp?.engagementId === null && (
            <Button
              dataInstance={`${COMPONENT_NAME}-History`}
              type={ButtonTypes.LINK}
              icon={IconTypes.CLOCK}
              iconWidth={16}
              onClick={() => setIsHistoryOpen(true)}
            >
              {t('Pages_WorkpaperProcess_HistoryBtnLabel')}
            </Button>
          )}
          {workpaperType !== WORKPAPER_TYPES.TRIFACTA && workpaperType !== WORKPAPER_TYPES.NOTEBOOK && (
            <Box ml={8}>
              <Button
                type={ButtonTypes.LINK}
                icon={IconTypes.EXTERNAL_TAB}
                iconWidth={20}
                onClick={onEditAdvanced}
                dataInstance={`${COMPONENT_NAME}-Advanced`}
              >
                {t('Pages_WorkpaperProcess_EdvancedFunctionsLabel')}
              </Button>
            </Box>
          )}
          {canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS && (
            <Box ml={8}>
              <Button
                disabled={buttonLoading}
                dataInstance={`${COMPONENT_NAME}-ExportWorkpaper`}
                type={ButtonTypes.LINK}
                icon={buttonLoading ? IconTypes.ANIMATED_REFRESH : IconTypes.UPLOAD}
                iconWidth={16}
                onClick={onExportWorkpaper}
              >
                {t('Pages_Trifacta_Export_Workpaper')}
              </Button>
            </Box>
          )}
        </Flex>
      </Flex>
      {isHistoryOpen && <WorkpaperHistoryModal workpaper={wp} onClose={() => setIsHistoryOpen(false)} />}
    </>
  );
};

WpProcessHeader.propTypes = {
  wp: PropTypes.object,
};

WpProcessHeader.defaultProps = {
  wp: {},
};

export default WpProcessHeader;
