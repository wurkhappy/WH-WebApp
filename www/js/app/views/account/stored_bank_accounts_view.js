define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/account/stored_bank_account_item.html', 'text!templates/account/stored_bank_accounts.html',
  'views/ui-modules/modal', 'views/account/verification_modal'],

  function (Backbone, Handlebars, _, Marionette, itemTpl, storedBankAccountsTpl, Modal, VerificationModal) {

    'use strict';

    var ItemView = Backbone.Marionette.ItemView.extend({

      template: Handlebars.compile(itemTpl),

      events: {
        "click .remove":"removeModel",
        "click .verify":"verify"
      },
      initialize: function(){
        this.listenTo(this.model, 'change', this.render);
      },
      verify: function(){
        if(!this.modal){
          var view = new VerificationModal({model:this.model});
          this.modal = new Modal({view:view});
        }
        this.modal.show();
      },
      removeModel:function(){
        this.model.destroy();
      }
    });

    var StoredBankAccountsView = Backbone.Marionette.CompositeView.extend({
      template: Handlebars.compile(storedBankAccountsTpl),
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
