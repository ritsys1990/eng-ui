import React from 'react';
import { Box, Text, TextTypes, Flex, RadioGroup as RadioGroupObj } from 'cortex-look-book';
import useTranslation from '../../../../../../hooks/useTranslation';
import { EngagementTypes } from '../../constants/engagment.constants';

const COMPONENT_NAME = 'Client_Setup_Add_New_EngagementModal_Picker';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement';

const ChooseCreateEngType = ({ value, setSelectedValue }) => {
  const { t } = useTranslation();

  const updateRadioGroup = val => {
    setSelectedValue(val);
  };

  const engagementOptions = [
    {
      value: EngagementTypes.NEW,
      text: t(`${TRANSLATION_KEY}_New`),
      desc: t(`${TRANSLATION_KEY}_New_Desc`),
    },
    {
      value: EngagementTypes.ROLLFORWARD,
      text: t(`${TRANSLATION_KEY}_RollForward`),
      desc: t(`${TRANSLATION_KEY}_RollForward_Desc`),
    },
  ];

  return (
    <Box width='100%'>
      <Flex>
        <Text type={TextTypes.H2} fontWeight='l'>
          {t(`${TRANSLATION_KEY}_Title`)}
        </Text>
        <Text type={TextTypes.H2} fontWeight='s' pl={2} color='gray'>
          {t(`${TRANSLATION_KEY}_Options`)}
        </Text>
      </Flex>
      <Box my={8} dataInstance={`${COMPONENT_NAME}`}>
        <RadioGroupObj
          fontWeight='s'
          name='newEngagementPicker'
          options={engagementOptions}
          selectedValue={value}
          py={8}
          borderColor='lightGray'
          borderTop={1}
          borderBottom={1}
          onOptionChange={updateRadioGroup}
          dataInstance={`${COMPONENT_NAME}`}
        />
      </Box>
    </Box>
  );
};

export default ChooseCreateEngType;
