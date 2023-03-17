import React, { useState, useEffect } from 'react';
import { Modal, ModalSizes, Textarea, Flex, Text, TextTypes, Box, Intent, RadioGroup } from 'cortex-look-book';
import styled from 'styled-components';
import useTranslation, { nameSpaces } from '../../../../../hooks/useTranslation';
import { RELEASE_TYPE_FIELD_VALUES } from '../../constants/constants';
import { getReleaseTypeOptions } from '../../utils/DataModelsHelper';

const ReleaseBox = styled(Box)`
  & > div {
    display: flex;
    & > div {
      margin-right: 10px;
    }
  }
`;

const SubmitForReviewModal = props => {
  const { showReviewComments, hideReviewComments, submitForReview, dataInstance } = props;
  const { t } = useTranslation();
  const [reviewComments, setReviewComments] = useState('');
  const [releaseType, setReleaseType] = useState(RELEASE_TYPE_FIELD_VALUES[0]);
  const [rationaleComments, setRationaleComments] = useState('');
  const [rationaleCommentsError, setRationaleCommentError] = useState(false);

  const freeTextValidPattern = /^[A-Za-z0-9]+/;

  const handleReviewComments = response => {
    if (response) {
      setReviewComments('');
      setReleaseType(RELEASE_TYPE_FIELD_VALUES[0]);
      setRationaleComments('');
      setRationaleCommentError(false);
    }
  };

  useEffect(() => {
    handleReviewComments(showReviewComments);
  }, [showReviewComments]);

  const isValidText = (value = '', matchPattern) => {
    if (value && value.match(matchPattern)) {
      setRationaleCommentError(false);
    } else {
      setRationaleCommentError(true);
    }

    return null;
  };

  const setNewValue = value => {
    isValidText(value, freeTextValidPattern);

    setRationaleComments(value);
  };

  const releaseTypeHandler = option => {
    setRationaleCommentError(false);
    setReleaseType(option);
  };

  const releaseTypeCommentsHandler = e => setNewValue(e.currentTarget.value);

  return (
    <Modal
      isOpen={showReviewComments}
      onClose={hideReviewComments}
      onPrimaryButtonClick={() => {
        if (
          (releaseType === RELEASE_TYPE_FIELD_VALUES[1] && rationaleComments.trim() === '') ||
          rationaleCommentsError
        ) {
          setRationaleCommentError(true);

          return;
        }
        submitForReview(reviewComments, releaseType, rationaleComments);
      }}
      onSecondaryButtonClick={hideReviewComments}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.SMALL}
      dataInstance={`${dataInstance}-Review-Comments-Modal`}
    >
      <Box pb={5}>
        <Flex pb={3}>
          <Text type={TextTypes.H2} fontWeight='s' dataInstance={`${dataInstance}-Header`}>
            {t('Pages_Content_Library_SUBMIT_DM_HEADER')}
          </Text>
        </Flex>
        <Textarea
          value={reviewComments}
          onChange={e => setReviewComments(e.currentTarget.value)}
          label={t('Pages_Content_Library_COMMENTS')}
          placeholder={t('Pages_Content_Library_COMMENTS_PLACEHOLDER')}
          dataInstance={`${dataInstance}-Review-Comments-textarea`}
        />
      </Box>
      <Box pb={5}>
        <Text type={TextTypes.H4} fontWeight='m' mb={3}>
          {t('Pages_Content_Library_Release_Type_Header')}
        </Text>
        <ReleaseBox my={8}>
          <RadioGroup
            dataInstance={`${dataInstance}-releaseOptions`}
            fontWeight='s'
            name='submitForReviewModal'
            options={getReleaseTypeOptions(t)}
            selectedValue={releaseType}
            onOptionChange={releaseTypeHandler}
          />
        </ReleaseBox>
      </Box>
      <Box pb={5}>
        <Textarea
          required={releaseType === RELEASE_TYPE_FIELD_VALUES[1]}
          value={rationaleComments}
          onChange={releaseTypeCommentsHandler}
          label={t('Pages_Content_Library_Release_Type_Rationale_Header')}
          placeholder={t('Pages_Content_Library_COMMENTS_PLACEHOLDER')}
          dataInstance={`${dataInstance}-Review-Rationale-Comments-textarea`}
          hint={rationaleCommentsError ? t('Empty_FormField_Validation') : ''}
          intent={rationaleCommentsError ? Intent.ERROR : Intent.WAITING}
        />
      </Box>
    </Modal>
  );
};

export default SubmitForReviewModal;
