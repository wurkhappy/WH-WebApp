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
                var progressBarWidth = 800;
                var bulletWidth = 42;
                var barLeftMargin = 40;
                var deliverablesCount = this.deliverables.length;
                var deliverablesWidth = progressBarWidth / deliverablesCount;
                var deliverables = [];
                var tasks = [];
                var that = this;
                this.deliverables.each(function(model) {

                    // sort tasks whenever one is checked off so ticks remain consistent 
                    // with agreement progress percentage
                    model.get("scopeItems").comparator = function (item) {
                        if (item.get('completed')) {
                            return true;
                        }
                    };
                    model.get("scopeItems").sort();

                    var m = model.toJSON();
                    var index = model.collection.indexOf(model);
                    if (model.isComplete()) {
                        m.color = "green";
                    } else {
                        m.color = "grey";
                    }

                    for (var x in m.scopeItems) {
                        // set how far each task is from the tick container
                        m.scopeItems[x].task_margin_left = (deliverablesWidth/m.scopeItems.length)*(parseInt(x) + 1) + bulletWidth/2 - 2 + barLeftMargin;
                        if (m.scopeItems[x].completed === true) {
                            m.scopeItems[x].color = "green";
                        } else {
                            m.scopeItems[x].color = "grey";
                        }
                    }

                    m.segment_width = deliverablesWidth;
                    m.placement_left = (deliverablesWidth) * (index);
                    m.margin_left = (deliverablesWidth) * (index + 1);
                    m.title_left = m.margin_left - (deliverablesWidth*.75);
                    deliverables.push(m);
                });

                this.$el.html(this.template({
                    deliverables: deliverables,
                    tasks: tasks
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
                        var wrapperWidth = "800";
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
                            var fractionCompleted = (itemsCompleted / itemsTotal);
                            if (model.get("completed")) fractionCompleted = 1;

                            seg.css({
                                "width": fractionCompleted * modelSection + "%",
                                "height": "100%",
                                "display": "block",
                                "background": "#9DD573",
                                "float": "left"
                            });
                            wrapper.append(seg);
                            var segment = $("<span>");
                            segment.css({
                                "width": (1 - fractionCompleted) * modelSection + "%",
                                "height": "100%",
                                "display": "block",
                                "background": "hsl(0, 0%, 73%)",
                                "float": "left",
                            });
                            wrapper.append(segment);
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