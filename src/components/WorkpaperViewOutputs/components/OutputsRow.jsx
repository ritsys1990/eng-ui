import React from 'react';
import { Box, GapSizes, GridView, IconCard, IconTypes, Link } from 'cortex-look-book';
import env from 'env';
import useTranslation from 'src/hooks/useTranslation';

const COMPONENT_NAME = 'OutputsRow';

const OutputsRow = ({ outputs, tableau = false, workpaperId, engagementId }) => {
  const { t } = useTranslation();

  if (!outputs || !outputs.length) {
    return null;
  }

  const onTableauOpen = () => {
    // this should go to analysis instead when tableau user creation is implemented.
    window.open(`${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/design`, '_blank');
  };

  return (
    <GridView gap={GapSizes.LARGE} itemsPerRow={4} width='100%' pt={5} mb={9}>
      {!tableau &&
        outputs.map((output, index) => (
          <Link
            key={output.name}
            to={
              engagementId
                ? `/workpapers/${workpaperId}/outputs/${output.id}`
                : `/library/workpapers/${workpaperId}/outputs/${output.id}`
            }
            dataInstance={`${COMPONENT_NAME}-Output-${index}`}
          >
            <IconCard
              title={output.name}
              description={t('Components_ViewOutputs_DataLabel')}
              iconType={IconTypes.XLS}
            />
          </Link>
        ))}
      {tableau &&
        outputs.map((output, index) => (
          <Box onClick={onTableauOpen} key={output.name} dataInstance={`${COMPONENT_NAME}-Tableau-${index}`}>
            <IconCard
              title={output.name}
              description={t('Components_ViewOutputs_TableauLabel')}
              iconType={IconTypes.ADD_FILE}
            />
          </Box>
        ))}
    </GridView>
  );
};

export default OutputsRow;
