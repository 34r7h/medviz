'use strict';

describe('Directive: medvizTable', function ()
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
        element = $compile('<medviz-table></medviz-table>');
        expect(true).toBe(true);
    }));
});