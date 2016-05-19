'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:DiaporamaCtrl
 * @description
 * # DiaporamaCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('DiaporamaCtrl', ['$window','$rootScope',function ($window,$rootScope) {
    var goBack = function (){
        $window.location.href='#/';
    };
    
    // at the bottom of your controller
    var init = function () {
        $rootScope.cecCallbacks={
            'exit' : goBack
        }
    };
    // and fire it after definition
    init();
  }]);
