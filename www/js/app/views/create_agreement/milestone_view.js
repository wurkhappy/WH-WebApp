/*
 * Scope of Work - Create Agreement View.
 */ 

 define(['backbone', 'handlebars', 'underscore', 'kalendae',
  'text!templates/create_agreement/milestone_tpl.html', 'views/create_agreement/payment_scope_view'],

  function (Backbone, Handlebars, _, Kalendae, estimateTemplate, PaymentScopeView) {

    'use strict';

    var MilestoneView = Backbone.View.extend({

      tagName:'fieldset',

      template: Handlebars.compile(estimateTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.render();
        
      },

      render: function () {
        console.log("hi");

        this.$el.html(this.template(this.model.toJSON()));
        var paymentScopeView = new PaymentScopeView({model: this.model, collection:this.model.get('scopeItems')});
        paymentScopeView.render();
        this.$el.append(paymentScopeView.$el);
        console.log(paymentScopeView.$el);        

        return this;

      },
      events: {
        "blur input":"updateFields"
      },
      updateFields: function(event){
        this.model.set(event.target.name, event.target.value)
      }


});

    return MilestoneView;

  }
  );