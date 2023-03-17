import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Radio, Search, Table, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../../hooks/useTranslation';
import LocalizedDate from '../../../../../../components/LocalizedDate/LocalizedDate';
import RollforwardLegalHoldModal from './RollforwardLegalHoldModal';
import { EngagementStatus } from '../../constants/engagment.constants';

const COMPONENT_NAME = 'SelectRollforwardEngagement';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement_SelectRollforwardEngagement';

const SelectRollforwardEngagement = ({ closedEngagements, selectedOption, onOptionSelected }) => {
  const [headers, setHeaders] = useState([]);
  const [isLegalHoldModalOpen, setIsLegalHoldModalOpen] = useState(false);
  const [filteredEngagements, setFilteredEngagements] = useState(closedEngagements);
  const [selectedEngagement, setSelectedEngagement] = useState({});

  const { t } = useTranslation();

  const handleEngagementSearch = useCallback(
    value => {
      let filteredEngs;
      if (value.length > 0) {
        filteredEngs = closedEngagements.filter(eng => eng.name?.toLowerCase().includes(value?.toLowerCase()));
      } else {
        filteredEngs = closedEngagements;
      }

      setFilteredEngagements(filteredEngs);
      onOptionSelected({});
    },
    [closedEngagements]
  );

  const handleLegalHoldOk = () => {
    onOptionSelected({ ...selectedEngagement, confirmed: true });
  };

  useEffect(() => {
    setFilteredEngagements(closedEngagements);
  }, [closedEngagements]);

  useEffect(() => {
    setHeaders([
      {
        title: '',
        key: 'name',
        render: (name, row) => (
          <Box>
            <Radio
              dataInstance={COMPONENT_NAME}
              name='choose-rollforward'
              label=''
              value={row.id}
              checked={row.id === selectedOption.id}
              onOptionSelected={() => {
                setSelectedEngagement(row);

                if (row.legalHoldStatus === EngagementStatus.APPROVED) {
                  setIsLegalHoldModalOpen(true);
                } else {
                  onOptionSelected(row);
                }
              }}
              fontWeight='m'
            />
          </Box>
        ),
      },
      {
        title: t(`${TRANSLATION_KEY}_TableName`),
        key: 'name',
        render: (name, row) => {
          return (
            <Text
              onClick={() => {
                onOptionSelected(row);
              }}
            >
              {name}
            </Text>
          );
        },
      },
      {
        title: t(`${TRANSLATION_KEY}_TableEngagementId`),
        key: 'id',
      },
      {
        title: t(`${TRANSLATION_KEY}_TableFiscalYearEnd`),
        key: 'fiscalYearEnd',
        render: fiscalYearEnd => {
          return (
            <Text>
              <LocalizedDate date={fiscalYearEnd} />
            </Text>
          );
        },
      },
    ]);
  }, [selectedOption, onOptionSelected]);

  return (
    <Box dataInstance={`${COMPONENT_NAME}`}>
      <Flex mt={8} mb={9} justifyContent='space-between' alignItems='center'>
        <Text type={TextTypes.H3}>{t(`${TRANSLATION_KEY}_Title`)}</Text>
        <Search
          data={closedEngagements}
          onChange={handleEngagementSearch}
          maxWidth='225px'
          manualFiltering
          dataInstance={COMPONENT_NAME}
          placeholder={t('Pages_Clients_HeaderBar_PlaceholderText')}
        />
      </Flex>
      <Table headers={headers} rows={filteredEngagements} dataInstance={`${COMPONENT_NAME}`} contentMaxHeight={480} />
      <RollforwardLegalHoldModal
        dataInstance={COMPONENT_NAME}
        isOpen={isLegalHoldModalOpen}
        onOk={() => {
          handleLegalHoldOk();
          setIsLegalHoldModalOpen(false);
        }}
        onClose={() => {
          setIsLegalHoldModalOpen(false);
        }}
      />
    </Box>
  );
};

SelectRollforwardEngagement.propTypes = {
  closedEngagements: PropTypes.array,
  selectedOption: PropTypes.object.isRequired,
  onOptionSelected: PropTypes.func.isRequired,
};

SelectRollforwardEngagement.defaultProps = {
  closedEngagements: [],
};

export default SelectRollforwardEngagement;
