define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/account/stored_bank_account_item.html', 'text!templates/account/stored_bank_accounts.html'],

  function (Backbone, Handlebars, _, Marionette, itemTpl, storedBankAccountsTpl) {

    'use strict';

    var ItemView = Backbone.Marionette.CollectionView.extend({

      template: Handlebars.compile(itemTpl),

      events: {
        "click a":"removeModel"
      },
      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
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
