import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Flex,
  Text,
  Button,
  ButtonTypes,
  TextTypes,
  Accordion,
  Alert,
  AlertTypes,
  Icon,
  IconTypes,
  Table,
  TableTypes,
} from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { setTrifactaJRStep, processWorkpaper } from '../../../../store/workpaperProcess/step2/actions';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { COMPONENT_NAME } from '../../constants/WorkPaperProcess.const';
import useTranslation from '../../../../hooks/useTranslation';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';

const TRANSLATION_KEY = 'Pages_TrifactaWorkpaperProcess_Step2_JRSteps_List';

const TrifacataJRStepDetails = ({ recipe, flowId, workpaperId, isDMT, JRStepsDetails, index, ...extraprops }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showJRStepEditInfo, setShowJRStepEditInfo] = useState(true);
  const [isStepConfirmed, setIsStepConfirmed] = useState(false);
  const [isAllStepsConfirmed, setAllStepsConfirmed] = useState(false);
  const trifactaParams = useSelector(WPProcessingSelectors.trifactaJRSteps(workpaperId));
  const shouldAutoDmt = useSelector(wpStep1Selectors.autoDMTFlag);
  const workpaper = useSelector(isDMT ? wpProcessSelectors.selectDMT(workpaperId) : wpProcessSelectors.selectWorkPaper);
  const isDMTStepShown = useSelector(WPProcessingSelectors.isDMTStepShown);
  const engagement = useSelector(engagementSelectors.selectEngagement);

  const theme = useContext(ThemeContext);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onAccordionClick = () => {
    setIsAccordionOpen(true);
  };

  const onApproveTransformation = step => {
    const jrStepInfo = {
      id: step.stepId,
      dependencyId: step.dependencyId,
      approve: true,
    };
    dispatch(
      setTrifactaJRStep(workpaperId, flowId, [jrStepInfo], isDMT, isDMTStepShown, shouldAutoDmt, engagement?.encryption)
    );
    setIsStepConfirmed(true);
  };

  const formatJudgementSteps = () => {
    let steps = [];
    steps = recipe?.JudgementSteps.map(step => {
      return {
        id: step.stepId,
        dependencyId: step.dependencyId,
        approve: true,
      };
    });
    dispatch(
      setTrifactaJRStep(workpaperId, flowId, steps, isDMT, isDMTStepShown, shouldAutoDmt, engagement?.encryption)
    );
  };

  useEffect(() => {
    setAllStepsConfirmed(trifactaParams?.trifactaJRSteps[index].JudgementSteps.every(step => step.confirmed));
  }, [index, trifactaParams?.trifactaJRSteps]);

  useEffect(() => {
    if (
      isDMT &&
      isStepConfirmed &&
      trifactaParams?.trifactaJRSteps[0].JudgementSteps.every(step => step.confirmed) &&
      shouldAutoDmt &&
      !engagement?.encryption
    ) {
      dispatch(processWorkpaper(workpaperId, WORKPAPER_TYPES.TRIFACTA, workpaper?.trifactaFlowId));
    }
  }, [
    dispatch,
    trifactaParams?.trifactaJRSteps,
    workpaperId,
    workpaper?.trifactaFlowId,
    isStepConfirmed,
    isDMT,
    shouldAutoDmt,
  ]);

  const headers = [
    {
      key: 'jrStatus',
      render: (dataVal, row) => {
        if (row.confirmed) {
          return (
            <Icon
              type={IconTypes.CIRCLE_CHECKMARK}
              width={25}
              height={25}
              color={theme.components.accordion.colors.success}
            />
          );
        }

        return (
          <Icon
            type={IconTypes.MINUS_CIRCLE_TRANSPARENT}
            width={25}
            height={25}
            color={theme.components.accordion.colors.default}
          />
        );
      },
    },
    {
      title: t('Pages_EngagementWorkpapers_WorkpaperTable_Headers_Description'),
      key: 'jRDescription',
    },
    {
      key: 'jrApproval',
      render: (dataVal, row) => {
        return (
          <Flex justifyContent='flex-end' cursor='pointer' flex->
            <Button
              type={ButtonTypes.PRIMARY}
              onClick={() => onApproveTransformation(row)}
              disabled={row.confirmed}
              dataInstance={`${COMPONENT_NAME}-Approve-${row.stepId}`}
            >
              <Text type={TextTypes.Body}>{t(`${TRANSLATION_KEY}_JRStep_ApproveTransformation`)}</Text>
            </Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Accordion
        header={{
          title: recipe?.receipeName,
        }}
        ml={4}
        isOpened={isAccordionOpen}
        onClick={onAccordionClick}
        dataInstance={`${COMPONENT_NAME}-JRStepsForReceipe-${recipe?.receipeId}`}
        {...extraprops}
      >
        {showJRStepEditInfo && (
          <Alert
            type={AlertTypes.INFO}
            message={`${t(`${TRANSLATION_KEY}_JRSDescription_Part1`)} ${recipe?.receipeName} ${t(
              `${TRANSLATION_KEY}_JRSDescription_Part2`
            )}`}
            dataInstance={`${COMPONENT_NAME}-TrifactaParameterTableEditAlert`}
            mb={4}
            onClose={() => setShowJRStepEditInfo(false)}
          />
        )}
        <Table type={TableTypes.DEFAULT} headers={headers} rows={recipe?.JudgementSteps} charLimit={150} />
        <Flex justifyContent='flex-end' cursor='pointer' flex->
          <Button
            type={ButtonTypes.PRIMARY}
            onClick={formatJudgementSteps}
            disabled={isAllStepsConfirmed}
            dataInstance={`${COMPONENT_NAME}-Approve-ConfirmAll`}
            pt={4}
            pr={8}
          >
            <Text type={TextTypes.Body}>{t(`${TRANSLATION_KEY}_JRStep_ApproveAllTransformations`)}</Text>
          </Button>
        </Flex>
      </Accordion>
    </>
  );
};

export default TrifacataJRStepDetails;
