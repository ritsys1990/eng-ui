import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import useServiceInitializer from './useServiceInitializer';
import useOneTrustInit from './useOneTrustInit';
import TelemetryProvider from './appInsights/TelemetryProvider';
import { StyledContent } from './StyledApp';
import { Spinner } from 'cortex-look-book';

const ServiceInitializer = props => {
  const { children, telemetryProps } = props;

  const theme = useContext(ThemeContext);

  const { isOneTrustReady, isOneTrustDisabled } = useOneTrustInit();
  const { categoriesStatus, requiredServicesReady } = useServiceInitializer(isOneTrustDisabled);

  return (!isOneTrustReady && !isOneTrustDisabled) || !requiredServicesReady ? (
    <StyledContent>
      <Spinner height='100vh' spinning hideOverlay label='' size={theme?.space[11]} pathSize={theme?.space[2]} />
    </StyledContent>
  ) : (
    <TelemetryProvider allowed={categoriesStatus.analytics} {...telemetryProps}>
      {children}
    </TelemetryProvider>
  );
};

export default ServiceInitializer;
