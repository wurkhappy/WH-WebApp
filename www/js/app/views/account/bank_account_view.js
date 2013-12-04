/*
 * Bank Account Account View.
 */

define(['backbone', 'handlebars', 'hbs!templates/account/bankaccount'],

    function (Backbone, Handlebars, bankAccountTemplate) {

      'use strict';

      var BankAccountView = Backbone.View.extend({

        className:'clear white_background',

        attributes:{'id':'content'},

        template: bankAccountTemplate,

        initialize: function () {
          this.render();
        },

        render: function () {
          this.$el.html(this.template());
          return this;
        }

      });

      return BankAccountView;

    }
);