import React, { useEffect } from 'react';
import { Spinner, AlertHub, Text, TextTypes } from 'cortex-look-book';
import TrifactaParameters from '../WorkpaperProcessing/TrifactaParameters';
import TrifactaJRSteps from '../WorkpaperProcessing/TrifactaJRSteps';
import ProcessWorkpaperTrifacta from '../WorkpaperProcessing/ProcessWorkpaperTrifacta';
import WPProgressBarTrifacta from '../WorkpaperProcessing/WPProgressBarTrifacta';
import { useDispatch, useSelector } from 'react-redux';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { errorsSelectors } from '../../../../store/errors/selectors';
import { datawranglerSelectors } from '../../../../store/dataWrangler/selectors';
import { deleteWPProcessingErrors } from '../../../../store/errors/actions';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { getFlowDetails } from '../../../../store/dataWrangler/actions';

const COMPONENT_NAME = 'WorkpaperDataModelTransformation';

const WorkpaperDataModelTransformation = ({ workpaperId, canvasType, workpaperType, inputName }) => {
  const dispatch = useDispatch();

  const dmt = useSelector(wpProcessSelectors.selectDMT(workpaperId));
  const isLoading = useSelector(WPProcessingSelectors.isLoading(workpaperId));
  const fetchingTrifactaJRSteps = useSelector(WPProcessingSelectors.fetchingTrifactaJRSteps(workpaperId));
  const fetchingTrifactaParams = useSelector(WPProcessingSelectors.fetchingTrifactaParams(workpaperId));
  const errors = useSelector(errorsSelectors.selectWorkpaperProcessingErrors(workpaperId));
  const isFetchingFlowDetails = useSelector(datawranglerSelectors.isFetchingFlowDetails(workpaperId));
  const isValidatingFlow = useSelector(datawranglerSelectors.selectIsValidatingFlow(workpaperId));
  const isRunningSpecificDataFlows = useSelector(datawranglerSelectors.isRunningSpecificDataFlows(workpaperId));

  useEffect(() => {
    dispatch(getFlowDetails(dmt?.id, dmt?.trifactaFlowId));
  }, [dispatch, dmt]);

  const onErrorClose = errorKey => {
    dispatch(deleteWPProcessingErrors(errorKey, { workpaperId }));
  };

  return (
    <Spinner
      spinning={
        isLoading ||
        fetchingTrifactaParams ||
        fetchingTrifactaJRSteps ||
        isFetchingFlowDetails ||
        isValidatingFlow ||
        isRunningSpecificDataFlows
      }
      overlayOpacity={0.5}
      size={11}
      pathSize={2}
      label=''
      optionalRender={false}
      dataInstance={COMPONENT_NAME}
    >
      <Text type={TextTypes.H3} fontWeight='l' mb={6}>
        {inputName || dmt.name}
      </Text>
      <AlertHub dataInstance={COMPONENT_NAME} alerts={errors || []} onClose={onErrorClose} mb={5} />
      <WPProgressBarTrifacta workpaperId={workpaperId} isDMT />
      <TrifactaParameters workpaperId={workpaperId} workpaperType={workpaperType} canvasType={canvasType} isDMT />
      <TrifactaJRSteps workpaperId={workpaperId} canvasType={canvasType} isDMT />
      <ProcessWorkpaperTrifacta
        workpaperId={workpaperId}
        canvasType={canvasType}
        isDMT
        hideValidateRecipeButton
        hideRunSpecificButton
      />
    </Spinner>
  );
};

export default WorkpaperDataModelTransformation;
