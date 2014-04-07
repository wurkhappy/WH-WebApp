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
                "change select": "updateFields",
                "blur #postal_code": "updatePostalCode"
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
            updatePostalCode: function(event) {
                this.card.address = {
                    "postal_code": event.target.value
                }
            },
            debounceSaveCard: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.saveCard();
            },
            saveCard: _.debounce(function(event) {
                var that = this;
                balanced.card.create(this.card, function(response) {
                    if (response.status_code === 201) {
                        var model = new that.user.attributes["cards"].model(response.cards[0]);
                        model.set("balanced_id", model.id);
                        model.unset("id");
                        that.user.get("cards").add(model);
                        model.save({}, {
                            success: function() {
                                that.trigger('cardSaved');
                                model.set("expiration_month", that.card["expiration_month"]);
                                model.set("expiration_year", that.card["expiration_year"]);
                                model.set("last_four", that.card["number"].substr(that.card["number"].length - 4));
                            }
                        });
                        $('input').val('');
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