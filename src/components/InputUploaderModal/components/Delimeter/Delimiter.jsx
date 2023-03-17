import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Input, Select, SelectTypes } from 'cortex-look-book';
import { DELIMITER, DELIMITERS, COMPONENT_NAME } from './constants';
import { translate } from '../../../../utils/translation';
import { noop } from '../../../../utils/errorHelper';
import useTranslation from 'src/hooks/useTranslation';

export const Delimiter = ({ onDelimiterChange }) => {
  const { t } = useTranslation();
  const translatedDelimiter = translate(DELIMITERS, 'text', t);
  const [delimiter, setDelimiter] = useState([translatedDelimiter[0]]);
  const [showCustom, setCustom] = useState(false);

  const onDelimiterChangeHandler = event => {
    setDelimiter([event[0]]);

    if (!event.length) {
      setDelimiter([translatedDelimiter[0]]);
      setCustom(false);

      return;
    }

    if (event[0].value !== DELIMITER.CUSTOM) {
      onDelimiterChange(event[0].value);
    }

    setCustom(event[0].value === DELIMITER.CUSTOM);
  };

  return (
    <Flex alignItems='flex-end'>
      <Select
        minWidth='160px'
        label={t('Pages_EngagementWorkpapers_AttachSourceModal_Delimiter_Label')}
        type={SelectTypes.SIMPLE}
        value={delimiter}
        options={translatedDelimiter}
        onChange={onDelimiterChangeHandler}
        dataInstance={COMPONENT_NAME}
      />

      {showCustom && (
        <Input
          placeholder={t('Pages_EngagementWorkpapers_AttachSourceModal_Delimiter_Placeholder')}
          onChange={event => {
            onDelimiterChange(event.target.value);
          }}
          dataInstance={COMPONENT_NAME}
        />
      )}
    </Flex>
  );
};

Delimiter.propTypes = {
  onDelimiterChange: PropTypes.func,
};

Delimiter.defaultProps = {
  onDelimiterChange: noop,
};
