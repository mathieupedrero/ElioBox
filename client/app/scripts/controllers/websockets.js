'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:WebsocketsCtrl
 * @description
 * # WebsocketsCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('WebsocketsCtrl', ['$websocket', '$rootScope' , '$timeout' ,function ($websocket, $rootScope,$timeout) {
      
    function autoReconnectWebsocket(uri,onMessage){
        var websocket = $websocket(uri, null, {reconnectIfNotNormalClose: true});
			
        websocket.onOpen(function(){
            console.info('connected');
        });

        websocket.onClose(function(){
            console.info('close');
            $timeout(function(){autoReconnectWebsocket(uri,onMessage)},1000);
        });

        websocket.onMessage(onMessage);
        
        return websocket;
    }  
      
    autoReconnectWebsocket('ws://localhost:8888/ws-refresh', function(event) {
        console.info(JSON.parse(event.data)['files']);
        $rootScope.currentPhotos=JSON.parse(event.data)['files'];
    });
    
    autoReconnectWebsocket('ws://localhost:8888/ws-cec', function(event) {
        var callback = $rootScope.cecCallbacks[event.data];
        if (callback!= null){
            callback();
        }
    });
      
  }]);
