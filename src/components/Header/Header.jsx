import React from 'react';
import PropTypes from 'prop-types';
import { AlertHub, Flex, UniversalNavigation } from 'cortex-look-book';
import { StyledHeader } from './StyledHeader';
import GlobalNavigation from '../GlobalNavigation/GlobalNavigation';
import HeaderResources from '../HeaderResources/HeaderResources';
import HeaderNotification from '../HeaderNotification/HeaderNotification';
import HeaderProfile from '../HeaderProfile/HeaderProfile';
import HeaderHelp from '../HeaderHelp/HeaderHelp';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGlobalError } from '../../store/errors/actions';
import { errorsSelectors } from '../../store/errors/selectors';
import { removePipeline } from '../../store/engagement/pipelines/actions';
import { deleteWorkpaper } from '../../store/workpaper/actions';
import MaintenanceBanner from '../MaintenanceBanner/MaintenanceBanner';
import { isLegacyMode } from '../../utils/legacyUtils';

const COMPONENT_NAME = 'Header';

const Header = props => {
  const { hideGlobalNavigation, hideHeaderActions, alert } = props;

  const dispatch = useDispatch();
  const selectErrors = useSelector(errorsSelectors.selectErrors);

  const onErrorClose = (errorKey, engagementId, cloningType) => {
    dispatch(deleteGlobalError(errorKey));

    if (engagementId) {
      dispatch(removePipeline(engagementId, errorKey));
    }

    if (cloningType === 'workpaper') {
      dispatch(deleteWorkpaper(errorKey));
    }
  };

  return (
    <>
      {!isLegacyMode && (
        <StyledHeader>
          <UniversalNavigation logoRouterTo='/clients' dataInstance={`${COMPONENT_NAME}_Navigation`}>
            {!hideHeaderActions && (
              <Flex justifyContent='center' alignItems='center'>
                <HeaderResources mr={3} />
                <HeaderHelp mr={3} />
                <Flex position='relative' width='28px' height='28px' justifyContent='center' alignItems='center'>
                  <HeaderNotification />
                </Flex>
                <HeaderProfile ml={8} />
              </Flex>
            )}
          </UniversalNavigation>
          {!hideGlobalNavigation && <GlobalNavigation dataInstance={`${COMPONENT_NAME}_Global_Navigation`} />}
        </StyledHeader>
      )}
      <MaintenanceBanner alert={alert} />
      <AlertHub alerts={selectErrors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}_Alert`} />
    </>
  );
};

Header.propTypes = {
  hideGlobalNavigation: PropTypes.bool,
  hideHeaderActions: PropTypes.bool,
  alert: PropTypes.object,
};

Header.defaultProps = {
  hideGlobalNavigation: false,
  hideHeaderActions: false,
  alert: {},
};

export default Header;
