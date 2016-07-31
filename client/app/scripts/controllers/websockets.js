'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:WebsocketsCtrl
 * @description
 * # WebsocketsCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('WebsocketsCtrl', ['$websocket', '$rootScope' , '$timeout' , "$route", "$window", function ($websocket, $rootScope,$timeout,$route,$window) {
      
      var onLoad = function(){console.log('image loaded');};
      
      
    $rootScope.loading=true;
    $rootScope.status="Chargement en cours ...";
      
    function autoReconnectWebsocket(uri,onMessage){
        var websocket = $websocket(uri, null, {reconnectIfNotNormalClose: true});
			
        websocket.onOpen(function(){
            $rootScope.loading=false;
            $rootScope.$apply();
        });

        websocket.onClose(function(){
            $rootScope.loading=true;
            $rootScope.status="Chargement en cours ...";
            $rootScope.$apply();
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
        if (event.data.substring(0, 6) == "BUILD:"){
            console.log("connected to WS server :"+event.data);
            if (event.data != build_tag){
                console.log("Tags not matching !! Expected ["+build_tag+"], currently ["+event.data+"]");
                $window.location.reload(true);
            }else{
                console.log("tags matching");
            }
        }else{
            var callback = $rootScope.cecCallbacks[event.data];
            if (callback!= null){
                callback();
            }
        }
    });
      
  }]);
