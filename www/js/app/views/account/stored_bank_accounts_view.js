define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/account/stored_bank_account_item', 'hbs!templates/account/stored_bank_accounts',
  'views/ui-modules/modal', 'views/account/verification_modal', 'views/account/delete_payment_method_modal'],

  function (Backbone, Handlebars, _, Marionette, itemTpl, storedBankAccountsTpl, Modal, VerificationModal, DeletePaymentMethodModal) {

    'use strict';

    var ItemView = Backbone.Marionette.ItemView.extend({

      template: itemTpl,

      events: {
        "click .remove":"showRemoveModelModal",
        "click .verify":"verify"
      },
      initialize: function(){
        this.listenTo(this.model, 'change', this.render);
      },
      verify: function(){
        event.preventDefault();
        event.stopPropagation();

        if(!view){
          var view = new VerificationModal({model:this.model});
        }
          this.modal = new Modal({view:view});

        this.modal.show();
      },
      showRemoveModelModal:function(){
        event.preventDefault();
        event.stopPropagation();

        if(!view){
          var view = new DeletePaymentMethodModal({model:this.model});
        }
          this.modal = new Modal({view:view});

        this.modal.show();
      }
    });

    var StoredBankAccountsView = Backbone.Marionette.CompositeView.extend({
      template: storedBankAccountsTpl,
      itemView: ItemView,
      itemViewContainer:'table',
      events: {
      },

      initialize:function(){
        this.render();
      }
    });

    return StoredBankAccountsView;

  }
  );
