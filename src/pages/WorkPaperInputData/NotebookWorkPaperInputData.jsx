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
import { useHistory, useParams } from 'react-router-dom';
import useTranslation from 'src/hooks/useTranslation';
import useNavContext from '../../hooks/useNavContext';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { getInput, resetInput, getInputFilePreview } from '../../store/notebookWorkpaperProcess/step1/actions';
import { notebookWPStep1Selector } from '../../store/notebookWorkpaperProcess/step1/selectors';
import { LINE_LIMIT, TRANSLATION_KEY, COMPONENT_NAME } from './constants/WorkPaperInputDataConstants';

const NotebookWorkPaperInputData = props => {
  const { match } = props;
  const { workpaperId, inputId, workpaperType } = useParams();
  const { crumbs } = useNavContext(match);
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const input = useSelector(notebookWPStep1Selector.selectInput);
  const isLoading = useSelector(notebookWPStep1Selector.isMappingScreenLoading);
  const preview = useSelector(notebookWPStep1Selector.preview);
  const isFetchingMappingsreenPreview = useSelector(notebookWPStep1Selector.isFetchingMappingsreenPreview);

  useEffect(() => {
    dispatch(getWorkpapersDetails(workpaperId, workpaperType)).then(() => {
      dispatch(getInput(workpaperId, inputId, workpaperType)).then(() => {
        dispatch(getInputFilePreview(inputId));
      });
    });

    return () => {
      dispatch(resetInput());
    };
  }, [workpaperId]);

  useEffect(() => {
    if (input?.name) {
      document.title = `${input?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [input, t]);

  const handleBackToWorkpaper = () => {
    history.push(`/library/workpapers/${workpaperId}`);
  };

  return (
    <Spinner
      spinning={isLoading || isFetchingMappingsreenPreview}
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

      <Box pt={9} backgroundColor='white'>
        <FilePreview
          type={FilePreviewTypes.FULL_SCREEN}
          json={preview?.data}
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
      </Flex>
    </Spinner>
  );
};

export default NotebookWorkPaperInputData;
