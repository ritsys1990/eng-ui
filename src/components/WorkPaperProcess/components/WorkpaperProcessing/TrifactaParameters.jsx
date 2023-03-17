import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Flex,
  Table,
  Text,
  Button,
  ButtonTypes,
  IconTypes,
  TextTypes,
  Accordion,
  AccordionTypes,
  ProgressBarTypes,
  Alert,
  AlertTypes,
} from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { getTrifactaParams, setTrifactaParam } from '../../../../store/workpaperProcess/step2/actions';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { COMPONENT_NAME } from '../../constants/WorkPaperProcess.const';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_TrifactaWorkpaperProcess_Step2_ParametersTable';

const TrifactaParameters = ({ workpaperId, isDMT }) => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const trifactaParameters = useSelector(WPProcessingSelectors.trifactaParameters(workpaperId));
  const workpaper = useSelector(isDMT ? wpProcessSelectors.selectDMT(workpaperId) : wpProcessSelectors.selectWorkPaper);
  const workpaperProgress = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));

  const [editRowId, setEditRowId] = useState('');
  const [editValue, setEditValue] = useState('');
  const [showEditParamsInfo, setShowEditParamsInfo] = useState();
  const [isAccordionOpen, setisAccordionOpen] = useState(true);
  const [rows, setRows] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getTrifactaParams(workpaperId, workpaper?.trifactaFlowId));
  }, [dispatch, workpaperId, workpaper?.trifactaFlowId]);

  useEffect(() => {
    setRows(trifactaParameters || []);
  }, [trifactaParameters]);

  const setAccordionOpenState = () => {
    setisAccordionOpen(true);
  };

  const editOnChange = e => {
    e.stopPropagation();
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleEditClick = (e, row) => {
    e.stopPropagation();
    e.preventDefault();
    setEditValue(row?.parameterValue);
    setEditRowId(row?.id);
    setShowEditParamsInfo(true);
  };

  const onSaveParameter = () => {
    const currentParam = rows.find(row => row.id === editRowId);
    const updatedParam = {
      parameterValue: editValue,
      parameterName: currentParam?.parameterName,
      flowId: workpaper.trifactaFlowId,
      id: currentParam?.id,
    };
    setEditRowId('');
    setEditValue('');
    dispatch(setTrifactaParam(workpaperId, updatedParam));
  };

  const headers = [
    {
      title: t(`${TRANSLATION_KEY}_ParamHeaderName`),
      key: 'parameterName',
    },
    {
      title: t(`${TRANSLATION_KEY}_ParamHeaderValue`),
      key: 'parameterValue',
      editable: true,
    },
    {
      key: 'id',
      render: (id, row) => {
        if (id === editRowId) {
          return (
            <Flex justifyContent='flex-end' cursor='pointer' flex->
              <Button type={ButtonTypes.PRIMARY} onClick={() => onSaveParameter()} mr={5}>
                <Text type={TextTypes.Body}>{t('Save', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}</Text>
              </Button>
              <Button type={ButtonTypes.SECONDARY} onClick={() => setEditRowId('')}>
                <Text type={TextTypes.Body}>{t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}</Text>
              </Button>
            </Flex>
          );
        }

        return (
          <Flex justifyContent='flex-end' cursor='pointer'>
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.EDIT_PENCIL}
              iconWidth={20}
              disabled={editRowId !== '' || workpaperProgress?.status === ProgressBarTypes.RUNNING}
              onClick={e => handleEditClick(e, row)}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      {trifactaParameters?.length > 0 && (
        <>
          <Text type={TextTypes.H3} color={theme.colors.black54} mb={5}>
            {t(`${TRANSLATION_KEY}_AccordionTitle`)}
          </Text>
          <Accordion
            type={AccordionTypes.DEFAULT}
            header={{
              title: t(`${TRANSLATION_KEY}_AccordionTitle`),
            }}
            mb={11}
            isOpened={isAccordionOpen}
            onClick={setAccordionOpenState}
            dataInstance={`${COMPONENT_NAME}-TrifactaParameterList`}
            ml={4}
          >
            <>
              {editRowId !== '' && showEditParamsInfo && (
                <Alert
                  type={AlertTypes.INFO}
                  message={t(`${TRANSLATION_KEY}_EditParamMessage`)}
                  dataInstance={`${COMPONENT_NAME}-TrifactaParameterTableEditAlert`}
                  mb={4}
                  onClose={() => setShowEditParamsInfo(false)}
                />
              )}

              <Table
                headers={headers}
                rows={rows}
                editRowId={editRowId}
                editOnChange={editOnChange}
                editValue={editValue}
                rowIdKey='id'
                dataInstance={`${COMPONENT_NAME}-TrifactaParameterTable`}
              />
            </>
          </Accordion>
        </>
      )}
    </>
  );
};

TrifactaParameters.propTypes = {
  workpaperId: PropTypes.string,
  isDMT: PropTypes.bool,
};

TrifactaParameters.defaultProps = {
  workpaperId: '',
  isDMT: false,
};

export default TrifactaParameters;
