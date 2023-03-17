import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Input, Intent, RadioGroup, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import {
  checkWorkpaperNameExists,
  createWorkpaper,
  createWPWithWorkflowAsync,
  getWorkpaperLabelConflicts,
} from '../../../../store/workpaper/actions';
import { addAddWorkpaperError, resetAddWorkpaperErrors } from '../../../../store/errors/actions';
import { ThemeContext } from 'styled-components';
import { AddWorkpaperConstants } from '../../constants/constants';
import {
  checkConflictsResolved,
  checkHasConflicts,
  getFirstConflict,
  getLabelConflictOptions,
  getLabelConflictOptionsAll,
  getLabelInputHint,
  getLabelInputIntent,
  checkInputConflict,
} from '../../utils/addWorkpaperHelper';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { COMPONENT_NAME } from './constants/constants';
import useTranslation from 'src/hooks/useTranslation';
import useDebounce from '../../../../hooks/useDebounce';

const TRANSLATION_KEY = 'Components_AddWorkpaperModal_Step2';

// eslint-disable-next-line sonarjs/cognitive-complexity
const NameWorkpaperStep = forwardRef((props, ref) => {
  const { handleClose } = props;
  const { engagementId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const selectedWorkpaper = useSelector(workpaperSelectors.selectAddWorkpaperSelected);
  const isCreatingWorkpaper = useSelector(workpaperSelectors.selectCreatingWorkpaper);
  const isFetchingLabelConflicts = useSelector(workpaperSelectors.selectFetchingLabelConflicts);

  const [wpName, setWpName] = useState(selectedWorkpaper.name);
  const [nameError, setNameError] = useState(false);
  const [labelConflicts, setLabelConflicts] = useState([]);
  const [labelConflictsSelected, setLabelConflictsSelected] = useState(AddWorkpaperConstants.REMOVE_SOURCE_LABEL);
  const [labelConflictsRadioSelected, setLabelConflictsRadioSelected] = useState({});

  const debouncedWpName = useDebounce(wpName, 500);

  const handleSubmit = () => {
    dispatch(resetAddWorkpaperErrors());
    if (checkConflictsResolved(labelConflicts) && !checkInputConflict(labelConflicts) && !nameError) {
      const data = {
        templateId: selectedWorkpaper.id,
        name: isEmpty(debouncedWpName) ? selectedWorkpaper.name : debouncedWpName,
        engagementId,
        workpaperConflicts: labelConflicts,
        versionNumber: selectedWorkpaper?.versionNumber,
      };
      if (selectedWorkpaper?.workpaperSource === 'Trifacta') {
        dispatch(createWPWithWorkflowAsync(data));
        handleClose();
      } else {
        dispatch(createWorkpaper(data)).then(response => {
          if (response && response.id) {
            handleClose();
          }
        });
      }
    } else {
      if (!checkConflictsResolved(labelConflicts) || checkInputConflict(labelConflicts)) {
        dispatch(
          addAddWorkpaperError({
            message: t(`${TRANSLATION_KEY}_LabelConflictsError`),
            type: 'error',
          })
        );
      }
      if (nameError) {
        dispatch(
          addAddWorkpaperError({
            message: t(`${TRANSLATION_KEY}_DuplicateName`),
            type: 'error',
          })
        );
      }
    }
  };

  const handleConflictAllChange = value => {
    const newLabelConflicts = [...labelConflicts];
    const newLabelConflictRadioSelected = {
      ...labelConflictsRadioSelected,
    };

    newLabelConflicts.forEach((conflict, index) => {
      if (!conflict.isNotConflict) {
        newLabelConflicts[index].isResolved = true;
        newLabelConflicts[index].resolutionAction =
          value !== AddWorkpaperConstants.EDIT_LABELS ? value : AddWorkpaperConstants.REMOVE_SOURCE_LABEL;
        newLabelConflictRadioSelected[index] = AddWorkpaperConstants.REMOVE_SOURCE_LABEL;
        newLabelConflicts[index].source.newDataSetName = null;
      }
    });
    setLabelConflicts(newLabelConflicts);
    setLabelConflictsRadioSelected(newLabelConflictRadioSelected);
  };

  const handleNameChange = event => {
    setWpName(event.target.value.replace('–', '-'));
  };

  const handleLabelRadioChange = (value, labelIndex) => {
    const newLabelConflictRadioSelected = {
      ...labelConflictsRadioSelected,
    };
    newLabelConflictRadioSelected[labelIndex] = value;
    setLabelConflictsRadioSelected(newLabelConflictRadioSelected);

    const newLabelConflicts = [...labelConflicts];
    newLabelConflicts[labelIndex].resolutionAction = value;
    newLabelConflicts[labelIndex].isResolved = value !== AddWorkpaperConstants.RENAME_SOURCE_LABEL;
    newLabelConflicts[labelIndex].source.newDataSetName = null;
    setLabelConflicts(newLabelConflicts);
  };

  const handleLabelInput = (name, conflictIndex) => {
    const newLabelConflicts = [...labelConflicts];
    newLabelConflicts[conflictIndex].source.newDataSetName = name;
    newLabelConflicts[conflictIndex].isResolved = !isEmpty(name);
    setLabelConflicts(newLabelConflicts);
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  useEffect(() => {
    if (!isEmpty(selectedWorkpaper)) {
      dispatch(getWorkpaperLabelConflicts(selectedWorkpaper.id, engagementId)).then(response => {
        if (response) {
          const newLabelConflictRadioSelected = {};
          response.forEach((conflict, index) => {
            if (!conflict.isNotConflict) {
              newLabelConflictRadioSelected[index] = AddWorkpaperConstants.REMOVE_SOURCE_LABEL;
              response[index].resolutionAction = AddWorkpaperConstants.REMOVE_SOURCE_LABEL;
              response[index].isResolved = true;
            }
          });

          setLabelConflicts(response);
          setLabelConflictsSelected(AddWorkpaperConstants.REMOVE_SOURCE_LABEL);
          setLabelConflictsRadioSelected(newLabelConflictRadioSelected);
        }
      });
      dispatch(checkWorkpaperNameExists(engagementId, selectedWorkpaper.name)).then(nameExists => {
        setNameError(nameExists);
      });
    }
  }, [dispatch, selectedWorkpaper, engagementId]);

  /**
   * Check if the name for the workpaper is available for the current engagement
   */
  useEffect(() => {
    if (debouncedWpName.length > 0) {
      dispatch(checkWorkpaperNameExists(engagementId, debouncedWpName)).then(nameExists => {
        setNameError(nameExists);
      });
    }
  }, [dispatch, debouncedWpName, engagementId]);

  return (
    <Spinner
      spinning={isCreatingWorkpaper || isFetchingLabelConflicts}
      overlayOpacity={0.8}
      label={isCreatingWorkpaper ? t(`${TRANSLATION_KEY}_SpinnerCreating`) : t(`${TRANSLATION_KEY}_SpinnerLoading`)}
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
            placeholder={selectedWorkpaper.name}
            value={wpName}
            onChange={handleNameChange}
            intent={nameError ? Intent.ERROR : ''}
            hint={nameError ? t(`${TRANSLATION_KEY}_DuplicateName`) : ''}
            dataInstance={`${COMPONENT_NAME}-Name`}
          />
        </Box>
        {labelConflicts && labelConflicts.length > 0 && checkHasConflicts(labelConflicts) && (
          <>
            <Text type={TextTypes.H2} fontWeight='l' mt={9} mb={6}>
              {t(`${TRANSLATION_KEY}_LabelTitle`)}
            </Text>
            <Text type={TextTypes.BODY} mb={9} color='errorBorder'>
              {t(`${TRANSLATION_KEY}_LabelErrorDescription`)}
            </Text>
            <Text type={TextTypes.BODY} mb={6}>
              {t(`${TRANSLATION_KEY}_LabelErrorChoice`)}
            </Text>
            <Box width='50%'>
              <RadioGroup
                fontSize='s'
                fontWeight='s'
                name='all'
                mb={4}
                options={getLabelConflictOptionsAll(
                  t,
                  getFirstConflict(labelConflicts).target.workpaperName,
                  getFirstConflict(labelConflicts).source.workpaperName
                )}
                selectedValue={labelConflictsSelected}
                onOptionChange={value => {
                  setLabelConflictsSelected(value);
                  handleConflictAllChange(value);
                }}
              />
              {labelConflictsSelected === AddWorkpaperConstants.EDIT_LABELS &&
                labelConflicts.map((conflict, index) => {
                  if (conflict.isNotConflict) {
                    return null;
                  }

                  return (
                    <Box key={index} theme={theme} mt={10}>
                      <Text type={TextTypes.H3} fontWeight='l' mb={6}>
                        {t(`${TRANSLATION_KEY}_UpdateLabelMessage`)} {conflict.source.dataSetName}
                      </Text>
                      <RadioGroup
                        fontSize='s'
                        fontWeight='s'
                        name={`${conflict.source.dataSetName}-${index}`}
                        mb={4}
                        options={getLabelConflictOptions(t, conflict.target.workpaperName, conflict.source.dataSetName)}
                        selectedValue={labelConflictsRadioSelected[index]}
                        onOptionChange={value => {
                          handleLabelRadioChange(value, index);
                        }}
                        dataInstance={`${COMPONENT_NAME}-${index}`}
                      />
                      {conflict.resolutionAction === AddWorkpaperConstants.RENAME_SOURCE_LABEL && (
                        <Box theme={theme} mt={8}>
                          <Input
                            value={conflict.source.newDataSetName || ''}
                            placeholder={conflict.source.dataSetName}
                            onChange={e => handleLabelInput(e.target.value, index)}
                            intent={getLabelInputIntent(labelConflicts[index], labelConflicts)}
                            hint={getLabelInputHint(labelConflicts[index], t, labelConflicts)}
                            dataInstance={`${COMPONENT_NAME}-Rename-${index}`}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                })}
            </Box>
          </>
        )}
      </Box>
    </Spinner>
  );
});

export default NameWorkpaperStep;
