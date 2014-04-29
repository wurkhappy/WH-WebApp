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
                this.deliverables = options.tasks
                //we want all accepted payments as well as the most recent payment
                this.listenTo(this.deliverables, "change:lastAction", this.render);
                this.listenTo(this.deliverables, "add", this.updateCollections);
                this.deliverables.each(_.bind(function(model) {
                    // this.listenTo(model.get("subTasks"), "change:lastAction", this.onRender);
                }, this));
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
                    model.get("subTasks").comparator = function(item) {
                        if (item.get('completed')) {
                            return true;
                        }
                    };
                    model.get("subTasks").sort();

                    var m = model.toJSON();
                    var index = model.collection.indexOf(model);
                    if (model.isComplete()) {
                        m.color = "green";
                    } else {
                        m.color = "grey";
                    }

                    for (var x in m.subTasks) {
                        // set how far each task is from the tick container
                        m.subTasks[x].task_margin_left = (deliverablesWidth / m.subTasks.length) * (parseInt(x) + 1) + bulletWidth / 2 - 2 + barLeftMargin;
                        if (m.subTasks[x].lastAction && m.subTasks[x].lastAction.name === "completed") {
                            m.subTasks[x].color = "green";
                        } else {
                            m.subTasks[x].color = "grey";
                        }
                    }

                    m.segment_width = deliverablesWidth;
                    m.placement_left = (deliverablesWidth) * (index);
                    m.margin_left = (deliverablesWidth) * (index + 1);
                    m.title_left = m.margin_left - (deliverablesWidth * .75);
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
                    change: function(event, ui) {
                        var progress = $(this);
                        var progressvalue = progress.children(".ui-progressbar-value");
                        progressvalue.empty();
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
                        that.deliverables.each(function(model, index) {
                            var bulletWidth = 42;
                            var modelSection = (1 / deliverablesCount) * 100;
                            var itemsCompleted = model.get("subTasks").getCompleted().length;
                            var itemsTotal = model.get("subTasks").length;
                            var seg = $("<span>");
                            var fractionCompleted = (itemsCompleted / itemsTotal);
                            if (model.isComplete()) fractionCompleted = 1;
                            if (itemsTotal === 0 && !model.isComplete()) fractionCompleted = 0;

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

                this.updateProgressbar();
            },
            updateProgressbar: function() {
                var val = this.$('.progress-large').progressbar("value");
                if (val === 100) {
                    val = 99;
                } else {
                    val = 100;
                }
                this.$('.progress-large').progressbar("value", val);
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
                        var action = model.get("name");
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