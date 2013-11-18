/* 
* Scope of Work - Create Agreement View.
*/ 

define(['backbone', 'handlebars', 'underscore', 'kalendae', 'text!templates/create_agreement/milestone_tpl.html', 'views/create_agreement/payment_scope_view'],

  function (Backbone, Handlebars, _, Kalendae, milestoneTemplate, PaymentScopeView) {

    'use strict';
    Handlebars.registerHelper('dateFormat', function(date) {
      return date.format('MMM D, YYYY');
    });

    var MilestoneView = Backbone.View.extend({

      tagName:'div',
      className: 'bottom_divider hide',

      template: Handlebars.compile(milestoneTemplate),

      initialize: function (options) {
        this.router = options.router;
        this.render();
      },

      render: function () {

        var deposit = this.model.isDeposit();

        this.$el.html(this.template({
          model: this.model.toJSON(),
          deposit: deposit
        }));
        var paymentScopeView = new PaymentScopeView({
          model: this.model,
          collection:this.model.get('scopeItems'),
          deposit: deposit
        });
        paymentScopeView.render();
        paymentScopeView.$el.insertBefore(this.$('.removeButton'));
        this.$el.fadeIn('slow');

        return this;

      },
      events: {
        "blur input":"updateFields",
        "blur .paymentAmount":"updateAmount",
        "focus .kal": "triggerCalender",
        "click .remove_icon > a":"removeModel"
      },
      updateAmount: function(event){
        this.model.set(event.target.name, parseFloat(event.target.value));
      },
      updateFields: function(event){
        if (!event.target.name) return;
        this.model.set(event.target.name, event.target.value);
      },
      triggerCalender: function (event) {
        if (!this.calendar){
          this.calendar = new Kalendae.Input(this.$(".kal")[0], {});
          this.calendar.subscribe('date-clicked', _.bind(this.setDate, this));
        }
      },
      setDate: function(date, action){
        this.model.set("dateExpected", date);
         _.delay(this.closeCalendar, 150);
         this.$('.kal').val(date.format('MM/DD/YYYY'))
         this.$('.kal').blur();
      },
      closeCalendar: function() {
        $('.kalendae').hide();
      },
      removeModel: function(event){
        var that = this;
        that.$el.fadeOut('fast');
        _.delay( function() {
          that.model.collection.remove(that.model);
        }, 1000);
      }

    });

return MilestoneView;

}
);
