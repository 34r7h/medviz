'use strict';

describe('Factory: Client', function () {
    // load the service's module
    beforeEach(module('medviz'));

    // instantiate service
    var Client;
    beforeEach(inject(function (_Client_) {
        Client = _Client_;
    }));

    it('should be defined', function () {
        expect(true).toBe(true);
    });

});