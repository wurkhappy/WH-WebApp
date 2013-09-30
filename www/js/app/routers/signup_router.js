/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define([
  'backbone',
  'views/signup/main_container_view',
  'views/signup/personal_view',
  'views/signup/credit_card_view',
  'views/signup/bank_account_view'],
  function (Backbone, MainContainer, PersonalView, CreditCardView, BankAccountView) {

      'use strict';

      var AccountRouter = Backbone.Router.extend({

        routes: {
          '': 'personal',
          'personal': 'personal',
          'bankaccount': 'bankAccount',
          'creditcard': 'creditCard'
        },

        initialize: function () {
          // model stuff here. Let's get this working after setting up basic views
          //this.model = new AgreementModel();
          //this.model.set("payments", [{title:"Wireframe", amount:10.5}]);

          // Initialize main View.
          this.mainContainer = new MainContainer();

        },

        personal: function () {
          if (!this.personalView) {
            // need to add in model stuff
            this.personalView = new PersonalView({router:this});
          }
          this.mainContainer.switchToView(this.personalView);
        },

        creditCard: function () {
          if (!this.creditCardView) {
            // need to add in model stuff
            this.creditCardView = new CreditCardView({router:this});
          }
          this.mainContainer.switchToView(this.creditCardView);
        },

        bankAccount: function () {
          if (!this.bankAccountView) {
            // need to add in model stuff
            this.bankAccountView = new BankAccountView({router:this});
          }
          console.log(this.bankAccountView)
          this.mainContainer.switchToView(this.bankAccountView);
        }

      });

      return AccountRouter;

    }
);