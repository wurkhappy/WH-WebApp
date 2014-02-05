/*
 * Agreement - Create Progress Bar View.
 */

define(['jquery', 'backbone', 'handlebars', 'underscore', 'marionette', 'jquery-ui',
        'hbs!templates/agreement/agreement_progress_bar_tpl'
    ],

    function($, Backbone, Handlebars, _, Marionette, jquery_ui, progressBarTemplate) {

        'use strict';

        var ProgressBarView = Backbone.View.extend({

            template: progressBarTemplate,
            attributes: {
                'style': 'position:relative;'
            },

            initialize: function(options) {

                //we want all accepted payments as well as the most recent payment
                this.deliverables = options.model.get("workItems");
                this.listenTo(this.deliverables, "change:currentStatus", this.render);
                this.listenTo(this.deliverables, "add", this.updateCollections);
                this.deliverables.each(_.bind(function(model) {
                    this.listenTo(model.get("scopeItems"), "change:completed", this.render);
                }, this));
            },
            events: {
                // "mouseover .progress_icon": "hoverPayment",
                // "mouseleave .progress_icon": "unhoverPayment",
            },

            render: function() {
                var progressBarWidth = 920;
                var bulletWidth = 42;
                var deliverablesCount = this.deliverables.length;
                var deliverables = [];
                this.deliverables.each(function(model) {
                    var m = model.toJSON();
                    var index = model.collection.indexOf(model);
                    if (model.isComplete()) {
                        m.color = "green";
                    } else {
                        m.color = "grey"
                    }
                    m.margin_left = (progressBarWidth / deliverablesCount) * (index + 1);
                    deliverables.push(m);
                })

                this.$el.html(this.template({
                    deliverables: deliverables,
                }));
                _.defer(_.bind(this.onRender, this));
                return this;

            },
            onRender: function() {
                var that = this;
                this.$('.progress-large').progressbar({
                    value: 100,
                    create: function(event, ui) {
                        var progress = $(this);
                        var progressvalue = progress.children(".ui-progressbar-value");
                        progressvalue.css("overflow", "hidden");
                        var wrapper = $("<div>");
                        wrapper.css({
                            "width": "920px",
                            "height": "100%",
                            "display": "block"
                        });
                        progressvalue.append(wrapper);
                        var deliverablesCount = that.deliverables.length;
                        that.deliverables.each(function(model) {
                            var modelSection = (1 / deliverablesCount) * 100;
                            var itemsCompleted = model.get("scopeItems").getCompleted().length;
                            var itemsTotal = model.get("scopeItems").length;
                            var seg = $("<span>");
                            seg.css({
                                "width": (itemsCompleted / itemsTotal) * modelSection + "%",
                                "height": "100%",
                                "display": "block",
                                "background": "#9DD573",
                                "float": "left"
                            });
                            wrapper.append(seg);
                            var segment = $("<span>");
                            segment.css({
                                "width": (1 - (itemsCompleted / itemsTotal)) * modelSection + "%",
                                "height": "100%",
                                "display": "block",
                                "background": "hsl(210, 13%, 85%)",
                                "float": "left"
                            });
                            wrapper.append(segment);
                        });
                    }

                });
            },
            updateCollections: function() {
                this.payments = this.allPayments.getAcceptedPayments();
                this.payments.add(this.allPayments.at(this.allPayments.length - 1));
                this.render();
            },
            hoverPayment: function(event) {
                var id = $(event.target).data("paymentid");
                if (id) {
                    var list = '';
                    var history = this.model.get("statusHistory").filterByPaymentID(id);
                    history.each(function(model) {
                        var action = model.get("action");
                        list += '<li>' + action.charAt(0).toUpperCase() + action.slice(1) + " on " + model.get("date").format('MMM DD, YYYY') + '</li>';
                    })
                    if (history.length === 0) {
                        list = 'No actions taken yet'
                    }
                    $(event.target).html('<div class="tooltip" style="position: absolute;"><ul>' + list + '</ul></div>');
                }
            },
            unhoverPayment: function(event) {
                $(event.target).empty();
                $(event.target).remove('div');
            }

        });

        return ProgressBarView;

    }
);