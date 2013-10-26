/* 
* Scope of Work - Create Agreement View.
*/ 

define(['backbone', 'handlebars', 'underscore', 'kalendae',
  'text!templates/create_agreement/milestone_tpl.html', 'views/create_agreement/payment_scope_view'],

  function (Backbone, Handlebars, _, Kalendae, estimateTemplate, PaymentScopeView) {

    'use strict';

    var MilestoneView = Backbone.View.extend({

      tagName:'fieldset',
      className: 'bottom_divider',

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
        "blur .paymentAmount":"updateAmount",
        "focus .kal": "triggerCalender",
      },
      updateAmount: function(event){
        this.model.set(event.target.name, parseFloat(event.target.value));
      },
      updateFields: function(event){
        if (!event.target.name) return;
        this.model.set(event.target.name, event.target.value)
      },
      triggerCalender: function (event) {
        if (!this.calendar){
          this.calendar = new Kalendae.Input(this.$(".kal")[0], {});
          this.calendar.subscribe('date-clicked', _.bind(this.setDate, this));
        }
      },
      setDate: function(date, action){
        this.model.set("dateExpected", date);
        console.log(this.model);
      }
    });

return MilestoneView;

}
);
