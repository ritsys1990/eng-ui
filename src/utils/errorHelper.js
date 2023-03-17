import React from 'react';

export const generateAddClientCSAError = (error, csaUsers, t) => {
  return (
    <div>
      {`${error.message} ${t('Components_AddClientModal_Error_CSA')}`}
      <ol>
        {csaUsers.map((user, index) => (
          <li key={index}>{`${user?.firstName} ${user?.lastName}, ${user?.email}`}</li>
        ))}
      </ol>
    </div>
  );
};

export const noop = () => {};
