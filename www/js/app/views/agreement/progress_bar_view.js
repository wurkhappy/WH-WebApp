/*
 * Agreement - Create Progress Bar View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/agreement/agreement_progress_bar_tpl.html'],

  function (Backbone, Handlebars, _, Marionette, progressBarTemplate) {

    'use strict';

    var ProgressBarView = Backbone.View.extend({

      template: Handlebars.compile(progressBarTemplate),

      initialize:function(options){
        console.log("during initialize");
        this.payments = options.model.get("payments");

        /*this.render = _.wrap(this.render, function(render) {
          render.apply(this);           
          this.afterRender();
        });           
        
        this.render();*/
      },

      render: function () {
        var payments = this.payments;

        var percentComplete = payments.getPercentComplete() * 100;

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
          });
          
      }

    });

    return ProgressBarView;

  }
  );