'use strict';

describe('Controller: PhotosCtrl', function () {

  // load the controller's module
  beforeEach(module('elioBoxClientApp'));

  var PhotosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PhotosCtrl = $controller('PhotosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PhotosCtrl.awesomeThings.length).toBe(3);
  });
});
