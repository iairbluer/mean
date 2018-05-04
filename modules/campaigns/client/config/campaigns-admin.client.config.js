(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('campaigns.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('sidebar', 'admin', {
      title: 'Manage Campaigns',
      state: 'admin.campaigns.list'
    });
  }
}());
