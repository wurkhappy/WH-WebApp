/*
 * Bank Account Account View.
 */

define(['backbone', 'handlebars', 'text!templates/account/bankaccount.html'],

    function (Backbone, Handlebars, bankaccountTemplate) {

      'use strict';

      var BankAccountView = Backbone.View.extend({

        el: '#content',

        // Compile our footer template.
        template: Handlebars.compile(bankaccountTemplate),

        initialize: function () {

          this.render();

        },

        render: function () {

          // Update el with the cached template.
          $(this.el).html(this.template());

          return this;

        }

      });

      return BankAccountView;

    }
);