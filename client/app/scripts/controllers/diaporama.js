'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:DiaporamaCtrl
 * @description
 * # DiaporamaCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('DiaporamaCtrl', ['$window', '$rootScope', '$scope', '$interval',
    function($window, $rootScope, $scope, $interval) {
      var divNumber = 3;
      $scope.shownOne = 0;
      $scope.outerStyle = {};
      $scope.innerStyle = {};
      $scope.visible = {};

      var updateStyles = function(divToUpdate, withPhoto) {
        var currentPhoto = $rootScope.currentPhotos[withPhoto];
        console.log('going to udate div [' + divToUpdate + '] with photo [' + withPhoto + ']');
        $scope.outerStyle[divToUpdate] = {
          "background-image": "url('" + currentPhoto.thumbnail + "')"
        };
        $scope.innerStyle[divToUpdate] = {
          "background-image": "url('" + currentPhoto.file + "')"
        };
      };

      var nextId = function(id, size) {
        return (id + 1) % size;
      };
      var nextDivId = function(id) {
        return nextId(id, divNumber);
      };
      var nextPhotoId = function(id) {
        return nextId(id, $rootScope.currentPhotos.length);
      };
      var previousId = function(id, size) {
        return (id + size - 1) % size;
      };
      var previousDivId = function(id) {
        return previousId(id, divNumber);
      };
      var previousPhotoId = function(id) {
        return previousId(id, $rootScope.currentPhotos.length);
      };
      var setVisibleDiv = function(divId) {
        $scope.visibleDiv = divId;
        $scope.visible[0] = (divId === 0);
        $scope.visible[1] = (divId === 1);
        $scope.visible[2] = (divId === 2);
      }

      setVisibleDiv(1);
      updateStyles($scope.visibleDiv, $scope.shownOne);
      updateStyles(previousDivId($scope.visibleDiv), previousPhotoId($scope.shownOne));
      updateStyles(nextDivId($scope.visibleDiv), nextPhotoId($scope.shownOne));

      var next = function() {
        $scope.shownOne = nextPhotoId($scope.shownOne);
        setVisibleDiv(nextDivId($scope.visibleDiv));
        updateStyles(nextDivId($scope.visibleDiv), nextPhotoId($scope.shownOne));
      }
      var manualNext = function() {
        $interval.cancel($scope.timer);
        next();
        $scope.timer = $interval(next, interval);
      }

      var previous = function() {
        $scope.shownOne = nextPhotoId($scope.shownOne);
        setVisibleDiv(previousDivId($scope.visibleDiv));
        updateStyles(previousDivId($scope.visibleDiv), nextPhotoId($scope.shownOne));
      }
      var manualPrevious = function() {
        $interval.cancel($scope.timer);
        previous();
        $scope.timer = $interval(next, interval);
      }

      var interval = 15000;
      $scope.timer = $interval(next, interval);


      var goBack = function() {
        $interval.cancel($scope.timer);
        $window.location.href = '#/';
      };

      // at the bottom of your controller
      var init = function() {
        $rootScope.cecCallbacks = {
          'exit': goBack,
          'left': manualPrevious,
          'rigth': manualNext
        }
      };
      // and fire it after definition
      init();
    }
  ]);
