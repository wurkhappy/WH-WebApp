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
        this.payments = options.model.get("payments");
        this.listenTo(this.payments, "change", this.render);
      },
      events:{
        "mouseover .progress_icon":"hoverPayment",
        "mouseleave .progress_icon":"unhoverPayment",
      },

      render: function () {
        var payments = this.payments,
        submittedPayments = payments.getNumberOfSubmittedPayments(),
        acceptedPayments = payments.getAcceptedPayments(),
        acceptedOrSubmittedPayments = submittedPayments + acceptedPayments,
        totalPayments = this.payments.length;

        var percentComplete = this.calculatePercentage(totalPayments, acceptedOrSubmittedPayments);

        this.$el.html(this.template({
          payments: this.payments.toJSON(),
          percentComplete: percentComplete
        }));

        this.afterRender();

        return this;

      },

      afterRender: function () {
        var iconSize = 30;
        var payments = this.payments,
        numberPayments = payments.length;
        var ghostIcons = (numberPayments%2 == 0) ? 3 : 2;
        var totalIconWidth=(numberPayments + ghostIcons-1)*iconSize; //30px is size of each icon
        _.defer( function () {
          var barWidth = 900 - totalIconWidth, //so that there are 100px margins on each side.
          progressIcon = $(".progress_icon"),
          iconSpacing = barWidth/(numberPayments + ghostIcons -1);
          $(".progress_icon").css({"margin-left": iconSpacing/2 + "px", "margin-right": iconSpacing/2 + "px"});
          $(".progress_icon").first().css("margin-left", -(iconSize/2) + "px");
          $(".progress_icon").last().css("margin-right", 0 + "px");

          //place a gradient stop based on the percentage of accepted payments:
          $("progress").addClass("yellow_progress");

        });
      },      

      calculatePercentage: function (totalPayments, acceptedOrSubmittedPayments) {
        var barWidth = 100,
        ghostIcons = (totalPayments%2 == 0) ? 3 : 2,
        numberPayments = (totalPayments + ghostIcons)-1;

        if (acceptedOrSubmittedPayments < 1){
          return 0;
        } else if (acceptedOrSubmittedPayments === totalPayments) {
          return 100;
        } else {
          return (barWidth/numberPayments*(acceptedOrSubmittedPayments));
        }

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