import React, { Component } from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from './TelemetryService';
import { withRouter } from 'react-router-dom';

class TelemetryProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };
  }

  // initialization may not be complete on mount, as it might still awaiting permission from One Trust, thus
  // this operation is also done in componentDidUpdate.
  componentDidMount() {
    this.initialization();
  }

  componentDidUpdate() {
    this.initialization();
  }

  initialization() {
    const { history, allowed } = this.props;
    const { initialized } = this.state;
    const AppInsightsInstrumentationKey = this.props.instrumentationKey;

    if (allowed) {
      if (!initialized && AppInsightsInstrumentationKey && history) {
        ai.initialize(AppInsightsInstrumentationKey, history);
        this.setState({ initialized: true });
      }

      this.props.after();
    }
  }

  render() {
    const { children } = this.props;

    return <>{children}</>;
  }
}

export default withRouter(withAITracking(ai.reactPlugin, TelemetryProvider));
