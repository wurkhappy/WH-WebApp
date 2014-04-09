/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'parsley', 'flying-focus', 'views/landing/landingview', 'views/landing/loginview',
        'views/landing/new_account', 'views/landing/forgot_password', 'views/landing/check_email_view', 'views/landing/form_modal'
    ],

    function(Backbone, parsley, FlyingFocus, LandingView, LoginView, NewAccountView, ForgotPasswordView, CheckEmailView, FormModal) {

        'use strict';

        var LandingRouter = Backbone.Router.extend({

            routes: {
                '': 'index',
                'login': "login",
                'new-account': "newAccount",
                'forgot-password': "forgotPassword",
                'check-email': "checkEmail"
            },

            initialize: function() {
                this.$mainSection = $(".fade2");
                FlyingFocus();
            },

            index: function() {
                this.hideForm();
                if (!this.landingView) this.landingView = new LandingView({
                    router: this,
                    model: this.model
                });
                this.$mainSection.html(this.landingView.el);
            },
            login: function() {
                var view = new LoginView();
                this.showForm(view);
            },
            newAccount: function() {
                var view = new NewAccountView();
                this.listenTo(view, 'saveSuccess', this.createAccountSuccess);
                this.showForm(view);
            },
            forgotPassword: function() {
                var view = new ForgotPasswordView();
                this.showForm(view);
            },
            checkEmail: function() {
                var view = new CheckEmailView();
                this.showForm(view);
            },
            showForm: function(view) {
                this.formView = new FormModal({
                    childView: view
                });
                this.$mainSection.html(this.formView.el);
                $('#logindiv').fadeIn('slow');
                $('#target').focus();
                $('#login_form').parsley();
                $('#log_in').hide();
                $('#log_out').show();
                $('#create_account').hide();
                $('.copyright').addClass('copyright_login');
                $('.landing_footer').addClass('landing_footer_login');
            },
            hideForm: function() {
                if (!this.formView) return;
                $('#create_form').parsley();
                this.$mainSection.hide();
                this.$mainSection.fadeIn('fast');
                $('.copyright').removeClass('copyright_login');
                $('.landing_footer').removeClass('landing_footer_login');

                $('#log_out').hide();
                $('#log_in').show();
                $('#create_account').show();
                $('#logindiv').fadeOut('fast');
                this.formView.remove();
                this.formView = null;
            },
            createAccountSuccess: function() {
                window.location = "/home";
            }

        });

        return LandingRouter;

    }
);