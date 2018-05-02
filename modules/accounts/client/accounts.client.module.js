(function (app) {
  'use strict';

  app.registerModule('accounts', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('accounts.admin', ['core.admin']);
  app.registerModule('accounts.admin.routes', ['core.admin.routes']);
  app.registerModule('accounts.services');
  app.registerModule('accounts.routes', ['ui.router', 'core.routes', 'accounts.services']);
}(ApplicationConfiguration));
