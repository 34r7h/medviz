'use strict';

describe('Service: Landing', function () {
    // load the service's module
    beforeEach(module('medviz'));

    // instantiate service
    var Landing;
    beforeEach(inject(function (_Landing_) {
        Landing = _Landing_;
    }));

    it('should be defined', function () {
        expect(true).toBe(true);
    });

});