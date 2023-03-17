import React from 'react';
import { Link } from 'cortex-look-book';
import env from 'env';

export const getEntities = (engagement, entities) => {
  if (Array.isArray(entities)) {
    return engagement.entityIds
      .map(item => {
        const res = entities && entities.find(entity => entity.id === item);

        return (res && res.name) || '';
      })
      .join(', ');
  }

  return engagement.entityIds && engagement.entityIds.join(', ');
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getStatus = (engagement, isDeloitte = false) => {
  const linkToLegalhold = title => (
    <Link
      forwardedAs='span'
      key='lh'
      to={`${env.EXTRACTIONUI_URL}/legalhold/${engagement.id}/${engagement.clientId}`}
      external
    >
      {title}
    </Link>
  );
  const linkToClosout = title => (
    <Link
      forwardedAs='span'
      key='cl'
      to={`${env.EXTRACTIONUI_URL}/closeout/${engagement.id}/${engagement.clientId}`}
      external
    >
      {title}
    </Link>
  );

  let legalHoldStatus = '';
  let closeutStatus = '';
  let legalHoldText = '';
  let closeoutText = '';
  let active = 'Active';

  const closed = engagement.closeoutStatus === 'Approved';

  if (isDeloitte) {
    switch (engagement.legalHoldStatus) {
      case 'Draft':
        legalHoldText += 'Legal hold initiated';
        legalHoldStatus = linkToLegalhold(legalHoldText);
        break;

      case 'PendingApproval':
        legalHoldText += !closed ? 'Legal hold approval pending' : 'Pending Legal Hold Approval';
        legalHoldStatus = linkToLegalhold(legalHoldText);
        break;

      case 'Approved':
        legalHoldText += !closed ? 'Engagement on Legal hold' : 'Subject to Legal Hold';
        legalHoldStatus = linkToLegalhold(legalHoldText);
        break;

      case 'PendingRemovalApproval':
        legalHoldText += 'Pending Removal Approval';
        legalHoldStatus = linkToLegalhold(legalHoldText);
        break;

      default:
    }
    switch (engagement.closeoutStatus) {
      case 'Draft':
        closeoutText += 'Closeout initiated';
        closeutStatus = linkToClosout(closeoutText);
        break;

      case 'PendingApproval':
        closeoutText += 'Pending Closeout Approval';
        closeutStatus = linkToClosout(closeoutText);
        break;

      case 'Approved':
        closeoutText += 'Closed';
        closeutStatus = closeoutText;
        active = '';
        break;

      default:
    }
  }

  let separator = ', ';

  if (closed) {
    if (engagement.legalHoldStatus === 'Approved') {
      separator = ' but ';
    } else if (engagement.legalHoldStatus === 'Draft' || engagement.legalHoldStatus === 'PendingApproval') {
      separator = ' and ';
    }
  }

  return [active, closeutStatus, legalHoldStatus].reduce((prev, next, index) => {
    if (next && !prev.length) {
      return [next];
    } else if (next && prev.length) {
      return [...prev, <span key={`s${index}`}>{separator}</span>, next];
    }

    return prev;
  }, []);
};

export const getCountryDetails = (countries, countryCode) => {
  return countries.find(name => name.countryCode === countryCode);
};
