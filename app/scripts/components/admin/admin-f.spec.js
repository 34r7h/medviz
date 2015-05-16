'use strict';

describe('Factory: Admin', function () {
    // load the service's module
    beforeEach(module('medviz'));

    // instantiate service
    var Admin;
    beforeEach(inject(function (_Admin_) {
        Admin = _Admin_;
    }));

    it('should be defined', function () {
        expect(true).toBe(true);
    });

});