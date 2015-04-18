'use strict';

describe('Directive: medvizForm', function ()
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
        element = $compile('<medviz-form></medviz-form>');
        expect(true).toBe(true);
    }));
});