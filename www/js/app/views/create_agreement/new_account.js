/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'ajaxchimp', 'hbs!templates/create_agreement/new_account_tpl', 'models/user',
        'views/ui-modules/modal', 'views/agreement/read/modals/email_subscribe', 'hbs!templates/landing/email'
    ],

    function(Backbone, Handlebars, parsley, ajaxChimp, newAccountTemplate, UserModel, Modal, EmailModal, emailTemplate) {

        'use strict';

        var NewAccountView = Backbone.View.extend({

            // Compile our footer template.
            template: newAccountTemplate,
            model: new UserModel(),
            emailTemplate: emailTemplate,

            events: {
                "blur input": "updateModel",
                "click .create_account_button": "debounceSubmitModel",
                "keypress input": "submitOnEnter",
                "click .email_button": "registerEmail"
            },

            initialize: function(options) {
                if (options) {
                    this.hideHaveAccount = options.hideHaveAccount || false;
                }
                this.render();
            },

            render: function() {

                // Update el with the cached template.
                $(this.el).html(this.template({
                    showHaveAccount: !this.hideHaveAccount,
                    model: this.model.toJSON(),
                }));

                return this;

            },
            updateModel: function(event) {
                this.model.set(event.target.name, event.target.value);
            },

            submitOnEnter: function(event) {
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

            submitModel: _.debounce(function(event) {

                var that = this;

                this.model.save({}, {
                    success: function(model, response) {
                        if (window.production) {
                            analytics.track('New Sign Up');
                        }
                        console.log("triggered");
                        that.trigger('saveSuccess');
                    },
                    error: function(model, response) {
                        console.log(response);
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

            }, 1000, true)

        });

        return NewAccountView;

    }
);