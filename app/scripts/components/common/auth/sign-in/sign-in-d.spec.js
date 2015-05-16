'use strict';

describe('Directive: signIn', function ()
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
        element = $compile('<sign-in></sign-in>');
        expect(true).toBe(true);
    }));
});