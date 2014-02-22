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
                var deliverablesWidth = progressBarWidth / deliverablesCount;
                var deliverables = [];
                this.deliverables.each(function(model) {
                    var m = model.toJSON();
                    var index = model.collection.indexOf(model);
                    if (model.isComplete()) {
                        m.color = "green";
                    } else {
                        m.color = "grey"
                    }
                    m.margin_left = (deliverablesWidth) * (index + 1);
                    m.title_left = m.margin_left - (deliverablesWidth*.75);
                    deliverables.push(m);
                });
                console.log(deliverables);

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
                        var wrapperWidth = "920";
                        wrapper.css({
                            "width": wrapperWidth + "px",
                            "height": "100%",
                            "display": "block"
                        });
                        progressvalue.append(wrapper);
                        var deliverablesCount = that.deliverables.length;
                        that.deliverables.each(function(model,index) {
                            var bulletWidth = 42;
                            var modelSection = (1 / deliverablesCount) * 100;
                            var itemsCompleted = model.get("scopeItems").getCompleted().length;
                            var itemsTotal = model.get("scopeItems").length;
                            var items = model.get("scopeItems");
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
                                "background": "hsl(0, 0%, 73%)",
                                "float": "left",
                            });
                            wrapper.append(segment);
                            var itemContainer = $("<div>");
                            var itemContainerWidth = (wrapperWidth / deliverablesCount);
                            var itemContainerMargin = itemContainerWidth * index;
                            itemContainer.css({
                                "width": itemContainerWidth+"px",
                                "height": "100%",
                                "display": "block",
                                "background": "none",
                                "margin-left": itemContainerMargin +"px",
                                "position": "absolute"
                            });
                            wrapper.append(itemContainer);
                            items.each(function(list, index, model) {
                                var segmentWidth = (wrapperWidth / deliverablesCount);
                                var itemCount = model.length;
                                var segLine_margin_left = (segmentWidth/itemCount) * (index + 1);
                                var segLine = $("<span>");
                                segLine.css({
                                    "height":"15px",
                                    "width": "5px",
                                    "background":"black",
                                    "display": "block",
                                    "position": "absolute",
                                    "left": segLine_margin_left + "px"
                                });
                            itemContainer.append(segLine);
                            });
                        });
                    }

                });
            },
            updateCollections: function() {
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