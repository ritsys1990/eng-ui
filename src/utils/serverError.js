import { v4 as uuidv4 } from 'uuid';
import getLocalizedErrorMessage from './formatMessageHelper';

export default class ServerError extends Error {
  constructor(message, code = 500, body = null, serviceName = '') {
    super(message);
    this.key = uuidv4();
    this.code = code;
    this.body = body;
    this.serviceName = serviceName;
    this.type = 'error';
    this.mappings();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  mappings() {
    if (this.body) {
      const { body } = this;

      // When multiple errors come.
      let message = ((body.errors || [])[0] || {}).msg;

      // For single errors.
      message = message || body.Message || body.error;

      // For messages that are in an inner object property
      if (message?.includes('"Message"')) {
        try {
          message = `${this.serviceName} Error: ${JSON.parse(message).errorDetails.Message}`;
        } catch (error) {
          const [msg] = message.split(':');
          message = msg;
        }
      }

      // Backup the current message
      const tempMessage = message;

      /* For Localization Errors
       --The { errors: { localizationMetadata: { ... } } is for the messages that come from the microservices
       --And { error: 'string', localizationMetadata: { ... } } is for the messages that come from the Analytics node js server
       */
      if (body.errors?.[0]?.localizationMetadata || (body.error && body.localizationMetadata)) {
        const metadata = body.errors?.[0]?.localizationMetadata || body.localizationMetadata;
        message = getLocalizedErrorMessage(metadata) || tempMessage;
      }

      // For Trifacta Errors
      try {
        const parsedError = JSON.parse(message);
        if (parsedError.exception) {
          message = `${this.serviceName} Error: ${parsedError.exception.message}`;
        }
      } catch (error) {
        message = message || tempMessage;
      }
      this.message = message || this.message;
    }
  }
}
