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

      initialize: function (options) {
        this.render();
        this.card = {"expiration_month":1, "expiration_year":2013};
        this.user = options.user;
        console.log(this.user);
      },

      render: function () {
        this.$el.html(this.template());
        return this;
      },
      updateFields:function(event){
        this.card[event.target.name] = event.target.value;
        $(".notification_container").fadeOut("slow");
      },
      saveCard:function(event){
        var that = this;
        balanced.card.create(this.card, function (response) {
          if(response.status === 201) {
            delete response.data.id;
            console.log(response);
            var model = new that.user.attributes["cards"].model(response.data);
            console.log(_.clone(model));
            that.user.get("cards").add(model);
            console.log(that.user.get("cards"));
            model.save();
            $('input').val('');
            $(".notification_container").fadeOut('fast').fadeIn("slow");

          } else {
            console.log(response);
          }
        });
      }

    });

return NewCardView;

}
);