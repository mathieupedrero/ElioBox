'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:SipCtrl
 * @description
 * # SipCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('SipCtrl', ["$rootScope","$window",function ($rootScope,$window) {
    var goBack = function (){
        $window.location.href='#/';
    };
    var select = function (){
        var button = $("#appearin").contents().find('.primary-button');
        button.click();
    };
    
    // at the bottom of your controller
    var init = function () {
        var button = $("#appearin").contents().find('.primary-button');
        button.click();
        $rootScope.cecCallbacks={
            'exit' : goBack,
            'select' : select
        }
    };
    // and fire it after definition
    init();
  }]);
