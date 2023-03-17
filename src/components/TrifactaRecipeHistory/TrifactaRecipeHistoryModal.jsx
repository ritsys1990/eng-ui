import React, { useState } from 'react';
import { AlertTypes, Modal, ModalSizes, Flex, Text, TextTypes, RadioGroup, Box, Input, Intent } from 'cortex-look-book';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation from 'src/hooks/useTranslation';
import { getEditRecipesHistory } from '../../store/dataWrangler/actions';
import { addWPProcessingErrors } from '../../store/errors/actions';
import { generateRecipeHistoryAlertMessage } from './utils/TrifactaRecipeHistoryModal.utils';
import { downloadFile } from '../../store/staging/actions';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { DATE_FORMAT_YMD, DATE_FORMAT_MDY, DATEPICKER_MAX } from './constants/constants';

export const COMPONENT_NAME = 'TrifactaRecipeHistoryModal';
const TRANSLATION_KEY = 'Pages_WorkpaperProcess_Step2_Recipe_History';

// eslint-disable-next-line sonarjs/cognitive-complexity
const TrifactaRecipeHistoryModal = ({ onClose, onRecipeHistoryLoader }) => {
  const { t } = useTranslation();

  const today = new Date();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [showAllDateRange, setShowAllDateRange] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showError, setShowError] = useState(false);

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  const isRequiredField = value => !!(value && value.length);
  const showFormErrors = value => Object.values(value).some(x => x !== null && x !== '');
  const validateForm = () => {
    const errors = {};
    const sDate = new Date(startDate).getTime();
    const eDate = new Date(endDate).getTime();

    errors.startDate =
      startDate && isRequiredField(startDate) && dayjs(startDate, DATE_FORMAT_YMD).format(DATE_FORMAT_YMD) === startDate
        ? null
        : t(`${TRANSLATION_KEY}_Date_Error`);

    errors.endDate =
      endDate && isRequiredField(endDate) && dayjs(endDate, DATE_FORMAT_YMD).format(DATE_FORMAT_YMD) === endDate
        ? null
        : t(`${TRANSLATION_KEY}_Date_Error`);

    errors.startDate = sDate < eDate ? null : t(`${TRANSLATION_KEY}_Date_Error`);

    errors.startDate = today > sDate ? null : t(`${TRANSLATION_KEY}_Date_Error`);

    return errors;
  };

  const handleGenerate = () => {
    let recipeHistoryStartDate = '';
    let recipeHistoryEndDate = '';

    const getTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!showAllDateRange) {
      recipeHistoryStartDate = startDate ? dayjs(startDate, DATE_FORMAT_MDY).format(DATE_FORMAT_MDY) : '';
      recipeHistoryEndDate = endDate ? dayjs(endDate, DATE_FORMAT_MDY).format(DATE_FORMAT_MDY) : '';
    }

    const err = validateForm();

    onRecipeHistoryLoader(true);

    dayjs.extend(dayjsPluginUTC);

    if (!showAllDateRange && showFormErrors(err)) {
      setShowError(true);
      onRecipeHistoryLoader(false);
    } else {
      dispatch(
        getEditRecipesHistory(
          workpaper.trifactaFlowId,
          recipeHistoryStartDate,
          recipeHistoryEndDate,
          getTimeZone,
          addWPProcessingErrors
        )
      ).then(response => {
        onRecipeHistoryLoader(false);
        if (response) {
          dispatch(
            addWPProcessingErrors(
              {
                type: AlertTypes.SUCCESS,
                message: generateRecipeHistoryAlertMessage(t, response.hasEntries, () => {
                  dispatch(
                    downloadFile(
                      response.reportUrl,
                      `${workpaper.name}${t(`${TRANSLATION_KEY}_RecipeHistoryReportName`)}${dayjs(
                        today,
                        DATE_FORMAT_MDY
                      ).format(DATE_FORMAT_MDY)}`,
                      'csv',
                      'text/csv'
                    )
                  );
                }),
              },
              { workpaperId: workpaper.id }
            )
          );
        }
      });
      handleClose();
    }
  };

  const errors = showError ? validateForm() : null;

  const recipeHistoryOptions = [
    {
      value: true,
      text: t('Pages_WorkpaperProcess_Step2_Recipe_History_All'),
    },
    {
      value: false,
      text: t('Pages_WorkpaperProcess_Step2_Recipe_History_Select_Custom_Date_Range'),
    },
  ];

  const renderCustomDateRange = () => {
    return (
      <>
        {showAllDateRange ? null : (
          <Flex mt={8} mb={20} pl={10}>
            <Input
              required
              label={t(`${TRANSLATION_KEY}_Start_Date`)}
              value={startDate}
              onChange={e => setStartDate(e.currentTarget.value)}
              name={t(`${TRANSLATION_KEY}_Start_Date`)}
              dataInstance={`${COMPONENT_NAME}-StartDate`}
              mr={5}
              type='date'
              max={DATEPICKER_MAX}
              hint={errors?.startDate}
              intent={errors?.startDate ? Intent.ERROR : null}
            />
            <Input
              required
              label={t(`${TRANSLATION_KEY}_End_Date`)}
              value={endDate}
              onChange={e => setEndDate(e.currentTarget.value)}
              name={t(`${TRANSLATION_KEY}_End_Date`)}
              dataInstance={`${COMPONENT_NAME}-EndDate`}
              type='date'
              max={DATEPICKER_MAX}
              hint={errors?.endDate}
              intent={errors?.endDate ? Intent.ERROR : null}
            />
          </Flex>
        )}
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onClickOutside={handleClose}
      onPrimaryButtonClick={handleGenerate}
      primaryButtonText={t('Components_TrifactaRecipeHistoryModal_PrimaryBtnText')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Box>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' color='black'>
            {t('Pages_WorkpaperProcess_Step2_Recipe_History')}
          </Text>
        </Flex>
        <br />
        <Flex mt={8} mb={6} p={2}>
          <RadioGroup
            dataInstance={`${COMPONENT_NAME}-Recipe_History_Options`}
            fontWeight='s'
            options={recipeHistoryOptions}
            selectedValue={showAllDateRange}
            onOptionChange={value => setShowAllDateRange(value)}
            py={6}
          />
        </Flex>
        {renderCustomDateRange()}
      </Box>
      <br />
    </Modal>
  );
};

export default TrifactaRecipeHistoryModal;
