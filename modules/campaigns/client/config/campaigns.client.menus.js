(function () {
  'use strict';

  angular
    .module('campaigns')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidebar', {
      title: 'Campaigns',
      state: 'campaigns',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'campaigns', {
      title: 'List Campaigns',
      state: 'campaigns.list',
      roles: ['*']
    });
  }
}());
