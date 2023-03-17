import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Breadcrumbs,
  Container,
  Spinner,
  Flex,
  Text,
  TextTypes,
  Box,
  AlertHub,
  Button,
  ButtonTypes,
  Icon,
  IconTypes,
  Tooltip,
  TooltipPosition,
  Alert,
  AlertTypes,
} from 'cortex-look-book';
import WPProgressBarTrifacta from '../../components/WorkPaperProcess/components/WorkpaperProcessing/WPProgressBarTrifacta';
import ProcessWorkpaperTrifacta from '../../components/WorkPaperProcess/components/WorkpaperProcessing/ProcessWorkpaperTrifacta';
import DataWranglerModal from './DataWranglerModal';
import { ThemeContext } from 'styled-components';
import Iframe from 'react-iframe';
import env from 'env';
import { getWorkpaperDMTs, getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { getFlowDetails, getFlowIsModified } from '../../store/dataWrangler/actions';
import { deleteWPProcessingErrors, resetWPProcessingErrors } from '../../store/errors/actions';
import { errorsSelectors } from '../../store/errors/selectors';
import { WPProcessingSelectors } from '../../store/workpaperProcess/step2/selectors';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { datawranglerSelectors } from '../../store/dataWrangler/selectors';
import useNavContext from '../../hooks/useNavContext';
import { securitySelectors } from '../../store/security/selectors';
import { COMPONENT_NAME } from '../../components/WorkPaperProcess/constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';
import { getCanvasType } from 'src/utils/workpaperProcessHelper';
import TrifactaRecipeHistoryModal from '../../components/TrifactaRecipeHistory/TrifactaRecipeHistoryModal';
import PropTypes from 'prop-types';

const PAGE_NAME = 'Data_Wrangler';

const getWorkpaperIdFromParams = (params, options = {}) => {
  if (options.isDMT) {
    return params.datamodelTransformationId;
  }

  return params.workpaperId;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const DataWrangler = ({ match, isDMT }) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [resetPosition, setResetPosition] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [sampleWarning, setSampleWarning] = useState(true);
  const [closedRunningWarning, setClosedRunningWarning] = useState(false);
  const [showModifiedWarning, setShowModifiedWarning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trifactaRecipeHistoryShow, setTrifactaRecipeHistoryShow] = useState(false);
  const [isRecipeHistoryLoading, setIsRecipeHistoryLoading] = useState(false);
  const [workpaper, setWorkpaper] = useState(null);

  const isFlowRunning = value => setIsRunning(value);
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();

  const permissions = useSelector(securitySelectors.selectPermissions);
  const baseWorkpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const dmt = useSelector(wpProcessSelectors.selectDMT(match.params.datamodelTransformationId));
  const isFlowModified = useSelector(
    datawranglerSelectors.isFlowModified(getWorkpaperIdFromParams(match.params, { isDMT }))
  );
  const isLoading = useSelector(WPProcessingSelectors.isLoading(getWorkpaperIdFromParams(match.params, { isDMT })));
  const errors = useSelector(
    errorsSelectors.selectWorkpaperProcessingErrors(getWorkpaperIdFromParams(match.params, { isDMT }))
  );
  const isValidatingFlow = useSelector(
    datawranglerSelectors.selectIsValidatingFlow(getWorkpaperIdFromParams(match.params, { isDMT }))
  );

  const canvasType = getCanvasType(baseWorkpaper);

  const getWorkpaperPermission = permission => {
    return window.location.pathname.indexOf('library') !== -1 ? permission.workItems : permission.engagementWorkpapers;
  };

  const hasWorkpaperPermissions = permissions ? getWorkpaperPermission(permissions.permissions) : { view: true };
  const { view, ...restPermissions } = hasWorkpaperPermissions;

  const hasPermissions = view && Object.values(restPermissions).some(val => val);
  const isUserPartOfTrifactaUserGroup = localStorage.getItem('isUserPartOfTrifactaGroup') === 'true';

  const hasTrifactaFlowPermission = workpaper && (workpaper.engagementId === null || isUserPartOfTrifactaUserGroup);

  const handleScroll = () => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      setScrolled(true);
    }, 2000);
  };

  useEffect(() => {
    if (isDMT) {
      setWorkpaper(dmt);
    } else {
      setWorkpaper(baseWorkpaper);
    }
  }, [baseWorkpaper, dmt, isDMT]);

  useEffect(() => {
    dispatch(resetWPProcessingErrors({ workpaperId: match.params.workpaperId }));

    return () => {
      dispatch(resetWPProcessingErrors({ workpaperId: match.params.workpaperId }));
    };
  }, [dispatch, match.params.workpaperId]);

  useEffect(() => {
    if (!scrolled) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    dispatch(getWorkpapersDetails(match.params.workpaperId));

    if (isDMT) {
      dispatch(getWorkpaperDMTs(match.params.workpaperId));
    }
  }, [match.params, isDMT, dispatch]);

  useEffect(() => {
    if (workpaper) {
      dispatch(getFlowIsModified(workpaper?.id, workpaper.trifactaFlowId));
      dispatch(getFlowDetails(workpaper?.id, workpaper?.trifactaFlowId));
    }
  }, [workpaper]);

  useEffect(() => {
    setShowModifiedWarning(isFlowModified);
  }, [isFlowModified]);

  useEffect(() => {
    if (isRunning === false) {
      setClosedRunningWarning(false);
    }
  }, [isRunning]);

  const onErrorClose = errorKey => {
    dispatch(deleteWPProcessingErrors(errorKey, { workpaperId: workpaper?.id }));
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onToggleIframe = () => {
    setToggle(!toggle);
    setResetPosition(false);
    setTimeout(() => {
      setResetPosition(true);
    }, 700);
  };

  const onRecipeHistoryLoader = isLoaded => {
    setIsRecipeHistoryLoading(isLoaded);
  };

  return hasPermissions ? (
    <>
      {hasTrifactaFlowPermission ? (
        <Container pb={20}>
          {toggle && (
            <Breadcrumbs crumbs={crumbs} fontSize='s' fontWeight={theme.fontWeights.m} mt={theme.space[9] - 4} />
          )}
          <Container px={theme.space[0]} mt={theme.space[3]}>
            {toggle && <AlertHub dataInstance={PAGE_NAME} alerts={errors || []} onClose={onErrorClose} mb={5} />}
            {workpaper && canvasType && (
              <>
                {toggle && (
                  <Text mb={5} textAlign='left' type={TextTypes.H1}>
                    {t('Pages_Trifacta_Content_Library_Data_Wrangler')}
                  </Text>
                )}
                <Spinner
                  spinning={isLoading || isValidatingFlow || isRecipeHistoryLoading}
                  overlayOpacity={0.5}
                  size={theme.space[11]}
                  pathSize={theme.space[2]}
                  label=''
                  optionalRender={false}
                >
                  {toggle && (
                    <>
                      <Box flexDirection='row' justifyContent='space-between' mb={10}>
                        <WPProgressBarTrifacta
                          workpaperId={workpaper.id}
                          flowIsRunning={isFlowRunning}
                          fromDataWrangler
                          isDMT={isDMT}
                        />
                        <ProcessWorkpaperTrifacta
                          workpaperId={workpaper.id}
                          canvasType={canvasType}
                          fromDataWrangler
                          isDMT={isDMT}
                          hideValidateRecipeButton={isDMT}
                          hideRunSpecificButton={isDMT}
                        />
                      </Box>
                      {isRunning && !closedRunningWarning && (
                        <Alert
                          message={t('Pages_TrifactaWorkpaperProcess_DataWrangler_Warning_FlowRunning')}
                          type={AlertTypes.WARNING}
                          mb={5}
                          id={`${COMPONENT_NAME}_Warning_Running`}
                          onClose={() => setClosedRunningWarning(true)}
                        />
                      )}
                      {showModifiedWarning && (
                        <Alert
                          message={t('Pages_TrifactaWorkpaperProcess_DataWrangler_Warning_FlowModified')}
                          type={AlertTypes.WARNING}
                          mb={5}
                          id={`${COMPONENT_NAME}_Warning_Modified`}
                          onClose={() => setShowModifiedWarning(false)}
                        />
                      )}
                      <DataWranglerModal isOpen={isOpen} onClose={onClose} />
                      {sampleWarning && (
                        <Alert
                          sx={{
                            fontWeight: 'bold',
                            color: '#ED8B00',
                          }}
                          message={t('pages_Trifacta_Alert_Info')}
                          type='warning'
                          color='blue6'
                          mb={5}
                          onClose={() => setSampleWarning(false)}
                          hasExtraLink='true'
                          extraLinkText={t('pages_Trifacta_Learn_More')}
                          handleExtraLink={onOpen}
                        />
                      )}
                    </>
                  )}
                  <Flex flexDirection='row' justifyContent='flex-end' mb={4}>
                    <Button
                      type={ButtonTypes.LINK}
                      icon={IconTypes.CLOCK}
                      iconWidth={20}
                      onClick={() => setTrifactaRecipeHistoryShow(true)}
                      dataInstance={`${COMPONENT_NAME}-History`}
                      p={3}
                    >
                      {t('Pages_WorkpaperProcess_Step2_Recipe_History')}
                    </Button>
                    <Button type={ButtonTypes.SECONDARY} onClick={onToggleIframe} ml={2} dataInstance={COMPONENT_NAME}>
                      <Tooltip
                        display='inline-block'
                        direction={TooltipPosition.BOTTOM}
                        tooltipContent={
                          toggle ? t('Pages_Trifacta_Tooltip_Maximize') : t('Pages_Trifacta_Tooltip_Minimize')
                        }
                        showOnHover={resetPosition}
                      >
                        <Icon type={toggle ? IconTypes.MAXIMIZE : IconTypes.MINIMIZE} height='28px' width='28px' />
                      </Tooltip>
                    </Button>
                  </Flex>
                  <Flex flexDirection='row' justifyContent='space-between'>
                    <Box
                      sx={{
                        borderRadius: '1px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        width: '100%',
                        borderColor: theme.colors['gray2'],
                      }}
                    >
                      <Iframe
                        url={`${env.TRIFACTA_URL}/flows/${workpaper.trifactaFlowId}`}
                        frameBorder='0'
                        id='frame'
                        height='760px'
                        width='100%'
                        scrolling='no'
                        aria-hidden='true'
                        title={t('Pages_Trifacta_Iframe_Title')}
                        allow='clipboard-read; clipboard-write'
                      />
                    </Box>
                  </Flex>
                  {trifactaRecipeHistoryShow && (
                    <TrifactaRecipeHistoryModal
                      onClose={() => setTrifactaRecipeHistoryShow(false)}
                      onRecipeHistoryLoader={onRecipeHistoryLoader}
                    />
                  )}
                </Spinner>
              </>
            )}
          </Container>
        </Container>
      ) : (
        <>
          {workpaper && workpaper?.engagementId !== null && !isUserPartOfTrifactaUserGroup && (
            <Alert
              message={t('Pages_DataWrangler_FlowId_Error')}
              type={AlertTypes.ERROR}
              mb={5}
              id={`${COMPONENT_NAME}_Warning_Modified`}
              onClose={() => {}}
            />
          )}
        </>
      )}
    </>
  ) : (
    <Box pt={12}>
      <Container>
        <Text>{t('Pages_Clients_NoPermissions')}</Text>
      </Container>
    </Box>
  );
};

DataWrangler.propTypes = {
  isDMT: PropTypes.bool,
};

DataWrangler.defaultProps = {
  isDMT: false,
};

export default DataWrangler;
