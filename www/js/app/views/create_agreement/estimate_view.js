/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette', 'toastr', 'parsley', 'autonumeric',
  'hbs!templates/create_agreement/estimate_tpl', 'views/create_agreement/milestone_view'],

  function (Backbone, Handlebars, _, Marionette, toastr, parsley, autoNumeric, estimateTemplate, MilestoneView) {

    'use strict';

    var EstimateView = Backbone.Marionette.CompositeView.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: estimateTemplate,

      itemView: MilestoneView,

      initialize: function (options) {
        this.router = options.router;
        this.deposit = this.collection.findFirstRequiredPayment();
        this.bankAccounts = options.user.get("bank_accounts");
        this.creditCards = options.user.get("cards");
        if (this.model.get("payments").length < 1) {
          this.collection.add({'dateExpected': moment().add('days', 7).calendar()})
        }

        this.clientPaymentMethods();
      },

      events:{
        "click #addMoreButton" : "addMilestone",
        "click #save_continue" : "debounceSaveAndContinue",
        "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
        "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation",
        "click .create_agreement_navigation_link": "showPage",
        "click .payment_method":"updatePaymentMethods",
        "blur #deposit":"updateDeposit",
        'focus .currency_format': 'triggerCurrencyFormat',
      },

      clientPaymentMethods: function() {

        if (this.model.get("clientID")) {
          if (this.bankAccounts.length < 1) {
            this.model.set('acceptsBankTransfer', false);
          } 
          if (this.creditCards.length < 1) {
            this.model.set('acceptsCreditCard', false);
          }
        }
      },

      updatePaymentMethods: function(event){
        if (!event.target.name) return;

        // if the user is a client check to see they have the right payment method setup 
        if (this.model.get("clientID")) {
          if (this.bankAccounts.length < 1 && event.target.name === "acceptsBankTransfer") {
            event.preventDefault();
            toastr.info("Please add a bank account in the accounts section");
          } else if (this.creditCards.length < 1 && event.target.name === "acceptsCreditCard") {
              event.preventDefault();
              toastr.info("Please add a Credit Card in the accounts section");
            }
        }

        if (event.target.checked) {
          this.model.set(event.target.name, true);
        } else {
          this.model.set(event.target.name, false);
        }
      },
      renderModel: function(){
        var data = {};
        if(this.deposit) data = this.deposit.toJSON();
        
        //if it's not the client and if credit card & bank transfer payment methods are set by default, add them to data object to be rendered
        // in estimate template
        if (!this.model.get("clientID")){
          if(this.model.get("acceptsCreditCard")) data.acceptsCreditCard = this.model.get("acceptsCreditCard");
          if(this.model.get("acceptsBankTransfer")) data.acceptsBankTransfer = this.model.get("acceptsBankTransfer");
        }
        
        data = this.mixinTemplateHelpers(data);

        var template = this.getTemplate();
        return Marionette.Renderer.render(template, data);
      },

      onRender: function() {
        $('body').scrollTop(0);
      },

      appendHtml: function(collectionView, itemView, index){
        if (itemView.model.get("title") === 'Deposit') {return;}
        itemView.$el.insertBefore(collectionView.$('#addMoreButton'));
      },

      addMilestone:function(event){
        event.preventDefault();
        this.collection.add({'dateExpected': moment().add('days', 7).calendar()});
      },

      triggerCurrencyFormat: function() {
        $('.currency_format').autoNumeric('init', {aSign:'$ ', pSign:'p', vMin: '0', vMax: '100000' });
      },

      debounceSaveAndContinue: function(event) {
        event.preventDefault();
        event.stopPropagation();

        this.saveAndContinue();
      },
      
      saveAndContinue:_.debounce(function(event){

        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = 'review';
          }, this)
        });
      }, 500, true),

      showPage: function(event) {
        event.preventDefault();
        event.stopPropagation();

        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");

        var destination = $(event.currentTarget).attr('href');

        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = destination;
          }, this)
        });
      },

      mouseEnterNavigation: function (event) {
        $(event.currentTarget).find("h2").addClass("create_agreement_navigation_link_hover");
      },

      mouseLeaveNavigation: function (event) {
        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
      },
      updateDeposit: function(event){
        var amount = event.target.value;
        var adjAmount = (amount.substring(0,2) === '$ ') ? amount.substring(2) : amount;
        var formattedAmount = parseFloat(adjAmount.replace(/,/g, ''), 10);

        if (this.deposit){
          this.deposit.set("amount", formattedAmount);

        } else{
          var Model = this.model.get("payments").model;
          this.deposit = new Model({title: "Deposit", amount: formattedAmount, required: true});
          this.model.get("payments").add(this.deposit);
        }

        if (adjAmount == 0) {
          this.model.get("payments").remove(this.deposit);
        }
      }

    });

return EstimateView;

}
); 
