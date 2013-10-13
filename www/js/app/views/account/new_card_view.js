/*
 * Credit Card Account View.
 */

 define(['jquery', 'backbone', 'handlebars', 'text!templates/account/new_card_tpl.html'],

  function ($, Backbone, Handlebars, Template) {

    'use strict';

    var NewCardView = Backbone.View.extend({

      template: Handlebars.compile(Template),
      events:{
        "blur input":"updateFields",
        "click #save-button":"saveCard",
        "change select":"updateFields"
      },

      initialize: function () {
        this.render();
        this.card = {"expiration_month":1, "expiration_year":2013};
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },
      updateFields:function(event){
        this.card[event.target.name] = event.target.value;
        console.log(this.card)
      },
      saveCard:function(event){
        console.log("click")
        var that = this;
        balanced.card.create(this.card, function (response) {
          if(response.status === 201) {
            console.log(that.card);
            $.ajax({
              type: "POST",
              url: "/user/"+that.model.id+"/cards",
              contentType: "application/json",
              dataType: "json",
              data:JSON.stringify(response.data),
              success: _.bind(function(resp){
                console.log(resp);
              }, this)
            });

          } else {
            console.log(response);
                // Failed to tokenize, your error logic here
              }
            });
      }

    });

return NewCardView;

}
);