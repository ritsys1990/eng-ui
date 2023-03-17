import React from 'react';
import { Container, Text, TextTypes } from 'cortex-look-book';
import DataLinksGrid from './components/DataLinksGrid/DataLinksGrid';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_EngagementDataManagement';

const EngagementDataManagement = () => {
  const { t } = useTranslation();

  return (
    <Container pt={12}>
      <Text forwardedAs='h2' type={TextTypes.H2} fontWeight='s' color='gray' mb={5}>
        {t(`${TRANSLATION_KEY}_WhatTypeOfData`)}
      </Text>
      <DataLinksGrid />
    </Container>
  );
};

export default EngagementDataManagement;
