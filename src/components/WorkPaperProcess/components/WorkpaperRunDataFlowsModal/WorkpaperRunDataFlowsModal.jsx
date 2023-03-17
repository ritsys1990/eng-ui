import { Box, Checkbox, Modal, ModalSizes, Spinner, Text, TextTypes } from 'cortex-look-book';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from 'reflexbox';
import useTranslation from '../../../../hooks/useTranslation';
import { runSpecificDataFlows } from '../../../../store/dataWrangler/actions';
import { datawranglerSelectors } from '../../../../store/dataWrangler/selectors';

export const COMPONENT_NAME = 'WorkpaperRunDataFlowsModal';
const TRANSLATION_KEY = 'Component_WorkpaperRunDataFlowsModal';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WorkpaperRunDataFlowsModal = props => {
  const { isOpen, onClose, trifactaFlowId, engagementId, workpaperId, isRunningWorkpaper, onDone } = props;

  const { t } = useTranslation();
  const flowDetails = useSelector(datawranglerSelectors.flowDetails(workpaperId));
  const isFetchingFlowDetails = useSelector(datawranglerSelectors.isFetchingFlowDetails(workpaperId));
  const isRunningSpecificDataFlows = useSelector(datawranglerSelectors.isRunningSpecificDataFlows(workpaperId));
  const [sortedFlowDetails, setSortedFlowDetails] = useState(flowDetails);
  const dispatch = useDispatch();

  const [selectedFlows, setSelectedFlows] = useState([]);

  useEffect(() => {
    if (flowDetails && flowDetails.flowNodes?.data?.length > 0) {
      setSelectedFlows(flowDetails.flowNodes.data);

      const newFlowDetails = { ...flowDetails };
      newFlowDetails.flowNodes.data = newFlowDetails.flowNodes?.data?.sort((a, b) => {
        const nameA = a.recipe?.name.toUpperCase();
        const nameB = b.recipe?.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });

      setSortedFlowDetails(newFlowDetails);
    }
  }, [flowDetails]);

  const isSelecetedFlow = nodeId => {
    return selectedFlows.filter(flow => flow.id === nodeId).length > 0;
  };

  const onClickCheckbox = nodeId => {
    let newSeletected = [];

    if (isSelecetedFlow(nodeId)) {
      selectedFlows.forEach(flow => {
        if (flow.id !== nodeId) {
          newSeletected = [...newSeletected, flow];
        }
      });
    } else {
      newSeletected = [...selectedFlows, flowDetails.flowNodes?.data?.find(flow => flow.id === nodeId)];
    }

    setSelectedFlows(newSeletected);
  };

  const areAllSelected = () => {
    return selectedFlows.length === flowDetails.flowNodes?.data?.length;
  };

  const onClickSelectAll = () => {
    if (areAllSelected()) {
      setSelectedFlows([]);
    } else {
      setSelectedFlows(flowDetails.flowNodes.data);
    }
  };

  const onRunDataFlows = () => {
    const outputsNames = selectedFlows.map(flow => flow.recipe.name);
    if (!isRunningWorkpaper(outputsNames)) {
      dispatch(runSpecificDataFlows(trifactaFlowId, outputsNames, engagementId, workpaperId)).then(() => {
        onDone();
        onClose();
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onPrimaryButtonClick={onRunDataFlows}
      onSecondaryButtonClick={onClose}
      primaryButtonText={t(`${TRANSLATION_KEY}_Run`)}
      secondaryButtonText={t(`${TRANSLATION_KEY}_Cancel`)}
      disablePrimaryButton={selectedFlows.length === 0 || isRunningSpecificDataFlows}
      disableSecondaryButton={isRunningSpecificDataFlows}
      size={ModalSizes.SMALL}
      dataInstance={`${COMPONENT_NAME}-Modal`}
    >
      <Spinner spinning={isFetchingFlowDetails || isRunningSpecificDataFlows} dataInstance={COMPONENT_NAME}>
        <Text dataInstance={`${COMPONENT_NAME}-Title`} type={TextTypes.H2}>
          {t(`${TRANSLATION_KEY}_Title`)}
        </Text>
        <Text dataInstance={`${COMPONENT_NAME}-Title`} type={TextTypes.BODY} mt={10}>
          {t(`${TRANSLATION_KEY}_Description`)}
        </Text>
        {flowDetails && flowDetails.flowNodes?.data?.length > 0 && (
          <Box my={10}>
            <Checkbox
              dataInstance={`${COMPONENT_NAME}-SelectAll`}
              label={areAllSelected() ? t(`${TRANSLATION_KEY}_DeselectAll`) : t(`${TRANSLATION_KEY}_SelectAll`)}
              isChecked={areAllSelected()}
              onChange={onClickSelectAll}
            />
          </Box>
        )}
        {sortedFlowDetails &&
          sortedFlowDetails.flowNodes?.data?.map(flowNode => {
            return (
              <Box my={8} key={`${COMPONENT_NAME}-Checkbox-${flowNode.id}`}>
                <Checkbox
                  label={flowNode.recipe?.name}
                  isChecked={isSelecetedFlow(flowNode.id)}
                  onChange={() => {
                    onClickCheckbox(flowNode.id);
                  }}
                  dataInstance={`${COMPONENT_NAME}-Checkbox-${flowNode.id}`}
                />
              </Box>
            );
          })}
        {flowDetails && flowDetails.flowNodes?.data?.length === 0 && (
          <Flex justifyContent='center' my={20}>
            <Text dataInstance={`${COMPONENT_NAME}-NoRunFlow`} type={TextTypes.BODY}>
              {t(`${TRANSLATION_KEY}_NoRunFlows`)}
            </Text>
          </Flex>
        )}
      </Spinner>
    </Modal>
  );
};

WorkpaperRunDataFlowsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trifactaFlowId: PropTypes.number.isRequired,
  workpaperId: PropTypes.string.isRequired,
  engagementId: PropTypes.string.isRequired,
  isRunningWorkpaper: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default WorkpaperRunDataFlowsModal;
