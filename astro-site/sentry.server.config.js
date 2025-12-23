import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 0.1,

  // Environment
  environment: process.env.NODE_ENV || 'production',
});
