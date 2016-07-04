'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('MainCtrl', ['$rootScope','$scope','$window',function ($rootScope, $scope, $window) {
    var options = [
      'diaporama',
      'photos',
      'standaloneChat'
    ];
    $scope.selectedOne = 0;
      $scope.version=elioboxVersion;
    var moveRight = function (){
        $scope.selectedOne = ($scope.selectedOne + 1) % options.length
    };
    var moveLeft = function (){
        $scope.selectedOne = ($scope.selectedOne + options.length - 1) % options.length
    };
    var go = function (){
        $window.location.href='#/'+options[$scope.selectedOne];
    };
    
    // at the bottom of your controller
    var init = function () {
        $rootScope.cecCallbacks={
            'right' : moveRight,
            'left' : moveLeft,
            'select' : go
        }
    };
    // and fire it after definition
    init();
  }]);
