import React, { forwardRef, useContext, useEffect, useState, useImperativeHandle } from 'react';
import { Box, Input, Intent, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { ThemeContext } from 'styled-components';
import useTranslation from 'src/hooks/useTranslation';
import useDebounce from '../../../../hooks/useDebounce';
import { EngPipelinesSelectors } from '../../../../store/engagement/pipelines/selectors';
import { resetAddPipelineError, addPipelineError } from '../../../../store/errors/actions';

import { pipelineNameExists, submitCLPipeline } from '../../../../store/engagement/pipelines/actions';

const COMPONENT_NAME = 'NamePipelineStep';
const TRANSLATION_KEY = 'Components_AddPipelineModal_Step2';

const NamePipelineStep = forwardRef((props, ref) => {
  const { handleClose, pipelineChange } = props;
  const { engagementId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const selectedPipeline = useSelector(EngPipelinesSelectors.selectAddPipelineSelected);
  const isCLPipelineCloning = useSelector(EngPipelinesSelectors.isCLPipelineCloning);

  const [nameError, setNameError] = useState(false);
  const [pipelineName, setPipelineName] = useState(selectedPipeline.pipelineName);

  const debouncedPipelineName = useDebounce(pipelineName.trim(), 500);

  useEffect(() => {
    pipelineChange(pipelineName);
  }, []);

  const handleSubmit = () => {
    dispatch(resetAddPipelineError());
    if (!nameError) {
      const data = {
        pipelineId: selectedPipeline.id,
        pipelineName: isEmpty(debouncedPipelineName) ? selectedPipeline.name : debouncedPipelineName,
      };
      dispatch(submitCLPipeline(engagementId, data));
      handleClose();
    } else if (nameError) {
      dispatch(
        addPipelineError({
          message: t(`${TRANSLATION_KEY}_DuplicateName`),
          type: 'error',
        })
      );
    }
  };

  const nameErrorHint = () => {
    if (nameError) {
      return t(`${TRANSLATION_KEY}_DuplicateName`);
    } else if (pipelineName === '') {
      return t(`${TRANSLATION_KEY}_Validation_Error`);
    }

    return null;
  };

  const handleNameChange = event => {
    const pipeline = event.target.value.replace('–', '-');
    setPipelineName(pipeline);
    pipelineChange(pipeline.trim());
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  /**
   * Check if the name for the Pipeline is available for the current engagement
   */
  useEffect(() => {
    if (debouncedPipelineName.length > 0) {
      dispatch(pipelineNameExists(engagementId, debouncedPipelineName)).then(nameExists => {
        setNameError(nameExists);
      });
    } else {
      setNameError(false);
    }
  }, [dispatch, debouncedPipelineName, engagementId]);

  return (
    <Spinner
      spinning={isCLPipelineCloning}
      overlayOpacity={0.8}
      label={isCLPipelineCloning ? t(`${TRANSLATION_KEY}_SpinnerCreating`) : t(`${TRANSLATION_KEY}_SpinnerLoading`)}
      minHeight='575px'
    >
      <Box theme={theme} width='100%' mt={8}>
        <Text type={TextTypes.H2} fontWeight='l' mb={6}>
          {t(`${TRANSLATION_KEY}_Title`)}
        </Text>
        <Text type={TextTypes.BODY} color='gray' mb={9}>
          {t(`${TRANSLATION_KEY}_Description`)}
        </Text>
        <Box maxWidth='350px'>
          <Input
            placeholder={selectedPipeline.name}
            name='pipelineName'
            value={pipelineName}
            onChange={handleNameChange}
            intent={nameError || pipelineName === '' ? Intent.ERROR : ''}
            hint={nameErrorHint()}
            dataInstance={`${COMPONENT_NAME}-Name`}
          />
        </Box>
      </Box>
    </Spinner>
  );
});

export default NamePipelineStep;
