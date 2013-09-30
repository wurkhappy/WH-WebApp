/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'models/agreement', 'views/agreement/layout_manager',
  'views/agreement/payments_read_view', 'views/agreement/agreement_history_view', 'views/agreement/user_view'],

  function (Backbone, AgreementModel, LayoutView, PaymentsReadView, AgrmntHistoryView, UserView) {

    'use strict';

    var HomeRouter = Backbone.Router.extend({

      routes: {
        '': 'readAgreement'
      },

      initialize: function () {
        this.model = new AgreementModel(window.agreement);
        this.layout = new LayoutView({model: this.model});
        console.log(this.model);
      },

      readAgreement: function () {
        this.layout.paymentSchedule.show(new PaymentsReadView({model: this.model}));
        this.layout.agreementHistory.show(new AgrmntHistoryView({model: this.model}));
        this.layout.profile.show(new UserView());
      }

    });

return HomeRouter;

}
);