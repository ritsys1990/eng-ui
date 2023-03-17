import React, { useState } from 'react';
import { Box, ContextMenu, Flex, Icon, IconTypes, Popover, PopoverOrigin, Text, TextTypes } from 'cortex-look-book';
import { OUTPUT_STATUS } from '../../../components/WorkPaperProcess/components/WorkpaperOutputs/output.consts';
import { WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';

const COMPONENT_NAME = 'OutputNavigation';

const WpOutputNavigation = props => {
  const { outputName, outputs, mainWorkpaperId, workpaperId, canvasType } = props;

  const [contextNavChevronRef, setContextNavChevronRef] = useState({ current: null });
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleContextButton = e => {
    setContextNavChevronRef({ current: e.target });
    setIsNavOpen(true);
  };

  const handleNavToOutput = output => {
    switch (canvasType) {
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS:
        window.location.href = `/library/bundleTransformations/${workpaperId}/outputs/${output.id}`;
        break;
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS:
        window.location.href = `/library/datamodelTransformations/${workpaperId}/outputs/${output.id}`;
        break;
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS:
      case WORKPAPER_CANVAS_TYPES.NOTEBOOKS_CANVAS:
        window.location.href = `/library/workpapers/${workpaperId}/outputs/${output.id}`;
        break;
      default:
        const url = mainWorkpaperId
          ? `/workpapers/${mainWorkpaperId}/${workpaperId}/datamodelOutputs/${output.id}`
          : `/workpapers/${workpaperId}/outputs/${output.id}`;
        window.location.href = url;
        break;
    }
  };

  const renderContentNavMenu = () => {
    const options = outputs
      .filter(output => output?.status !== OUTPUT_STATUS.ERROR)
      .map(output => {
        return { id: output.id, text: output.name };
      });

    return <ContextMenu options={options} onOptionClicked={handleNavToOutput} dataInstance={COMPONENT_NAME} />;
  };

  return (
    <Box display='inline-block'>
      <Flex alignItems='center' onClick={handleContextButton}>
        <Text type={TextTypes.H1}>{outputName}</Text>
        <Icon type={IconTypes.CHEVRON_DOWN} size={25} ml={2} />
      </Flex>

      {outputs && (
        <Popover
          isOpen={isNavOpen}
          anchorRef={contextNavChevronRef}
          anchorOriginY={PopoverOrigin.END}
          onClose={() => setIsNavOpen(false)}
          mt={4}
          maxHeight={outputs[0].trifactaOutputId ? '35vh' : 'auto'}
          overflowY='auto'
        >
          {renderContentNavMenu()}
        </Popover>
      )}
    </Box>
  );
};

export default WpOutputNavigation;
