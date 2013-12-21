/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/layout_tpl', 'views/agreement/read/modals/void_agreement', 'views/ui-modules/modal'],

  function (Backbone, Handlebars, _, Marionette, layoutTpl, VoidModal, Modal) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      el:'#content',
      template: layoutTpl,

      regions: {
        profile: "#agreement-profile",
        agreementProgressBar: "#agreement-progress-bar",
        paymentMethods: "#payment-methods",
        paymentSchedule: "#payment-schedule",
        agreementHistory: "#agreement-history",
        header: "#header-section",
        discussion: "#discussion"
      },
      events:{
        "click #voidAgreement":"voidAgreement"
      },

      initialize: function(options){
        this.user = options.user;
        this.render();
      },

      voidAgreement: function(event){
        event.preventDefault();
        event.stopPropagation();
        if (!this.voidModal){
          var view = new VoidModal({
            model:this.model,
            user: this.user,
          });
          this.voidModal = new Modal({view:view});
        } 
        this.voidModal.show();
      }
    });

return Layout;

}
);