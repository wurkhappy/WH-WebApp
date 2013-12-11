define(['backbone', 'handlebars', 'hbs!templates/create_agreement/edit_tpl', 'views/agreement/edit/payments_edit_view'],

  function (Backbone, Handlebars, tpl, PaymentsView) {

    'use strict';

    var EditView = Backbone.View.extend({
      template: tpl,
      className:'clear white_background',
      events:{
        "click #saveAgreement": "saveAgreement",
        "blur input, textarea": "updateFields"
      },
      initialize:function(){
        this.render();
        this.originalModel = this.model;
        this.model = _.clone(this.model);
      },
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        var paymentsView = new PaymentsView({model: this.model});
        paymentsView.render();
        this.$('#payments-section').html(paymentsView.$el);
        return this;
      },
      saveAgreement: function(event){
        event.preventDefault();
        event.stopPropagation();

        this.originalModel.set(this.model.toJSON());
        this.model = this.originalModel;
        this.model.save({},{success:function(model, response){
          window.location.hash = 'review';
        }});
      },
      updateFields: function(){
        if (event.target.name === 'dateExpected') { return};
        this.model.set(event.target.name, event.target.value);
        
      }

    });

return EditView;

}
);