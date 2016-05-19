'use strict';

describe('Controller: DiaporamaCtrl', function () {

  // load the controller's module
  beforeEach(module('elioBoxClientApp'));

  var DiaporamaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiaporamaCtrl = $controller('DiaporamaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DiaporamaCtrl.awesomeThings.length).toBe(3);
  });
});
