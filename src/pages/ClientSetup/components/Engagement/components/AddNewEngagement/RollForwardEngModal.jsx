import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import useTranslation from '../../../../../../hooks/useTranslation';
import { AlertTypes, Box, CheckboxTree, Text, TextTypes, Link } from 'cortex-look-book';
import { useDispatch } from 'react-redux';
import { rollforwardEngagement } from '../../../../../../store/engagement/actions';
import { addAddEngagementError, addGlobalError } from '../../../../../../store/errors/actions';

const COMPONENT_NAME = 'RollForwardEngModal';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement_Rollforward';

const RollForwardEngModal = forwardRef(({ rollforwardData, closeModal }, ref) => {
  const [checklist, setChecklist] = useState([]);
  const [checkedOptions, setCheckedOptions] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleCheck = key => {
    const newKeys = [...checklist];
    const index = newKeys.indexOf(key);

    if (index === -1) {
      newKeys.push(key);
    } else {
      newKeys.splice(index, 1);
    }

    setCheckedOptions(newKeys);
  };

  const handleSubmit = () => {
    dispatch(rollforwardEngagement(rollforwardData, rollforwardData.confirmed, addAddEngagementError)).then(res => {
      if (res) {
        dispatch(
          addGlobalError({
            type: AlertTypes.SUCCESS,
            message: t(`${TRANSLATION_KEY}_Toast`),
          })
        );
        closeModal();
      }
    });
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  useEffect(() => {
    setChecklist([
      {
        label: t(`${TRANSLATION_KEY}_SourceSystems`),
        key: '0-0',
        disabled: true,
        children: [
          {
            label: t(`${TRANSLATION_KEY}_SourceSystem_Subscriptions`),
            key: '0-0-0',
            disabled: true,
          },
          {
            label: t(`${TRANSLATION_KEY}_SourceSystems_ApprovalWorkflows`),
            key: '0-0-1',
            disabled: true,
          },
        ],
      },
      {
        label: t(`${TRANSLATION_KEY}_Workpapers`),
        key: '0-1',
        disabled: true,
        children: [
          {
            label: t(`${TRANSLATION_KEY}_Workpapers_Steps`),
            key: '0-1-0',
            disabled: true,
          },
          {
            label: t(`${TRANSLATION_KEY}_Workpapers_Metadata`),
            key: '0-1-1',
            disabled: true,
          },
        ],
      },
      {
        label: t(`${TRANSLATION_KEY}_DataRequests`),
        key: '0-2',
        disabled: true,
        children: [
          {
            label: t(`${TRANSLATION_KEY}_DataRequests_Setup`),
            key: '0-2-0',
            disabled: true,
          },
          {
            label: t(`${TRANSLATION_KEY}_DataRequests_DataConfiguration`),
            key: '0-2-1',
            disabled: true,
          },
          {
            label: t(`${TRANSLATION_KEY}_DataRequests_Filters`),
            key: '0-2-2',
            disabled: true,
          },
        ],
      },
      {
        label: t(`${TRANSLATION_KEY}_Users`),
        key: '0-3',
        disabled: true,
      },
    ]);

    setCheckedOptions(['0-0', '0-0-0', '0-1', '0-1-0', '0-1-1', '0-2', '0-2-0', '0-2-1', '0-2-2', '0-3']);
  }, [t]);

  return (
    <Box width='100%' dataInstance={COMPONENT_NAME}>
      <Text type={TextTypes.H2} fontWeight='l' mb={4}>
        {t(`${TRANSLATION_KEY}_Title`)}
      </Text>
      <Text type={TextTypes.BODY} mb={8}>
        {t(`${TRANSLATION_KEY}_Summary`)}
        <Link
          to={t(`${TRANSLATION_KEY}_SummaryLink`)}
          target='_blank'
          external
          display='inline-block'
          ml={2}
          dataInstance={`${COMPONENT_NAME}-URL`}
        >
          {t(`${TRANSLATION_KEY}_SummaryLinkText`)}
        </Link>
      </Text>
      <Box mb={9} dataInstance={`${COMPONENT_NAME}-TreeContainer`}>
        <CheckboxTree
          nodes={checklist}
          onCheck={handleCheck}
          checkedKeys={checkedOptions}
          dataInstance={COMPONENT_NAME}
        />
      </Box>
    </Box>
  );
});

export default RollForwardEngModal;
