'use strict';

describe('Directive: adminUi', function ()
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
        element = $compile('<admin-ui></admin-ui>');
        expect(true).toBe(true);
    }));
});