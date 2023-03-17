/* eslint-disable sonarjs/cognitive-complexity */
import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { COMPONENT_NAME } from './output.consts';
import {
  ModalSizes,
  TextTypes,
  GridView,
  GapSizes,
  Spinner,
  Intent,
  Alert,
  Modal,
  Input,
  Text,
  Flex,
  Box,
} from 'cortex-look-book';
import { updateOutputDataSetNames, deleteLabelError } from '../../../../store/workpaperProcess/step3/actions';
import { wpStep3Selectors } from '../../../../store/workpaperProcess/step3/selectors';
import { WORKPAPER_CANVAS_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { cloneDeep, uniq, remove, keyBy, intersection } from 'lodash';
import { removeSpecialChar } from './output.utils';
import useTranslation from 'src/hooks/useTranslation';
import { notebookWPStep3Selector } from '../../../../store/notebookWorkpaperProcess/step3/selectors';

const LabelDataSetModal = ({ isOpen, title, onClose, workpaperId, readOnlyfromWP, canvasType }) => {
  const { t } = useTranslation();

  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const [currentLabelList, setCurrentLabelList] = useState({});
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [outputList, setOutputList] = useState([]);

  let selector = wpStep3Selectors;
  if (canvasType === WORKPAPER_CANVAS_TYPES.NOTEBOOKS_CANVAS) {
    selector = notebookWPStep3Selector;
  }

  const selectIsSyncingOutputs = useSelector(wpStep3Selectors.selectIsSyncingOutputs);
  const duplicateLabelList = useSelector(wpStep3Selectors.duplicateLabelList);
  const isFetchingLabels = useSelector(wpStep3Selectors.isFetchingLabels);
  const isLabelUpdating = useSelector(wpStep3Selectors.isLabelUpdating);
  const engLabels = useSelector(wpStep3Selectors.engagmentLabels);
  const WPLabel = useSelector(wpStep3Selectors.activeWPLabels);
  const labelError = useSelector(wpStep3Selectors.labelError);
  const outputs = useSelector(selector.selectOutputs(workpaperId));
  const [engagmentLabels, setEngagementLabels] = useState([]);

  useEffect(() => {
    if (outputs) {
      setOutputList(cloneDeep([...outputs?.dataTable, ...outputs?.dqc]));
    }
  }, [outputs]);

  useEffect(() => {
    setEngagementLabels(engLabels?.filter(label => label !== '').map(label => removeSpecialChar(label)));
  }, [engLabels]);

  useEffect(() => {
    setCurrentLabelList({ ...WPLabel });
  }, [WPLabel]);

  useEffect(() => {
    if (labelError) {
      setIsAlertOpen(true);
    }
  }, [labelError]);

  const handleSubmit = () => {
    const finalLabelList = {};
    const outputListObject = keyBy(outputList, 'id');
    Object.keys(currentLabelList).forEach(element => {
      if (WPLabel[element] !== currentLabelList[element]) {
        finalLabelList[element] = outputListObject[element].dataSetName;
      }
    });
    if (Object.keys(finalLabelList).length > 0) {
      dispatch(updateOutputDataSetNames(finalLabelList, workpaperId)).then(resp => {
        if (resp) {
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    dispatch(deleteLabelError());
    onClose();
  };

  const handleAlertClose = () => {
    dispatch(deleteLabelError());
    setIsAlertOpen(false);
  };

  const validateLabelInput = (event, itemId, index) => {
    const comparableEvent = event.replace(/ /gi, '').toLowerCase();
    const expandList = [...outputList];
    expandList[index].dataSetName = event;
    setOutputList([...expandList]);
    setCurrentLabelList({ ...currentLabelList, [itemId]: comparableEvent });
    if (isButtonDisable) {
      setIsButtonDisable(false);
    }
  };

  const getButtonDisabled = () => {
    let temp = Object.values(currentLabelList);
    temp = temp.map(x => removeSpecialChar(x));
    remove(temp, function removeNull(n) {
      return !n || duplicateLabelList.includes(n.toUpperCase());
    });
    const uniqueLabels = uniq(temp);

    return uniqueLabels.length !== temp.length || intersection(uniqueLabels, engagmentLabels).length > 0;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onSecondaryButtonClick={handleClose}
      onPrimaryButtonClick={handleSubmit}
      primaryButtonText={t('Components_Engagement_Settings_Primary_Button_Text')}
      secondaryButtonText={t('Components_Engagement_Settings_Secondary_Button_Text')}
      size={ModalSizes.MEDIUM}
      disablePrimaryButton={getButtonDisabled() || isButtonDisable || readOnlyfromWP}
    >
      {isAlertOpen && (
        <Alert
          type={Intent.ERROR}
          message={labelError}
          onClose={() => handleAlertClose()}
          dataInstance={COMPONENT_NAME}
        />
      )}

      <Spinner spinning={isLabelUpdating || selectIsSyncingOutputs || isFetchingLabels} minHeight={200}>
        <Box>
          <Flex mb={5}>
            <Text type={TextTypes.H2} fontWeight='s' color='black'>
              {title}
            </Text>
            <Text type={TextTypes.H2} fontWeight='s' color='gray' pl={2}>
              {t('Components_HeaderHelp_Label_Datasets')}
            </Text>
          </Flex>
          <Flex mb={10}>
            <Text color='black' type={TextTypes.H3} fontWeight='s' mt={4}>
              {t('Components_HeaderHelp_LabelDataSet_Subtitle')}
            </Text>
          </Flex>
          <GridView dataInstance={`${COMPONENT_NAME}-Outputs`} gap={GapSizes.XXS} itemsPerRow={1} width='100%' mb={10}>
            <Flex
              sx={{
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: theme.colors['gray2'],
              }}
            >
              <Text color='gray' width='50%' mb={8}>
                {t('Components_HeaderHelp_DataSet_Name_Subtitle')}
              </Text>
              <Text color='gray' width='50%' mb={8}>
                {t('Components_HeaderHelp_DataSet_Label_Subtitle')}
              </Text>
            </Flex>

            {outputList?.map((item, index) => {
              let currentHint = '';
              let currentIntent = '';
              if (currentLabelList[item.id]) {
                const currentCompareLabel = removeSpecialChar(currentLabelList[item.id]);

                if (duplicateLabelList.includes(currentCompareLabel.toUpperCase())) {
                  // duplicate label allowed here
                } else if (
                  canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS &&
                  canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS &&
                  canvasType !== WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS &&
                  engagmentLabels.includes(currentCompareLabel)
                ) {
                  currentHint = t('Components_HeaderHelp_CurrentHit_DuplicateLabel');
                  currentIntent = t('Components_LabelDataSetModal_CurrentHint_Error');
                } else {
                  const comp = { ...currentLabelList };
                  delete comp[item.id];
                  let compValues = Object.values(comp);
                  compValues = compValues.map(compValue => removeSpecialChar(compValue));
                  if (compValues.includes(currentCompareLabel)) {
                    currentHint = t('Components_LabelDataSetModal_CurrentHint_DublicateLablel');
                    currentIntent = t('Components_LabelDataSetModal_CurrentHint_Error');
                  }
                }
              }

              return (
                <Box display='block' key={`${index}-box`}>
                  <Flex
                    pb={4}
                    sx={{
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                      borderBottomColor: theme.colors['gray2'],
                    }}
                    key={`${index}-FlexRoot`}
                    alignItems='center'
                  >
                    <Flex key={`${index}-FlexText`} width='50%'>
                      <Text color='black' ellipsisTooltip charLimit={40} dataInstance={`${index}-Text`}>
                        {item.name || item.fileName}
                      </Text>
                    </Flex>
                    <Input
                      disabled={readOnlyfromWP}
                      width='50%'
                      placeholder={t('Components_HeaderHelp_Label_Datasets')}
                      value={item.dataSetName ? item.dataSetName : ''}
                      dataInstance={`${index}-Labels`}
                      onChange={event => {
                        validateLabelInput(event.target.value, item.id, index);
                      }}
                      hint={currentHint}
                      intent={currentIntent}
                    />
                  </Flex>
                </Box>
              );
            })}
          </GridView>
        </Box>
      </Spinner>
    </Modal>
  );
};

export default LabelDataSetModal;
