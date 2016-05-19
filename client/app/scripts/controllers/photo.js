'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:PhotoCtrl
 * @description
 * # PhotoCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('PhotoCtrl', ['$routeParams','$rootScope','$scope','$window', function ($routeParams,$rootScope,$scope,$window) {
        $scope.photoId = $routeParams.photoId;
        var goBack = function (){
            $window.location.href='#/photos';
        };
        // at the bottom of your controller
        var init = function () {
            $rootScope.cecCallbacks={
                'exit' : goBack
            }
        };
        init();
  }]);
