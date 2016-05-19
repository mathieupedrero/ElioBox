'use strict';

describe('Controller: SipCtrl', function () {

  // load the controller's module
  beforeEach(module('elioBoxClientApp'));

  var SipCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SipCtrl = $controller('SipCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SipCtrl.awesomeThings.length).toBe(3);
  });
});
