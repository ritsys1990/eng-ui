import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, TextTypes } from 'cortex-look-book';
import { securitySelectors } from '../../store/security/selectors';

const MenuHeader = () => {
  const me = useSelector(securitySelectors.selectMe);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const firstName = me.firstName || '';
    const lastName = me.lastName || '';
    setFullName(`${firstName} ${lastName}`);
  }, [me]);

  return (
    <>
      <Text type={TextTypes.H4}>{fullName}</Text>
      <Text type={TextTypes.H4} fontWeight='m' ellipsis>
        {me.email}
      </Text>
    </>
  );
};

export default MenuHeader;
