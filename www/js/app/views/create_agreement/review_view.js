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
            className: 'clear white_background review_container',
            events: {
                "click #submitAgreement": "continue"
            },
            initialize: function(options) {
                this.user = options.user;
                this.otherUser = options.otherUser;
                this.render();
            },
            render: function() {
                if (!this.model.get("acceptsBankTransfer") && !this.model.get("acceptsCreditCard")) {
                    var noPaymentMethods = true;
                }
                console.log(this.model.toJSON());

                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    noPaymentMethods: noPaymentMethods,
                    agreementTotal: this.model.get("payments").getTotalDue(),
                }));
                var sendView = new SendView({
                    model: this.model,
                    user: this.user,
                    otherUser: this.otherUser
                });
                this.$('#send_section').html(sendView.el);

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