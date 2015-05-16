'use strict';

describe('Directive: admin', function ()
{

    // load the directive's module
    beforeEach(module('medviz'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope)
    {
        scope = $rootScope.$new();
    }));

    it('should do something', inject(function ($compile)
    {
        element = $compile('<admin></admin>');
        expect(true).toBe(true);
    }));
});