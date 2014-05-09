/*
 * New Bank Account View.
 */

define(['jquery', 'backbone', 'handlebars', 'toastr', 'hbs!templates/account/new_bank_account_tpl'],

    function($, Backbone, Handlebars, toastr, Template) {

        'use strict';

        var NewBankAccountView = Backbone.View.extend({

            template: Template,
            events: {
                "blur input": "updateFields",
                "click #save-button": "debounceSaveBankAccount",
                "change select": "updateFields"
            },

            initialize: function(options) {
                this.user = options.user;
                if (this.user.get("firstName")) var name = this.user.attributes.firstName + ' ' + this.user.attributes.lastName;
                this.account = {
                    name: name,
                    type: "checking"
                };
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.account));
                return this;
            },
            updateFields: function(event) {
                this.account[event.target.name] = event.target.value;
            },

            debounceSaveBankAccount: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.saveBankAccount();
            },
            returnToURL: function() {
                _.delay(function() {
                    var paramsString = window.location.search.substr(1);
                    var params = paramsString.split("&");
                    var map = {};
                    for (var i = 0; i < params.length; i++) {
                        var param = params[i].split("=")
                        map[param[0]] = param[1];
                    }
                    if (map["returnURL"]) {
                        window.location = map["returnURL"];
                    }
                }, 1200);
            },
            saveBankAccount: _.debounce(function(event) {
                var that = this;
                balanced.bankAccount.create(this.account, function(response) {
                    if (response.status_code === 201) {
                        var model = new that.user.attributes["bank_accounts"].model(response.bank_accounts[0]);
                        model.set("balanced_id", model.id);
                        model.unset("id");
                        that.user.get("bank_accounts").add(model);
                        model.save();
                        that.$('input').val('');
                        that.trigger('accountSaved');
                        toastr.success('Bank Account Saved!');
                        that.account = {
                            type: "checking"
                        };
                        that.returnToURL();

                    } else {
                        console.log(response);
                    }
                });
            }, 500, true)

        });

        return NewBankAccountView;

    }
);