// (function () {
//   'use strict';

//   angular
//     .module('accounts')
//     .run(menuConfig);

//   menuConfig.$inject = ['menuService'];

//   function menuConfig(menuService) {
//     menuService.addMenuItem('topbar', {
//       title: 'Accounts',
//       state: 'accounts',
//       type: 'dropdown',
//       roles: ['*']
//     });

//     // Add the dropdown list item
//     menuService.addSubMenuItem('topbar', 'accounts', {
//       title: 'List Accounts',
//       state: 'accounts.list',
//       roles: ['*']
//     });
//   }
// }());
