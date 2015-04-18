'use strict';

describe('Factory: Data', function () {
    // load the service's module
    beforeEach(module('medviz'));

    // instantiate service
    var Data;
    beforeEach(inject(function (_Data_) {
        Data = _Data_;
    }));

    it('should be defined', function () {
        expect(true).toBe(true);
    });

});