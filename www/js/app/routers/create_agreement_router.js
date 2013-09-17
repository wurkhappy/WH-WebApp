/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'views/account/create_agreement_view', 'views/account/payment_schedule_view', 'views/account/recipient_details_view', 'views/account/scope_of_work_view'],

    function (Backbone, CreateAgreementView, PaymentScheduleView, RecipientDetailsView, ScopeOfWorkView) {

      'use strict';

      var CreateAgreementRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
          'scope': 'showScopeOfWork',
          'schedule': 'showPaymentSchedule',
          'recipient': 'showRecipientDetails',
          'bankaccount': 'showBankAccount'
        },

        initialize: function () {

          // Setup the root-level application View.
          this.mainView = new CreateAgreementView();


          // Initialize other Views.
          this.scopeOfWorkView = new ScopeOfWorkView();
          this.paymentScheduleView = new PaymentScheduleView();
          this.recipientDetailsView = new RecipientDetailsView();

        },

        index: function () {

          // Render the about view.
          this.scopeOfWorkView.render().el;

        },

        showScopeOfWork: function () {

          //var personalView = new PersonalView();

          // render about view
          this.scopeOfWorkView.render().el;

        },

        showPaymentSchedule: function () {

          //var paymentView = new PaymentView();

          // render the pricing view
          this.paymentScheduleView.render().el;
        },

        showRecipientDetails: function () {

          //var personalView = new PersonalView();

          // render about view
          this.recipientDetailsView.render().el;

        }

      });

      return CreateAgreementRouter;

    }
);