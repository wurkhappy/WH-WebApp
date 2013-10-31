/*
 * Agreement - Create Progress Bar View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/agreement_progress_bar_tpl.html'],

  function (Backbone, Handlebars, _, Marionette, progressBarTemplate) {

    'use strict';

    Handlebars.registerHelper('adjustIconColor', function(action) {
      if ( action === 'submitted') {
        return 'hsl(54, 56%, 56%);'; //yellow color
      } else if (action === 'accepted') {
        return 'hsl(94, 56%, 56%);'; // green color
      } else if (action === 'rejected') {
        return 'hsl(356, 56%, 56%);'; // red color
      }

      return 'hsl(210, 13%, 85%)';
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
        this.percentageComplete = this.payments.getPercentComplete() * 100;
      },

      render: function () {
        var payments = this.payments;
        var submittedPayments = payments.getNumberOfSubmittedPayments();
        var totalPayments = this.payments.length;

        //var percentComplete = payments.getPercentComplete() * 100;

        var percentComplete = this.calculatePercentage(totalPayments, submittedPayments);

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
        console.log(numberPayments + ghostIcons-1);
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

      calculatePercentage: function (totalPayments, submittedPayments) {
        var barWidth = 80, // 10% margins on each side of progress bar icons
            margin = 10, // 10% margin
            numberPayments = totalPayments-1;

            if (submittedPayments < 1){
              return 0;
            } else {
              return (barWidth/numberPayments*(submittedPayments-1)) + margin;
            }

          }

        });

return ProgressBarView;

}
);