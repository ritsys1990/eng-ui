import React from 'react';
import { Box, Flex, Intent, Link, Text, TextTypes } from 'cortex-look-book';

export const hasPagePermissions = (pagePermissions, PagePermissions) => {
  if (
    pagePermissions &&
    (pagePermissions[PagePermissions.CLIENT_SETUP_SETUP] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_APPLICATION_MAPPING] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_COMPONENT_MAPPING] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENTITIES] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_ENGAGEMENTS] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_CONNECTIONS] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DATA_SOURCES] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_DETAILS] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_SETUP_INFORMATICA] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_STAGING] ||
      pagePermissions[PagePermissions.CLIENT_SETUP_USERS])
  ) {
    return true;
  }

  return false;
};

export const isFirstNotCompletedStep = (state, step) => {
  switch (step) {
    case 1:
      return !state.isStep1Completed;
    case 2:
      return state.isStep1Completed && !state.isStep2Completed;
    case 3:
      return state.isStep1Completed && state.isStep2Completed && !state.isStep3Completed;
    case 4:
      return state.isStep1Completed && state.isStep2Completed && state.isStep3Completed && !state.isStep4Completed;
    case 5:
      return (
        state.isStep1Completed &&
        state.isStep2Completed &&
        state.isStep3Completed &&
        state.isStep4Completed &&
        !state.isStep5Completed
      );
    case 6:
      return (
        state.isStep1Completed &&
        state.isStep2Completed &&
        state.isStep3Completed &&
        state.isStep4Completed &&
        state.isStep5Completed &&
        !state.isStep6Completed
      );
    default:
      return false;
  }
};

export const getStepStatus = isCompleted => {
  return isCompleted ? Intent.SUCCESS : Intent.INFO;
};

export const getStepTitle = (stepNumber, t, isDisabled, usesSecureAgent = false) => {
  let title = '';
  let description = '';

  switch (stepNumber) {
    case 1:
      title = `${t('Pages_Client_Setup_Step1_Name')} ${t('Pages_Client_Setup_Step1_Title')}`;
      description = !usesSecureAgent ? `${t('Pages_Client_Setup_Step1_DisabledDescription')}` : '';
      break;
    case 2:
      title = `${t('Pages_Client_Setup_Step2_Name')} ${t('Pages_Client_Setup_Step2_Title')}`;
      description = !usesSecureAgent ? `${t('Pages_Client_Setup_Step2_DisabledDescription')}` : '';
      break;
    case 3:
      title = `${t('Pages_Client_Setup_Step3_Name')} ${t('Pages_Client_Setup_Step3_Title')}`;
      description = !usesSecureAgent ? `${t('Pages_Client_Setup_Step3_DisabledDescription')}` : '';
      break;
    case 4:
      title = `${t('Pages_Client_Setup_Step4_Name')} ${t('Pages_Client_Setup_Step4_Title')}`;
      description = !usesSecureAgent ? `${t('Pages_Client_Setup_Step4_DisabledDescription')}` : '';
      break;
    case 5:
      title = `${t('Pages_Client_Setup_Step5_Name')} ${t('Pages_Client_Setup_Step5_Title')}`;
      description = (
        <>
          {t('Pages_Client_Setup_Step5_DisabledDescription')}&nbsp;
          <Link display='inline-block' to={`mailto:${t('Pages_Client_Setup_SA_Installation_Email')}`} external>
            {t('Pages_Client_Setup_SA_Installation_Team')}
          </Link>
        </>
      );
      break;
    case 6:
    default:
      title = `${t('Pages_Client_Setup_Step6_Name')} ${t('Pages_Client_Setup_Step6_Title')}`;
      description = (
        <>
          {t('Pages_Client_Setup_Step6_DisabledDescription')}&nbsp;
          <Link display='inline-block' to={`mailto:${t('Pages_Client_Setup_SA_Installation_Email')}`} external>
            {t('Pages_Client_Setup_SA_Installation_Team')}
          </Link>
        </>
      );
      break;
  }

  if (!isDisabled) {
    return { title };
  }

  return {
    render: () => (
      <Flex width='90%' alignItems='center'>
        <Box width='25%'>
          <Text type={TextTypes.H2} fontWeight='m'>
            {title}
          </Text>
        </Box>
        <Box width='75%'>
          <Text type={TextTypes.BODY} fontWeight='s'>
            {description}
          </Text>
        </Box>
      </Flex>
    ),
  };
};
