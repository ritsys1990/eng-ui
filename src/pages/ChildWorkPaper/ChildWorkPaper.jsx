import React, { useContext, useEffect, useState, useCallback } from 'react';
import useTranslation from '../../hooks/useTranslation';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import { WORKPAPER_TYPES } from '../../utils/WorkpaperTypes.const';
import useNavContext from '../../hooks/useNavContext';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChildWorkPaperHeader from './components/ChildWorkPaperHeader';
import { ThemeContext } from 'styled-components';
import {
  COMPONENT_NAME,
  CHILD_WORKPAPER_INITIAL_STATE,
  CHILD_WORKPAPER_FORM_STATE,
  ChildWPLimits,
  CHILD_WORKPAPER_STATUS,
} from './constants/constants';
import {
  Accordion,
  AccordionTypes,
  Breadcrumbs,
  Container,
  Flex,
  Spinner,
  Button,
  ButtonTypes,
  IconTypes,
  Alert,
  AlertTypes,
  Tooltip,
  Box,
} from 'cortex-look-book';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { childWorkpaperSelectors } from '../../store/childWorkpapers/selectors';
import ChildWorkpaperTable from './components/ChildWorkpaperTable/ChildWorkpaperTable';
import {
  getChildWorkPapers,
  generateChildWorkpapers,
  getChildWpColumns,
  getAndSyncFlowOutputs,
} from '../../store/childWorkpapers/actions';
import FilterForm from './components/FilterForm';
import { wpStep3Selectors } from '../../store/workpaperProcess/step3/selectors';
import StepTitle from './components/StepTitle';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ChildWorkPaper = props => {
  const dispatch = useDispatch();
  const { match } = props;
  useEffect(() => {
    dispatch(getWorkpapersDetails(match.params.workpaperId, WORKPAPER_TYPES.TRIFACTA));
  }, [match.params.workpaperId, dispatch]);

  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();

  const engObj = crumbs.filter(c => c.id.toLowerCase() === 'engagement')[0];
  const engagementId = engObj ? engObj.to.substring(engObj?.to.lastIndexOf('/') + 1, engObj.to.length) : '';
  const theme = useContext(ThemeContext);
  const { workpaperId } = useParams();
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const [newChildWpValues] = useState(CHILD_WORKPAPER_INITIAL_STATE);
  const [newChildWpFormState] = useState(CHILD_WORKPAPER_FORM_STATE);
  const workpapersList = useSelector(childWorkpaperSelectors.childWorkPapersList);
  const fetchingChildWorkpapers = useSelector(childWorkpaperSelectors.fetchingChildWorkpapers);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [editChildWPClick, setEditChildWPClick] = useState(false);
  const [nameAndDescriptionValue, setNameAndDescriptionValue] = useState({});
  const [editChildWPDetails, setEditChildWPDetails] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [addNewChild, setAddNewChild] = useState(false);
  let childWpCount = useSelector(childWorkpaperSelectors.maxChildWorkPapersLimit);
  const isLoading = useSelector(wpProcessSelectors.selectIsLoading);
  const syncingOutputs = useSelector(wpStep3Selectors.selectIsSyncingOutputs);
  const selectIsFetchingOutput = useSelector(wpStep3Selectors.selectIsFetchingOutput);
  const [selectedChildWps, setSelectedChildWps] = useState([]);
  const [showWPGenerateErrorMsg, setWPGenerateErrorMsg] = useState(false);
  let generateOutputChildWpCount = useSelector(childWorkpaperSelectors.maxGenerateOutputChildWorkPapersLimit);
  const childWpDeleted = useSelector(childWorkpaperSelectors.selectIsDeletingChildWorkpaper);
  const [isGenerateOutputBtnEnable, setGenerateOutputBtnEnable] = useState(false);
  const isGenerateOutputSuccess = useSelector(childWorkpaperSelectors.isGenerateOutputSuccess);
  const [selectCheckAll, setselectCheckAll] = useState(false);

  if (selectedChildWps.length > 0 && workpapersList.length > 0 && childWpDeleted) {
    const checkedWps = [];
    selectedChildWps.forEach(cwp => {
      const childWP = workpapersList.filter(wpl => wpl.id === cwp)[0];
      if (childWP) {
        checkedWps.concat(childWP.id);
      }
    });
    setSelectedChildWps(checkedWps);
  }

  if (!childWpCount) {
    childWpCount = ChildWPLimits.maxSaveChildWpLimit;
  }

  if (!generateOutputChildWpCount) {
    generateOutputChildWpCount = ChildWPLimits.maxGenerateOutputChildWPLimit;
  }

  useEffect(() => {
    dispatch(getChildWorkPapers(workpaperId));
    dispatch(getChildWpColumns());
  }, [dispatch, workpaperId]);

  useEffect(() => {
    dispatch(getAndSyncFlowOutputs(workpaperId));
  }, [dispatch, workpaperId]);

  useEffect(() => {
    setAddNewChild(addNewChild);
  }, [addNewChild]);

  useEffect(() => {
    if (workpapersList.length > 0) {
      const childWPs = workpapersList.filter(
        wpl =>
          wpl.childWorkPaperStatus?.replace(/\s+/g, '').toLowerCase() === CHILD_WORKPAPER_STATUS.SUBMITTED ||
          wpl.childWorkPaperStatus?.replace(/\s+/g, '').toLowerCase() === CHILD_WORKPAPER_STATUS.INPROGRESS
      );
      if (childWPs.length > 0) {
        setGenerateOutputBtnEnable(true);
      } else {
        setGenerateOutputBtnEnable(false);
      }
    }
  }, [workpapersList]);

  useEffect(() => {
    const newEditChildWPDetails = { ...editChildWPDetails };
    if (newEditChildWPDetails?.childWorkPaperName) {
      const nameAndDecObj = {
        name: newEditChildWPDetails.childWorkPaperName,
        description: newEditChildWPDetails.description,
      };
      setNameAndDescriptionValue(nameAndDecObj);
    }
    if (newEditChildWPDetails?.filters?.length > 0) {
      setIsFilterApplied(newEditChildWPDetails.filters[0].hasFilter);
    }
  }, [editChildWPDetails]);

  const outputs = useSelector(childWorkpaperSelectors.outputs(workpaperId));

  const sortByNameAlphabetically = (a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  if (outputs && outputs?.dataTable?.length) {
    outputs.dataTable = outputs.dataTable.sort(sortByNameAlphabetically);
  }

  const getFiltersOpen = useCallback(() => {
    if (addNewChild || editChildWPClick) {
      return true;
    }

    return workpapersList.length === 0;
  }, [filtersOpen, addNewChild, workpapersList, editChildWPClick]);

  const getChildWorkpaperSectionOpen = useCallback(() => {
    if (editChildWPClick) {
      return false;
    }
    if (workpapersList.length > 0) {
      return true;
    }

    return false;
  }, [editChildWPClick, workpapersList]);

  const filtersAccordianClick = event => {
    const instance = `${COMPONENT_NAME}-Step1_Accordion-Header`;
    if (event?.target?.dataset?.instance === instance) {
      setFiltersOpen(false);
      if (addNewChild) {
        setAddNewChild(!addNewChild);
      }
    }
    if (Object.keys(editChildWPDetails)?.length !== 0 && !editChildWPClick) {
      setEditChildWPClick(true);
    }
  };

  const secondAccordianClick = () => {
    if (editChildWPClick) {
      setEditChildWPClick(false);
    }
  };

  const showFilters = () => {
    if (!addNewChild) {
      setAddNewChild(!addNewChild);
    }
  };

  const onChildWpChecked = (value, isChecked) => {
    setWPGenerateErrorMsg(false);
    if (isChecked) {
      setSelectedChildWps(selectedChildWps.filter(wp => wp !== value.id));
      setselectCheckAll(false);
    } else {
      setSelectedChildWps(selectedChildWps.concat(value.id));
    }
  };

  const onCheckboxAllChecked = isChecked => {
    setselectCheckAll(isChecked);
    setWPGenerateErrorMsg(false);
    if (isChecked) {
      if (workpapersList.length > 0) {
        workpapersList
          .filter(wp => wp.childWorkPaperStatus === CHILD_WORKPAPER_STATUS.DRAFT)
          .slice(0, ChildWPLimits.maxGenerateOutputChildWPLimit)
          .forEach(d => {
            selectedChildWps.push(d.id);
          });
      }
      setSelectedChildWps(selectedChildWps);
    } else {
      const emptyArray = [];
      setSelectedChildWps(emptyArray);
    }
  };

  const generateOutput = () => {
    if (selectedChildWps.length > generateOutputChildWpCount) {
      setWPGenerateErrorMsg(true);
    } else if (selectedChildWps.length > 0) {
      dispatch(generateChildWorkpapers(selectedChildWps)).then(resp => {
        if (resp) {
          dispatch(getChildWorkPapers(workpaperId));
        }
      });
    }
  };

  return (
    <Spinner spinning={isLoading}>
      <Container pb={20}>
        {workpaper && (
          <Breadcrumbs
            crumbs={crumbs}
            fontSize='s'
            fontWeight={theme.fontWeights.m}
            mt={4}
            dataInstance={`${COMPONENT_NAME}`}
          />
        )}
        <Flex justifyContent='space-between' alignItems='center' fontWeight='s' mt='3'>
          {workpaper && <ChildWorkPaperHeader wp={workpaper} />}
          <Flex alignItems='center'>
            {workpaper && workpapersList.length >= 1 && (
              <Button
                dataInstance={`${COMPONENT_NAME}-AddAnotherChild`}
                type={ButtonTypes.LINK}
                icon={IconTypes.PLUS_CIRCLE_THIN}
                iconWidth={24}
                onClick={showFilters}
                disabled={workpapersList.length >= childWpCount}
              >
                {t('Components_CHILDWP_ADD_ANOTHERCHILD')}
              </Button>
            )}
          </Flex>
        </Flex>

        <Container px='0' mt='10'>
          <Accordion
            isOpened={getFiltersOpen()}
            type={AccordionTypes.LARGE}
            header={{
              render: () => <StepTitle stepNum='' title={t('Components_Accordion_Name_Step1')} disabled={false} />,
            }}
            dataInstance={`${COMPONENT_NAME}-Step1`}
            onClick={event => filtersAccordianClick(event)}
          >
            <Container pb={20}>
              <Box ml={12} pl={5}>
                <Flex>{t('Components_CHILDWP_Filter_Input_Instruction_Text_Heading')}</Flex>
                <Flex>
                  <Box>1.</Box>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_1')}
                  </Box>
                </Flex>
                <Flex>
                  <Box>2.</Box>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_2')}
                  </Box>
                </Flex>
                <Flex>
                  <Box>3.</Box>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_3')}
                  </Box>
                </Flex>
                <Flex>
                  <Box>4.</Box>
                  <Box ml={4} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_4')}
                  </Box>
                </Flex>
                <Flex>
                  <Box>5.</Box>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_5')}
                  </Box>
                </Flex>
                <Flex>
                  <Box>6.</Box>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_6')}
                  </Box>
                </Flex>
                <Flex>
                  <Box>7.</Box>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Filter_Input_Instruction_Step_7')}
                  </Box>
                </Flex>
              </Box>
            </Container>
            <FilterForm
              engagementId={engagementId}
              outputs={outputs}
              workpaperId={workpaperId}
              formState={newChildWpFormState}
              formValue={newChildWpValues}
              workpaper={workpaper}
              setIsOpenFirstStep={setFiltersOpen}
              setFiltersOpen={setFiltersOpen}
              setAddNewChild={setAddNewChild}
              childworkpaperCount={workpapersList.length}
              syncingOutputs={syncingOutputs}
              selectIsFetchingOutput={selectIsFetchingOutput}
              maxChildWPLimit={childWpCount}
              isLoading={isLoading}
              editChildWPClick={editChildWPClick}
              nameAndDescriptionValue={nameAndDescriptionValue}
              isFilterApplied={isFilterApplied}
              editChildWPDetails={editChildWPDetails}
              setEditChildWPClick={setEditChildWPClick}
              setEditChildWPDetails={setEditChildWPDetails}
            />
          </Accordion>
          <Accordion
            isOpened={getChildWorkpaperSectionOpen()}
            type={AccordionTypes.LARGE}
            header={{
              render: () => <StepTitle stepNum='' title={t('Components_Accordion_Name_Step2')} disabled={false} />,
            }}
            disabled={!workpapersList.length > 0}
            dataInstance={`${COMPONENT_NAME}-Step2`}
            onClick={() => secondAccordianClick()}
          >
            <Container>
              <Box ml={12} pl={5}>
                <Flex>
                  <Box ml={2} pl={2}>
                    {t('Components_CHILDWP_Child_Section_Input_Instruction_Text_Heading')}
                  </Box>
                </Flex>
              </Box>
            </Container>
            {showWPGenerateErrorMsg && (
              <Alert
                message={t('Components_CHILDWP_GenerateOutput_Error').replaceAll(
                  `${'maxChildgenerateCount'}`,
                  generateOutputChildWpCount
                )}
                type={AlertTypes.WARNING}
                mb={5}
                id={`${COMPONENT_NAME}_Warning_Modified`}
                onClose={() => setWPGenerateErrorMsg(false)}
              />
            )}
            <Spinner spinning={fetchingChildWorkpapers || isGenerateOutputSuccess}>
              <Flex justifyContent='flex-end'>
                {workpapersList.length > 0 && (
                  <Tooltip
                    type='default'
                    tooltipContent={t('Components_CHILDWP_GenerateOutput_Tooltip')}
                    dataInstance={`${COMPONENT_NAME}-GenerateOutputTooltip`}
                    width='200px'
                    showOnHover={isGenerateOutputBtnEnable}
                    disabled
                  >
                    <Button
                      dataInstance={`${COMPONENT_NAME}-GenerateOutput`}
                      type={ButtonTypes.PRIMARY}
                      onClick={generateOutput}
                      disabled={selectedChildWps.length <= 0 || isGenerateOutputBtnEnable}
                      mb={10}
                    >
                      {t('Components_CHILDWP_GenerateOutput')}
                    </Button>{' '}
                  </Tooltip>
                )}
              </Flex>

              <ChildWorkpaperTable
                rows={workpapersList}
                setFiltersOpen={setFiltersOpen}
                setEditChildWPClick={setEditChildWPClick}
                setEditChildWPDetails={setEditChildWPDetails}
                onChildWpChecked={onChildWpChecked}
                onCheckboxAllChecked={onCheckboxAllChecked}
                selectedChildWps={selectedChildWps}
                hideGenerateOutputErrorMessage={() => setWPGenerateErrorMsg(false)}
                editElpsisEnable={isGenerateOutputBtnEnable}
                selectCheckAll={selectCheckAll}
                dataInstance={`${COMPONENT_NAME}-ChildWorkpaperTable`}
              />
            </Spinner>
          </Accordion>
        </Container>
      </Container>
    </Spinner>
  );
};

export default ChildWorkPaper;
