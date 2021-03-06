/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'hbs!templates/landing/new_account', 'models/user',
        'views/ui-modules/modal', 'views/agreement/read/modals/email_subscribe', 'hbs!templates/landing/signup_error'
    ],

    function(Backbone, Handlebars, parsley, newAccountTemplate, UserModel, Modal, EmailModal, errorTemplate) {

        'use strict';

        var NewAccountView = Backbone.View.extend({

            // Compile our footer template.
            template: newAccountTemplate,
            model: new UserModel(),
            errorTemplate: errorTemplate,

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

            debounceSubmitModel: function(event) {
                event.preventDefault();
                event.stopPropagation();
                _.debounce(this.submitModel(), 1000, true);
            },

            submitModel: function(event) {

                var that = this;

                this.$('.login_form').parsley('validate');
                var isValid = this.$('.login_form').parsley('isValid');
                if (!isValid) return false;

                this.model.createAccount({}, {
                    success: function(model, response) {
                        if (window.production) {
                            analytics.track('New Sign Up');
                        }
                        that.trigger('saveSuccess');
                    },
                    error: function(model, response) {
                        that.$('#login_form').html(that.errorTemplate());
                        that.$('.email_signup').fadeIn("slow");

                    }
                })
                return true;

            },

        });

        return NewAccountView;

    }
);