define(['backbone', 'handlebars', 'hbs!templates/create_agreement/review_tpl',
        'views/agreement/read/modals/agreement_submit', 'views/ui-modules/modal',
        'views/create_agreement/send_view'
    ],

    function(Backbone, Handlebars, tpl, AgreementSubmitModal, Modal, SendView) {

        'use strict';
        Handlebars.registerHelper('PlusOne', function(index) {
            if (!index) {
                return
            };
            return parseInt(index) + 1;
        });

        var ReviewView = Backbone.View.extend({
            template: tpl,
            className: 'clear white_background',
            events: {
                "click #continue": "continue"
            },
            initialize: function(options) {
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.payments = options.payments;
                this.tasks = options.tasks;
                this.render();
            },
            render: function() {
                if (!this.model.get("acceptsBankTransfer") && !this.model.get("acceptsCreditCard")) {
                    var noPaymentMethods = true;
                }

                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    payments: this.payments.toJSON(),
                    tasks: this.tasks.toJSON(),
                    noPaymentMethods: noPaymentMethods,
                    agreementTotal: this.payments.getTotalDue(),
                }));

                $('body').scrollTop(0);
                return this;
            },
            continue: function(event) {
                event.preventDefault();
                event.stopPropagation();

                window.location.hash = '#send';
            }

        });

        return ReviewView;

    }
);