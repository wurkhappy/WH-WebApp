define(['backbone', 'handlebars', 'hbs!templates/account/verification'],

  function (Backbone, Handlebars, verificationTemplate) {

    'use strict';

    var VerificationModal = Backbone.View.extend({

      template: verificationTemplate,
      events: {
        "click #verify-button":"verify",
        "blur input":"updateAmounts"
      },
      initialize: function () {
        this.amounts = {};
        this.render();
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },
      updateAmounts: function(event){
        this.amounts[event.target.name] = parseFloat(event.target.value);
      },
      verify: function(event){
        event.preventDefault();
        event.stopPropagation();
        var callback = _.bind(function(response){
          console.log("callback")
          this.trigger('hide');
        },this)
        this.model.verify(this.amounts, callback);
      }

    });

    return VerificationModal;

  }
  );