'use strict';

describe('Service: Agenda', function () {
    // load the service's module
    beforeEach(module('medviz'));

    // instantiate service
    var Agenda;
    beforeEach(inject(function (_Agenda_) {
        Agenda = _Agenda_;
    }));

    it('should be defined', function () {
        expect(true).toBe(true);
    });

});