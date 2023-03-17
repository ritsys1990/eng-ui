import React, { useContext, useState } from 'react';
import { Flex, Link, LinkTypes, StateView, Tooltip, TooltipPosition } from 'cortex-look-book';
import { ThemeContext } from 'styled-components';
import { useParams } from 'react-router-dom';
import env from 'env';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_EngagementDataManagement';
const COMPONENT_NAME = 'DataLinkItem';

const DataLinkItem = props => {
  const { disabled, index, option } = props;
  const { engagementId } = useParams();
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const getBorderWidth = i => {
    return i % 3 !== 0 ? '2px' : '0';
  };

  return disabled ? (
    <Link
      type={LinkTypes.FLAT}
      to={option.external ? `${env.EXTRACTIONUI_URL}/engagement/${engagementId}/${option.link}` : option.link}
      external={option.external}
      width='100%'
      sx={{
        borderLeftWidth: getBorderWidth(index),
        borderLeftStyle: 'solid',
        borderLeftColor: theme.colors['gray2'],
      }}
      dataInstance={COMPONENT_NAME}
    >
      <Flex
        theme={theme}
        alignItems='center'
        justifyContent='center'
        py={4}
        backgroundColor='white'
        sx={{
          transition: 'background-color 0.3s ease-in-out',
          ':hover': {
            backgroundColor: 'lightGray',
          },
        }}
      >
        <StateView
          icon={option.icon}
          iconWidth={44}
          iconColor='blue'
          message={t(`${TRANSLATION_KEY}_${option.name}`)}
          fontWeight='m'
        />
      </Flex>
    </Link>
  ) : (
    <Tooltip
      display='block'
      tooltipContent={t(`${TRANSLATION_KEY}_PermissionsTooltip`)}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      direction={TooltipPosition.TOP}
      width={200}
    >
      <Flex
        theme={theme}
        alignItems='center'
        justifyContent='center'
        py={4}
        backgroundColor='black6'
        cursor='not-allowed'
        sx={{
          borderLeftWidth: getBorderWidth(index),
          borderLeftStyle: 'solid',
          borderLeftColor: theme.colors['gray2'],
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <StateView
          color='gray'
          icon={option.icon}
          iconWidth={44}
          iconColor='gray'
          message={t(`${TRANSLATION_KEY}_${option.name}`)}
          fontWeight='m'
        />
      </Flex>
    </Tooltip>
  );
};

export default DataLinkItem;
