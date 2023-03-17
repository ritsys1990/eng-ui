import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { wpViewOutputsSelectors } from '../../store/wpViewOutputs/selectors';
import { getWpViewOutputs } from '../../store/wpViewOutputs/actions';
import { Accordion, Box, Flex, Spinner, Text, TextTypes } from 'cortex-look-book';
import { WpViewOutputsActionTypes } from '../../store/wpViewOutputs/actionTypes';
import { ThemeContext } from 'styled-components';
import OutputsRow from './components/OutputsRow';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import WorkpaperHeader from './components/WorkpaperHeader';

const COMPONENT_NAME = 'WorkpaperViewOutput';

const WorkPaperViewOutputs = ({ id }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const isLoading = useSelector(wpViewOutputsSelectors.selectIsLoading);
  const data = useSelector(wpViewOutputsSelectors.selectData);
  const error = useSelector(wpViewOutputsSelectors.selectError);

  useEffect(() => {
    dispatch(getWpViewOutputs(id));

    return () => {
      dispatch({ type: WpViewOutputsActionTypes.RESET });
    };
  }, []);

  if (!isLoading && error) {
    return (
      <Flex p={10} align='center'>
        <Text mx='auto'>{t('ErrorOccurred', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}</Text>
      </Flex>
    );
  }

  return (
    <Box mb={7}>
      {isLoading && !error ? (
        <Spinner spinning={isLoading}>
          <Flex height={200} />
        </Spinner>
      ) : (
        <Box>
          {data && data.length ? (
            <Box>
              {data &&
                data.map((tag, i) => (
                  <Accordion
                    header={{ title: tag.tagName }}
                    titleBg={theme.colors.white}
                    titleFontSize={theme.fontSizes.s}
                    bodyBg={theme.colors.lightGray}
                    key={tag.tagId}
                    withBorders
                    dataInstance={`${COMPONENT_NAME}-${i}`}
                  >
                    <Box>
                      <Flex mb={6} color={theme.colors.gray} fontWeight={theme.fontWeights.m}>
                        <Text width='350px' type={TextTypes.BODY}>
                          {t('Components_ViewOutputs_WorkpaperLabel')}
                        </Text>
                        <Text width='150px' type={TextTypes.BODY}>
                          {t('Components_ViewOutputs_LastModifiedLabel')}
                        </Text>
                      </Flex>
                      {tag.workpapers.map((wp, j) => (
                        <Accordion
                          header={{
                            title: wp.name,
                            render: () => <WorkpaperHeader wp={wp} />,
                          }}
                          titleBg={theme.colors.lightGray2}
                          bodyBg={theme.colors.white}
                          key={wp.id}
                          dataInstance={`${COMPONENT_NAME}-${j}`}
                        >
                          {wp?.outputs && <OutputsRow outputs={wp.outputs} workpaperId={wp.id} engagementId={id} />}
                          {wp.tableau_outputs && wp.tableau_outputs[0] && (
                            <OutputsRow outputs={wp.tableau_outputs[0]} tableau workpaperId={wp.id} />
                          )}
                        </Accordion>
                      ))}
                    </Box>
                  </Accordion>
                ))}
            </Box>
          ) : (
            <Flex justifyContent='center' p={10}>
              <Text>{t('Pages_Client_ViewOutputsNoData')}</Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WorkPaperViewOutputs;
