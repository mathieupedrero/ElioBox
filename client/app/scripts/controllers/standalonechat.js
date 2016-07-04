'use strict';

/**
 * @ngdoc function
 * @name elioBoxClientApp.controller:StandalonechatCtrl
 * @description
 * # StandalonechatCtrl
 * Controller of the elioBoxClientApp
 */
angular.module('elioBoxClientApp')
  .controller('StandalonechatCtrl', ["$scope","$rootScope","$window",function ($scope,$rootScope,$window) {
    console.log("chat v1.2");
      
    // ICE Servers. You may want to include your own
    var SERVER = {
        iceServers: [
            {url: "stun:23.21.150.121"},
            {url: "stun:stun.l.google.com:19302"},
            {url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
        ]
    };

    // Peer Connection options
    var OPTIONS = {
        optional: [
            {DtlsSrtpKeyAgreement: true},
            {RtpDataChannels: true}
        ]
    };
      var ws = new WebSocket("ws://pedrero.org:2323/ws/8BCD5F");

      var initiator;
      var pc;
      var localStream;
      
      $scope.localStreamSrc="";
      $scope.remoteStreamSrc="";
      $scope.chatStatus="";
    
    function wsMessageCtrl(event) {
        console.log(event.data);
        if (event.data == "fullhouse") {
            $scope.chatStatus="Conversation en cours, réessayer plus tard !";
        }
        else if (event.data == "initiator") {
            $scope.chatStatus="Attente correspondant...";
            initiator = false;
            init();
        }
        else if (event.data == "not initiator") {
            $scope.chatStatus="Attente correspondant...";
            initiator = true;
            init();
        }
        else {
            $scope.chatStatus="en cours de connexion";
            var signal = JSON.parse(event.data);
            console.log("[received :]"+JSON.stringify(signal));
            if (signal.sdp) {
                if (initiator) {
                    receiveAnswer(signal);
                } else {
                    receiveOffer(signal);
                }
            } else if (signal.candidate) {
                pc.addIceCandidate(new RTCIceCandidate(signal));
            }
        }
        $scope.$apply();
    }

    ws.onmessage = wsMessageCtrl;


    function init() {
        console.log("init local stream");
        $('#remote').stop();
        $('#remote').src="";
        var constraints = {
            audio: true,
            video: true
        };
        if (typeof localStream == 'undefined'){
            console.log("Undefined stream, getting usermedia");
            getUserMedia(constraints, connect, fail);
        }else{
            console.log("reusing existing stream !");
            connect(localStream);
        }
    }


    function connect(stream) {
        localStream = stream;
        pc = new RTCPeerConnection(SERVER,OPTIONS);

        if (stream) {
            pc.addStream(stream);
            $('#local').attachStream(stream);
        }

        pc.onaddstream = function(event) {
            $('#remote').attachStream(event.stream);
            logStreaming(true);
            $scope.chatStatus="";
            $scope.$apply();
            console.log("finally connected !!");
        };
        pc.onicecandidate = function(event) {
            if (event.candidate) {
                ws.send(JSON.stringify(event.candidate));
            }
        };

        if (initiator) {
            createOffer();
        } else {
            log('waiting for offer...');
        }
        logStreaming(false);
    }


    function createOffer() {
        log('creating offer...');
        pc.createOffer(function(offer) {
            log('created offer...');
            pc.setLocalDescription(offer, function() {
                log('sending to remote...');
                ws.send(JSON.stringify(offer));
            }, fail);
        }, fail);
    }


    function receiveOffer(offer) {
        log('received offer...');
        pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
            log('creating answer...');
            pc.createAnswer(function(answer) {
                log('created answer...');
                pc.setLocalDescription(answer, function() {
                    log('sent answer');
                    ws.send(JSON.stringify(answer));
                }, fail);
            }, fail);
        }, fail);
    }


    function receiveAnswer(answer) {
        log('received answer');
        pc.setRemoteDescription(new RTCSessionDescription(answer));
    }


    function log() {
        console.log.apply(console, arguments);
    }


    function logStreaming(streaming) {
        $('#streaming').text(streaming ? '[streaming]' : '[..]');
    }


    function fail() {
        $scope.chatStatus=Array.prototype.join.call(arguments, ' ');
        console.error.apply(console, arguments);
    }


    jQuery.fn.attachStream = function(stream) {
        this.each(function() {
            this.src = URL.createObjectURL(stream);
            this.play();
        });
    };
      
    function goBack(){
        if (typeof localStream != 'undefined'){
            localStream.close();
        }
        ws.close();
        $window.location.href='#/';
    }
    
    $rootScope.cecCallbacks={
        'exit' : goBack
    };
  }]);
