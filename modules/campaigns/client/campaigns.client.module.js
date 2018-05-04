(function (app) {
  'use strict';

  app.registerModule('campaigns', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('campaigns.admin', ['core.admin']);
  app.registerModule('campaigns.admin.routes', ['core.admin.routes']);
  app.registerModule('campaigns.services');
  app.registerModule('campaigns.routes', ['ui.router', 'core.routes', 'campaigns.services']);
}(ApplicationConfiguration));
