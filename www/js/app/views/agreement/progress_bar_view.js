/*
 * Agreement - Create Progress Bar View.
 */

 define(['jquery', 'backbone', 'handlebars', 'underscore', 'marionette', 'jquery-ui',
  'text!templates/agreement/agreement_progress_bar_tpl.html'],

  function ($, Backbone, Handlebars, _, Marionette, jquery_ui, progressBarTemplate) {

    'use strict';

    Handlebars.registerHelper('adjustIconColor', function(action) {
      if ( action === 'submitted') {
        return 'yellow_progress';
      } else if (action === 'accepted') {
        return 'green_progress';
      } else if (action === 'rejected') {
        return 'red_progress';
      } else {
        return 'grey_progress';
      }
    });

    Handlebars.registerHelper('midpoint', function(index, options) {
      var total = options.payments.length;
      if (total%2 ==0 && (index == total/2 || index == total - 0.5)){
        return '<i class="fa fa-circle progress_icon" style="opacity:0;"></i>';
      }
      return '';
    });

    var ProgressBarView = Backbone.View.extend({

      template: Handlebars.compile(progressBarTemplate),

      initialize:function(options){

        //we want all accepted payments as well as the most recent payment
        this.payments = options.model.get("payments").getAcceptedPayments();
        this.payments.add(options.model.get("payments").at(options.model.get("payments").length -1));
        this.workItems = options.model.get("workItems");
        this.listenTo(this.payments, "change", this.render);
      },
      events:{
        "mouseover .progress_icon":"hoverPayment",
        "mouseleave .progress_icon":"unhoverPayment",
      },

      render: function () {
        var deposit = this.workItems.findDeposit();
        var totalAmountExDeposit = this.workItems.getTotalAmount() - deposit.get("amount");
        var percentComplete = ((this.payments.getTotalAmount()- deposit.get("amount"))/totalAmountExDeposit) * 100;
        var requiredPaymentsCount = (deposit) ? 1 : 0;

        var iconSize = 30;

        var totalIconWidth= this.payments.length*iconSize;
        var barWidth = 800 - 0;

        var numberPayments = this.payments.length - requiredPaymentsCount;


        var payments = [];

        console.log(percentComplete)
        this.payments.each(function(model){
          var color = "grey";
          var action = (model.get("currentStatus")) ? model.get("currentStatus").get("action") : "";
          if (action === "submitted") {
            color = "yellow"
          } else if (action === "accepted"){
            color = "green"
          } else if (action === "rejected") {
            color = "red"
          }
          console.log((model.getTotalAmount()/totalAmountExDeposit));
          var marginLeft = (model.get("includesDeposit")) ? 0 - iconSize/2: barWidth * (model.getTotalAmount()/totalAmountExDeposit) - iconSize;

          payments.push({color: color, id: model.id, margin_left: marginLeft});
        });

        this.$el.html(this.template({
          payments: payments,
          percentComplete: percentComplete
        }));

        return this;

      },    
      hoverPayment: function(event){
        var id = $(event.target).data("paymentid");
        if (id) {
          var list = '';
          var history = this.model.get("statusHistory").filterByPaymentID(id);
          history.each(function(model){
            var action = model.get("action");
            list +='<li>'+action.charAt(0).toUpperCase() + action.slice(1) + " on " + model.get("date").format('MMM DD, YYYY')+'</li>';
          })
          if (history.length === 0) {list = 'No actions taken yet'}
            $(event.target).html('<div class="tooltip" style="position: absolute;"><ul>'+list+'</ul></div>');
        }
      },
      unhoverPayment: function(event){
        $(event.target).empty();
        $(event.target).remove('div');
      }

    });

return ProgressBarView;

}
);