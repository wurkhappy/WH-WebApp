/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/payment_scope_tpl.html', 'views/create_agreement/scope_item_view'],

  function (Backbone, Handlebars, _, Marionette, paymentScopeTemplate, ScopeItemView) {

    'use strict';

    var PaymentScopeView = Backbone.Marionette.CompositeView.extend({

      className:'scopeWrapper',

      template: Handlebars.compile(paymentScopeTemplate),

      itemView: ScopeItemView,
      itemViewContainer:'ul',

      initialize: function(options) {
        this.deposit = options.deposit;

        this.render();
      },

      render: function() {
        var deposit = this.deposit;

        this.$el.html(this.template({
          deposit: deposit
        }));
      },

      events:{
        "keypress input" : "addOnEnter",
        "click .add_comment": "addScopeItem",
        "focus input": "fadeError"
      },

      addOnEnter: function(event){
        if (event.keyCode == 13) {
          this.collection.add({text:event.target.value});
          event.target.value = null;
        }
      },

      addScopeItem: function(event) {
        event.preventDefault();
        var $text = $(event.target).prev('.add_work_item_input'),
            $input = $('input'),
            $error = $(event.target).next('.add_work_item_error');

        if ($text.val() === '') {
          $error.fadeIn('fast');
          $input.keypress( function() {
            $('.add_work_item_error').fadeOut('fast');
          });
          $text.focus();

        } else {
          this.collection.add({text:$text.val()});
          $text.val(null);
          $text.focus();
        }
      },

      fadeError: function(event) {
        $('.add_work_item_error').fadeOut('fast');
      }

    });

    return PaymentScopeView;

  }
  );