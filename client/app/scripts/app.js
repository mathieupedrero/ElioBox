'use strict';

/**
 * @ngdoc overview
 * @name elioBoxClientApp
 * @description
 * # elioBoxClientApp
 *
 * Main module of the application.
 */
angular
  .module('elioBoxClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngWebSocket',
    'ui.bootstrap'
  ])
  .config( ['$routeProvider',
    function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/diaporama', {
        templateUrl: 'views/diaporama.html',
        controller: 'DiaporamaCtrl',
        controllerAs: 'diaporama'
      })
      .when('/photos', {
        templateUrl: 'views/photos.html',
        controller: 'PhotosCtrl',
        controllerAs: 'photos'
      })
      .when('/photo/:photoId', {
        templateUrl: 'views/photo.html',
        controller: 'PhotoCtrl',
        controllerAs: 'photo'
      })
      .when('/sip', {
        templateUrl: 'views/sip.html',
        controller: 'SipCtrl',
        controllerAs: 'sip'
      })
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl',
        controllerAs: 'chat'
      })
      .when('/standaloneChat', {
        templateUrl: 'views/standalonechat.html',
        controller: 'StandalonechatCtrl',
        controllerAs: 'standaloneChat'
      })
      .otherwise({
        redirectTo: '/'
      });
    }
  ])
  .config( ['$compileProvider',
    function( $compileProvider ){   
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
  ]);
