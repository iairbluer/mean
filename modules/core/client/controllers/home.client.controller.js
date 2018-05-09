(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
    HomeController.$inject = ['Authentication', 'CampaignsService', 'UsersService']

  function HomeController(Authentication, CampaignsService, UsersService) {
    var vm = this;
    vm.authentication = Authentication;
    console.log('HOME CTRL USER = ' + JSON.stringify(vm.authentication.user));
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    // PAGER FUNCTIONS
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.campaigns, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    // GET CAMPAIGNS
    // CampaignsService.query(function (data){
    //   console.log('RECEIVED DATA');
    //   vm.campaigns = data;
    // });
    // EXPAND WELCOME
    vm.expandWelcome = expandWelcome;
    function expandWelcome() {
      if (vm.authentication.user.isWelcomeDissmised) {
        vm.authentication.user.isWelcomeDissmised = false; 
      } else {
        console.log('WEIRD');
      }
    }
    // DISMISS WELCOME
    vm.dismissWelcome = dismissWelcome;
    function dismissWelcome() {
      if (!vm.authentication.user.isWelcomeDissmised) {
        vm.authentication.user.isWelcomeDissmised = true;
      } else {
        console.log('COMPLEMENTARY WEIRD');
      }
    }
  }
}());
