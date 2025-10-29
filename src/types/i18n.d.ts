import 'react-i18next';
import common from '../../public/locales/en/common.json';
import auth from '../../public/locales/en/auth.json';
import booking from '../../public/locales/en/booking.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      booking: typeof booking;
    };
  }
}
