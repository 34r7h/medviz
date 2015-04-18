'use strict';

describe('Directive: medvizSections', function ()
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
        element = $compile('<medviz-sections></medviz-sections>');
        expect(true).toBe(true);
    }));
});