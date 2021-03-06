/*
 * Scope of Work - Create Agreement View.
 */

define(['backbone', 'handlebars', 'underscore', 'marionette', 'toastr', 'parsley', 'autonumeric',
        'hbs!templates/create_agreement/estimate_tpl', 'views/create_agreement/work_item_view',
        'views/create_agreement/payment_schedule', 'views/create_agreement/service_preview_item_view'
    ],

    function(Backbone, Handlebars, _, Marionette, toastr, parsley, autoNumeric, estimateTemplate, WorkItemView,
        PaymentSchedule, ServicePreview) {

        'use strict';

        var EstimateView = Backbone.Marionette.CompositeView.extend({

            className: 'clear white_background',
            attributes: {
                'id': 'content'
            },

            template: estimateTemplate,

            itemView: WorkItemView,

            initialize: function(options) {
                this.router = options.router;
                this.deposit = this.collection.findDeposit();
                this.bankAccounts = options.user.get("bank_accounts");
                this.creditCards = options.user.get("cards");
                if (this.collection.length === 0) {
                    this.collection.add({})
                };
                console.log(options);
            },

            events: {
                "click #addService": "addService",
                "click #saveContinue": "debounceSaveAndContinue",
                "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
                "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation",
                "click .create_agreement_navigation_link": "showPage",
                "click .payment_method": "updatePaymentMethods",
                "blur #deposit": "updateDeposit",
                'focus .currency_format': 'triggerCurrencyFormat',
            },

            updatePaymentMethods: function(event) {
                if (!event.target.name) return;
                if (event.target.checked) {
                    this.model.set(event.target.name, true);
                } else {
                    this.model.set(event.target.name, false);
                }
            },
            renderModel: function() {
                var data = {};
                if (this.deposit) data = this.deposit.toJSON();

                //if credit card & bank transfer payment methods are set by default, add them to data object to be rendered
                // in estimate template
                if (this.model.get("acceptsCreditCard")) data.acceptsCreditCard = this.model.get("acceptsCreditCard");
                if (this.model.get("acceptsBankTransfer")) data.acceptsBankTransfer = this.model.get("acceptsBankTransfer");

                data = this.mixinTemplateHelpers(data);

                var template = this.getTemplate();
                return Marionette.Renderer.render(template, data);
            },

            onRender: function() {
                $('body').scrollTop(0);

                console.log(this.itemView);

                var preview = new ServicePreview({
                    model: this.model,
                    collection: this.collection
                });

                console.log(preview);

                this.$('#servicePreview').html();
            },

            appendHtml: function(collectionView, itemView, index) {
                if (itemView.model.get("title") === 'Deposit') {
                    return;
                }
                itemView.$el.insertBefore(collectionView.$('#bottomDiv'));
            },

            addService: function(event) {
                event.preventDefault();
                this.collection.add({});
            },

            triggerCurrencyFormat: function() {
                $('.currency_format').autoNumeric('init', {
                    aSign: '$ ',
                    pSign: 'p',
                    vMin: '0',
                    vMax: '100000'
                });
            },

            debounceSaveAndContinue: function(event) {
                event.preventDefault();
                event.stopPropagation();
                _.clone(this.collection).each(_.bind(function(model) {
                    if (!model.get("title")) {
                        this.collection.remove(model);
                    };
                }, this));
                this.saveAndContinue();
            },

            saveAndContinue: _.debounce(function(event) {

                this.model.save({}, {
                    success: _.bind(function(model, response) {
                        window.location.hash = 'payment';
                    }, this)
                });
            }, 500, true),

            showPage: function(event) {
                event.preventDefault();
                event.stopPropagation();

                $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");

                var destination = $(event.currentTarget).attr('href');

                this.model.save({}, {
                    success: _.bind(function(model, response) {
                        window.location.hash = destination;
                    }, this)
                });
            },

            mouseEnterNavigation: function(event) {
                $(event.currentTarget).find("h2").addClass("create_agreement_navigation_link_hover");
            },

            mouseLeaveNavigation: function(event) {
                $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
            },
            updateDeposit: function(event) {
                var amount = event.target.value;
                var adjAmount = (amount.substring(0, 2) === '$ ') ? amount.substring(2) : amount;
                var formattedAmount = parseFloat(adjAmount.replace(/,/g, ''), 10);

                if (this.deposit) {
                    this.deposit.set("amountDue", formattedAmount);

                } else {
                    var Model = this.model.get("workItems").model;
                    this.deposit = new Model({
                        title: "Deposit",
                        amountDue: formattedAmount,
                        required: true
                    });
                    this.model.get("workItems").unshift(this.deposit);
                }

                if (adjAmount == 0) {
                    this.model.get("workItems").remove(this.deposit);
                }
            }

        });

        return EstimateView;

    }
);