define(['app/views/landing/new_account', 'jquery'], function(NewAccountView, $) {
    describe("Landing New Account", function() {

        beforeEach(function() {
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it("should create a new view", function() {
            var view = new NewAccountView();
            expect(view).toBeDefined();
        });

        it("should pass form validation given correct inputs", function() {
            var view = new NewAccountView();
            view.$('input[name=firstName]').val('Test');
            view.$('input[name=lastName]').val('Tester');
            view.$('input[name=email]').val('test@test.com');
            view.$('input[name=password]').val('123456');
            expect(view.submitModel()).toBeTruthy();
        });

        it("should fail form validation given incorrect inputs", function() {
            var view = new NewAccountView();
            view.$('input[name=firstName]').val('Test');
            view.$('input[name=lastName]').val('Tester');
            view.$('input[name=email]').val('bad email');
            view.$('input[name=password]').val('123456');
            expect(view.submitModel()).toBeFalsy();
        });
    })
});