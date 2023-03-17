import React, { useEffect } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonTypes,
  Container,
  FilePreview,
  FilePreviewTypes,
  Flex,
  Spinner,
  Text,
  TextTypes,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useNavContext from '../../hooks/useNavContext';
import useWarningModal from '../../hooks/useWarningModal';
import { useHistory, useParams } from 'react-router-dom';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { getInputDetails, getInput, resetInput } from '../../store/workpaperProcess/step1/actions';
import { isDecryptionNeeded, triggerWorkpaperDecryption } from '../../store/workpaperProcess/step2/actions';
import { LINE_LIMIT, TRANSLATION_KEY, COMPONENT_NAME } from './constants/WorkPaperInputDataConstants';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { wpStep1Selectors } from '../../store/workpaperProcess/step1/selectors';
import { engagementSelectors } from '../../store/engagement/selectors';

import useTranslation from '../../hooks/useTranslation';

const WorkPaperInputData = props => {
  const { match } = props;
  const { workpaperId, inputId } = useParams();
  const { crumbs } = useNavContext(match);
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const input = useSelector(wpStep1Selectors.selectInput);
  const inputDetails = useSelector(wpStep1Selectors.inputDetails);
  const isLoading = useSelector(wpStep1Selectors.isInputDetailsLoading);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const { renderWarningModal, showWarningModal } = useWarningModal();

  useEffect(() => {
    dispatch(getWorkpapersDetails(workpaperId));
    dispatch(getInput(workpaperId, inputId));
    dispatch(getInputDetails(workpaperId, inputId));

    return () => {
      dispatch(resetInput());
    };
  }, [dispatch, workpaperId, inputId]);

  useEffect(() => {
    if (input?.name) {
      document.title = `${input?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [input, t]);

  const handleBackToWorkpaper = () => {
    if (workpaper?.isDMT && !!workpaper?.trifactaFlowId) {
      history.push(`/library/datamodelTransformations/${workpaperId}`);
    } else if (workpaper?.bundleTransformation && !!workpaper?.trifactaFlowId) {
      history.push(`/library/bundleTransformations/${workpaperId}`);
    } else {
      history.push(workpaper?.engagementId ? `/workpapers/${workpaperId}` : `/library/workpapers/${workpaperId}`);
    }
  };

  const checkDecryptionStatus = () => {
    dispatch(isDecryptionNeeded(workpaper)).then(response => {
      if (!response) {
        history.push(`/workpapers/${workpaperId}/data`);
      } else if (response !== 'inprogress') {
        dispatch(triggerWorkpaperDecryption(workpaper)).then(resp => {
          if (resp) {
            showWarningModal(t('Pages_WorkpaperProcess_Decryption_Progress'), null, true);
          }
        });
      } else {
        showWarningModal(t('Pages_WorkpaperProcess_Decryption_Progress'), null, true);
      }
    });
  };

  const dataWranglerLink = () => {
    if (workpaper?.isDMT && !!workpaper?.trifactaFlowId) {
      history.push(`/library/datamodelTransformations/${workpaperId}/data`);
    } else if (workpaper?.bundleTransformation && !!workpaper?.trifactaFlowId) {
      history.push(`/library/bundleTransformations/${workpaperId}/data`);
    } else if (workpaper?.engagementId) {
      if (workpaper.trifactaFlowId && engagement && engagement.encryption) {
        checkDecryptionStatus();
      } else {
        history.push(`/workpapers/${workpaperId}/data`);
      }
    } else {
      history.push(`/library/workpapers/${workpaperId}/data`);
    }
  };

  return (
    <Spinner
      spinning={isLoading}
      overlayOpacity={0}
      minHeight='calc(100vh - 120px)'
      size={32}
      pathSize={4}
      label=''
      optionalRender
    >
      <Container backgroundColor='white'>
        <Breadcrumbs crumbs={crumbs} fontSize='s' fontWeight='m' pt={8} />
        <Text type={TextTypes.H1} mt={11}>
          {input?.name}
        </Text>
      </Container>
      {renderWarningModal()}

      <Box pt={9} backgroundColor='white'>
        <FilePreview
          type={FilePreviewTypes.FULL_SCREEN}
          json={inputDetails?.data}
          limit={LINE_LIMIT}
          dataInstance={`${COMPONENT_NAME}-FilePreview`}
        />
      </Box>

      <Flex
        justifyContent='space-between'
        flexDirection='row-reverse'
        alignItems='center'
        pt={9}
        pl={12}
        pr={12}
        mb={9}
      >
        <Flex justifyContent='flex-end' alignItems='center'>
          <Button
            type={ButtonTypes.SECONDARY}
            onClick={handleBackToWorkpaper}
            dataInstance={`${COMPONENT_NAME}-Continue`}
          >
            {t(`${TRANSLATION_KEY}_BackToWorkpaper`)}
          </Button>
        </Flex>
        {inputDetails?.data?.length > LINE_LIMIT && (
          <Button onClick={dataWranglerLink} dataInstance={`${COMPONENT_NAME}-SeeMore`}>
            {t('Pages_WorkpaperProcess_Input_SeeMore')}
          </Button>
        )}
      </Flex>
    </Spinner>
  );
};

export default WorkPaperInputData;
