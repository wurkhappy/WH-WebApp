/*
 * Credit Card Account View.
 */

define(['jquery', 'backbone', 'handlebars', 'toastr', 'hbs!templates/account/new_card_tpl'],

    function($, Backbone, Handlebars, toastr, Template) {

        'use strict';

        var NewCardView = Backbone.View.extend({

            template: Template,
            events: {
                "blur input": "updateFields",
                "click #save-button": "debounceSaveCard",
                "change select": "updateFields"
            },

            initialize: function(options) {
                this.card = {
                    "expiration_month": 1,
                    "expiration_year": 2014
                };
                this.user = options.user;
                this.render();
            },

            render: function() {
                this.$el.html(this.template());
                return this;
            },
            updateFields: function(event) {
                this.card[event.target.name] = event.target.value;
            },

            debounceSaveCard: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.saveCard();
            },
            saveCard: _.debounce(function(event) {
                var that = this;
                balanced.card.create(this.card, function(response) {
                    if (response.status === 201) {
                        if (response.data.id) {
                            delete response.data.id
                        }
                        var model = new that.user.attributes["cards"].model(response.data);
                        that.user.get("cards").add(model);
                        model.save();
                        $('input').val('');
                        that.trigger('cardSaved');
                        toastr.success('Credit Card Saved!');

                    } else {
                        console.log(response);
                    }
                });
            }, 500, true)

        });

        return NewCardView;

    }
);