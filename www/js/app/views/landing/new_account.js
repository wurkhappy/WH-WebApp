/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'ajaxchimp', 'hbs!templates/landing/new_account', 'models/user',
  'views/ui-modules/modal', 'views/agreement/read/modals/email_subscribe', 'hbs!templates/landing/email' ],

    function (Backbone, Handlebars, parsley, ajaxChimp, newAccountTemplate, UserModel, Modal, EmailModal, emailTemplate) {

      'use strict';

      var NewAccountView = Backbone.View.extend({

        // Compile our footer template.
        template: newAccountTemplate,
        model: new UserModel(),
        emailTemplate: emailTemplate,

        events:{
          "blur input" : "updateModel",
          "click .create_account_button" : "debounceSubmitModel",
          "keypress input": "submitOnEnter",
          "click .email_button": "registerEmail"
        },

        initialize: function () {
          this.render();
        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        },
        updateModel: function(event){
          this.model.set(event.target.name, event.target.value);
        },

        submitOnEnter: function (event) {
          if (event.keyCode != 13) { 
            return;
            }
          this.updateModel(event);
          this.submitModel(event);
        },

        registerEmail: function(event) {
          //$('#mc-embedded-subscribe-form').ajaxChimp();
        },

        debounceSubmitModel: function(event) {
          event.preventDefault();
          event.stopPropagation();
          this.submitModel();
        },

        submitModel: _.debounce(function(event){

          var that = this;       

          this.model.save({}, {
            success:function(model, response){
              if (response["redirectURL"]) window.location = response["redirectURL"];
            },
            error:function(model, response){
              /*if (!that.modal){
                var view = new EmailModal();
                that.modal = new Modal({view:view});
              } 
              that.modal.show();*/

              $('#login_form').html(that.emailTemplate());
              $('.email_signup').fadeIn("slow");
              //$('#mc-embedded-subscribe-form').ajaxChimp();
              
              

            }
          })

        }, 500, true)

      });

      return NewAccountView;

    }
);