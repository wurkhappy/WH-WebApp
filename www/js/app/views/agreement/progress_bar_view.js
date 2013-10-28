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

    var ProgressBarView = Backbone.View.extend({

      template: Handlebars.compile(progressBarTemplate),

      initialize:function(options){
        console.log("during initialize");
        this.payments = options.model.get("payments");
        this.percentageComplete = this.payments.getPercentComplete() * 100;
      },

      render: function () {
        var payments = this.payments;
        var submittedPayments = payments.getNumberOfSubmittedPayments();
        var totalPayments = this.payments.length;
        console.log("payments");
        console.log(this.payments.toJSON());

        //var percentComplete = payments.getPercentComplete() * 100;

        var percentComplete = this.calculatePercentage(totalPayments, submittedPayments);
        console.log("percent Complete");
        console.log(percentComplete); 

        this.$el.html(this.template({
          payments: this.payments.toJSON(),
          percentComplete: percentComplete
        }));

        this.afterRender();

        return this;

      },

      afterRender: function () {
        console.log("after render");
        var payments = this.payments,
            numberPayments = payments.length -1,
            totalIconWidth=(numberPayments)*30; //30px is size of each icon

        _.defer( function () {
          var barWidth = 700 - totalIconWidth, //so that there are 100px margins on each side.
              progressIcon = $(".progress_icon"),
              iconSpacing = barWidth/numberPayments,
              firstIconSpacing = 87; //100px margin - 13px (halfway through icon)
          $(".progress_icon").css("margin-left", iconSpacing + "px");
          $(".progress_icon").first().css("margin-left", firstIconSpacing + "px");
          console.log("adding the gradient to the progress bar");

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