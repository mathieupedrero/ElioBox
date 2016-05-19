'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:PhotosCtrl
 * @description
 * # PhotosCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('PhotosCtrl', ['$rootScope','$scope','$window',function ($rootScope,$scope,$window) {
    if ($rootScope.selectedOne == null){
        $rootScope.selectedOne = 0;
    }
    var moveRight = function (){
        $rootScope.selectedOne = ($rootScope.selectedOne + 1) % $rootScope.currentPhotos.length
        isVisible('mpo-selected');
    };
    var moveLeft = function (){
        $rootScope.selectedOne = ($rootScope.selectedOne + $rootScope.currentPhotos.length - 1) %  $rootScope.currentPhotos.length
        isVisible('mpo-selected');
    };
    var moveDown = function (){
        $rootScope.selectedOne = ($rootScope.selectedOne + 6) %  $rootScope.currentPhotos.length
        isVisible('mpo-selected');
    };
    var moveUp = function (){
        $rootScope.selectedOne = ($rootScope.selectedOne + $rootScope.currentPhotos.length - 6) %  $rootScope.currentPhotos.length
        isVisible('mpo-selected');
    };
    var goBack = function (){
        $window.location.href='#/';
    };
    var goTo = function (){
        $window.location.href='#/photo/'+$rootScope.currentPhotos[$rootScope.selectedOne %  $rootScope.currentPhotos.length].file;
    };
      
      
    function isVisible(class_element){
        var source = document.getElementById('photo-'+$scope.selectedOne);
        isScrolledIntoView(source);
    }
      
    function isScrolledIntoView(elem)
    {
        var $elem = $(elem);
        var $window = $(window);

        var docViewTop = $window.scrollTop();
        console.log(docViewTop);
        var docViewBottom = docViewTop + $window.height();
        console.log(docViewBottom);

        var elemTop = $elem.offset().top;
        console.log(elemTop);
        var elemBottom = elemTop + $elem.height();
        console.log(elemBottom);

        if (!((elemBottom <= docViewBottom) && (elemTop >= docViewTop))){
            console.log("scrolled to "+elemTop);
            window.scrollTo(0,elemTop);
        }
    }
    
    // at the bottom of your controller
    var init = function () {
        $rootScope.cecCallbacks={
            'right' : moveRight,
            'left' : moveLeft,
            'up' : moveUp,
            'down' : moveDown,
            'select' : goTo,
            'exit' : goBack
        }
    };
    // and fire it after definition
    init();
  }]);
