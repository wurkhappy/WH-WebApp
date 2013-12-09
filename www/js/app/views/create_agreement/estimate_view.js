/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/create_agreement/estimate_tpl.html', 'views/create_agreement/milestone_view'],

  function (Backbone, Handlebars, _, Marionette, estimateTemplate, MilestoneView) {

    'use strict';

    var EstimateView = Backbone.Marionette.CompositeView.extend({

      className:'clear white_background',
      attributes:{'id':'content'},

      template: Handlebars.compile(estimateTemplate),

      itemView: MilestoneView,

      initialize: function (options) {
        this.router = options.router;
        this.deposit = this.collection.findFirstRequiredPayment()
      },

      events:{
        "click #addMoreButton" : "addMilestone",
        "click .submit-buttons > a" : "saveAndContinue",
        "mouseenter .create_agreement_navigation_link": "mouseEnterNavigation",
        "mouseleave .create_agreement_navigation_link": "mouseLeaveNavigation",
        "click .create_agreement_navigation_link": "showPage",
        "blur #deposit":"updateDeposit"
      },
      renderModel: function(){
        var data = {};
        if(this.deposit) data = this.deposit.toJSON();
        data = this.mixinTemplateHelpers(data);

        var template = this.getTemplate();
        return Marionette.Renderer.render(template, data);
      },
      appendHtml: function(collectionView, itemView, index){
        if (itemView.model.get("title") === 'Deposit') {return;}
        itemView.$el.insertBefore(collectionView.$('#addMoreButton'));
      },

      addMilestone:function(event){
        event.preventDefault();
        this.collection.add({});
      },
      
      saveAndContinue:function(event){
        event.preventDefault();
        event.stopPropagation();

        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = 'review';
          }, this)
        });
      },

      showPage: function(event) {
        event.preventDefault();
        event.stopPropagation();

        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");

        var destination = $(event.currentTarget).attr('href');

        this.model.save({},{
          success:_.bind(function(model, response){
            window.location.hash = destination;
          }, this)
        });
      },

      mouseEnterNavigation: function (event) {
        $(event.currentTarget).find("h2").addClass("create_agreement_navigation_link_hover");
      },

      mouseLeaveNavigation: function (event) {
        $(event.currentTarget).find("h2").removeClass("create_agreement_navigation_link_hover");
      },
      updateDeposit: function(event){
        console.log(this.model);
        var amount = event.target.value;
        var adjAmount = (amount.substring(0,2) === '$ ') ? amount.substring(2) : amount;
        var formattedAmount = parseFloat(adjAmount.replace(/,/g, ''), 10);
        if (this.deposit){
          this.deposit.set("amount", formattedAmount);

        } else{
          var Model = this.model.get("payments").model;
          this.deposit = new Model({title: "Deposit", amount: formattedAmount, required: true});
          this.model.get("payments").add(this.deposit);
        }

        if (adjAmount == 0) {
          this.model.get("payments").remove(this.deposit);
        }
      }

    });

return EstimateView;

}
); 
