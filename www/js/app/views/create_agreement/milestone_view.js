/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore',
  'text!templates/create_agreement/milestone_tpl.html', 'views/create_agreement/payment_scope_view'],

  function (Backbone, Handlebars, _, estimateTemplate, PaymentScopeView) {

    'use strict';

    var MilestoneView = Backbone.View.extend({

      tagName:'fieldset',

      template: Handlebars.compile(estimateTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.render();
      },

      render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        var paymentScopeView = new PaymentScopeView({model: this.model, collection:this.model.get('scopeItems')});
        paymentScopeView.render();
        this.$el.append(paymentScopeView.$el);

        return this;

      },
      events: {
        "blur input":"updateFields",
        "blur .paymentAmount":"updateAmount"
      },
      updateFields: function(event){
        this.model.set(event.target.name, event.target.value);
      },
      updateAmount: function(event){
        this.model.set(event.target.name, parseFloat(event.target.value));
      }


});

    return MilestoneView;

  }
  );