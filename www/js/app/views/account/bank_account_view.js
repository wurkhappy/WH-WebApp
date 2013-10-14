/*
 * Bank Account Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/bankaccount.html'],

    function (Backbone, Handlebars, bankAccountTemplate) {

      'use strict';

      var BankAccountView = Backbone.View.extend({

        className:'clear content',

        attributes:{'id':'content'},

        template: Handlebars.compile(bankAccountTemplate),

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