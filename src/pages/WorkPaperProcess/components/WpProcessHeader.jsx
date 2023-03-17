import React, { useContext, useState } from 'react';
import { Box, Button, ButtonTypes, Flex, IconTypes, Text, TextTypes } from 'cortex-look-book';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import WorkpaperHistoryModal from '../../../components/WorkpaperHistoryModal/WorkpaperHistoryModal';
import env from 'env';
import { COMPONENT_NAME } from '../constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';
import { isLegacyMode } from '../../../utils/legacyUtils';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';

const WpProcessHeader = ({ wp }) => {
  const { t } = useTranslation();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const theme = useContext(ThemeContext);

  const onEditAdvanced = () => {
    if (isLegacyMode) {
      window.open(`${env.ANALYTICSUI_URL}/workpapers/${wp.id}/data`);
    } else {
      window.location.href = `${env.ANALYTICSUI_URL}/workpapers/${wp.id}/data`;
    }
  };

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center' fontSize={theme.fontSizes.s} mb={theme.space[9] - 4}>
        <Text textAlign='left' type={TextTypes.H1}>
          {wp?.name} {isLegacyMode && wp?.templateId !== null && t('Pages_WorkpaperProcess_CortexUITailored')}
        </Text>
        <Flex alignItems='center'>
          {wp?.engagementId === null && wp?.workpaperSource !== WORKPAPER_TYPES.NOTEBOOK && (
            <Button
              type={ButtonTypes.LINK}
              icon={IconTypes.CLOCK}
              iconWidth={16}
              onClick={() => setIsHistoryOpen(true)}
              dataInstance={`${COMPONENT_NAME}-History`}
            >
              {t('Pages_WorkpaperProcess_HistoryBtnLabel')}
            </Button>
          )}
          {wp?.workpaperSource !== WORKPAPER_TYPES.NOTEBOOK && (
            <Box ml={8}>
              <Button
                type={ButtonTypes.LINK}
                icon={IconTypes.EXTERNAL_TAB}
                iconWidth={22}
                onClick={onEditAdvanced}
                dataInstance={`${COMPONENT_NAME}-EditAdvanced`}
              >
                {t('Pages_WorkpaperProcess_EdvancedFunctionsLabel')}
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
