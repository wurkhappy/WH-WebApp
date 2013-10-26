/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'parsley', 'views/landing/landingview', 'views/landing/loginview',
  'views/landing/new_account', 'views/landing/forgot_password'],

  function (Backbone, parsley, LandingView, LoginView, NewAccountView, ForgotPasswordView) {

    'use strict';

    var LandingRouter = Backbone.Router.extend({

      routes: {
        '': 'index',
        'login':"login",
        'new-account':"newAccount",
        'forgot-password': "forgotPassword",
      },

      initialize: function () {
        this.$mainSection = $(".fade2");
      },

      index: function () {
        this.hideForm();
        if (!this.landingView) this.landingView = new LandingView({router:this, model: this.model});
        this.$mainSection.html(this.landingView.el);
      },
      login: function(){
        this.formView = new LoginView();
        this.$mainSection.html(this.formView.el);
        this.showForm();
      },
      newAccount: function(){
        console.log("new form");
        this.formView = new NewAccountView();
        this.$mainSection.html(this.formView.el);
        this.showForm();
      },
      forgotPassword: function(){
        this.formView = new ForgotPasswordView();
        this.$mainSection.html(this.formView.el);
        this.showForm();
      },
      showForm: function(){
        if (!this.formView) return;
        $('#logindiv').fadeIn('slow');
        $('#target').focus();
        $('#login_form').parsley();
        $('#log_in').hide();
        $('#log_out').show();
      },
      hideForm: function(){
        if (!this.formView) return;
        $('#create_form').parsley();
        this.$mainSection.hide();
        this.$mainSection.fadeIn('fast');

        $('#log_out').hide();
        $('#log_in').show();
        $('#logindiv').fadeOut('fast');
        this.formView.remove();
        this.formView = null;
      },

    });

return LandingRouter;

}
);