import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 0.1, // Track 10% of transactions

  // Disable session replay to keep bundle small
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Environment
  environment: import.meta.env.MODE,

  // Only enable in production
  enabled: import.meta.env.PROD,

  // Ignore common transient browser errors
  ignoreErrors: [
    'Importing a module script failed',
    'Failed to fetch dynamically imported module',
  ],
});
