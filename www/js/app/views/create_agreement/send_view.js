define(['backbone', 'handlebars', 'text!templates/create_agreement/send_tpl.html', 'views/agreement/edit/payments_edit_view'],

  function (Backbone, Handlebars, tpl, PaymentsView) {

    'use strict';

    var SendView = Backbone.View.extend({
      template: Handlebars.compile(tpl),
      className:'clear white_background',
      events:{
        "click #sendAgreement": "sendAgreement",
        "blur textarea": "addMessage",
        "blur input": "addRecipient"
      },
      initialize:function(){
        this.render();
      },
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
      },
      sendAgreement: function(event){
        event.preventDefault();
        event.stopPropagation();

        if (!this.model.get("clientID") && !this.model.get("clientEmail")) return;

        var that = this;

        this.model.save({},{success:function(model, response){
          $('.notification_container').fadeIn('fast');

          var changeWindow = function () {
            window.location = "/home";
          };
          var submitSuccess = _.debounce(changeWindow, 800); //delay the change in window until after success notification

          that.model.submit(that.message, submitSuccess);
        }});
      },
      addRecipient: function(event){
        this.model.set("clientEmail", event.target.value);
      },
      addMessage: function(event){
        this.message = event.target.value
      }
    });

return SendView;

}
);