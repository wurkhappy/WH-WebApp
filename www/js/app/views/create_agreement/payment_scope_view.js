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

      events:{
        "keypress input" : "addOnEnter",
        "click .add_comment": "addComment"
        //"focus input": "fadeError"
      },

      addOnEnter: function(event){
        if (event.keyCode == 13) {
          this.collection.add({text:event.target.value});
          event.target.value = null;
        }
      },

      addComment: function(event) {
        var $text = $('.add_work_item_input'),
            $input = $('input');

        if ($text.val() === '') {
          $('.add_work_item_error').fadeIn('fast');
          $input.keypress( function() {
            $('.add_work_item_error').fadeOut('fast');
          })

        } else {
          this.collection.add({text:$text.val()});
          $text.val(null);
        }
      },

      fadeError: function(event) {
        console.log("hello");
        $('.add_work_item_error').fadeOut('fast');
      }

    });

    return PaymentScopeView;

  }
  );