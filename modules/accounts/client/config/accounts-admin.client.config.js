(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('accounts.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Accounts',
      state: 'admin.accounts.list'
    });
  }
}());
