/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'models/agreement', 'views/agreement/layout_manager',
  'views/agreement/payments_read_view', 'views/agreement/agreement_history_view', 'views/agreement/user_view',
  'views/agreement/edit/user_edit_view', 'views/agreement/edit/header_edit_view', 'views/agreement/edit/payments_edit_view',
  'views/agreement/read/header_view', 'views/agreement/discussion_view','models/user', 'views/agreement/clauses_view'],

  function (Backbone, AgreementModel, LayoutView, PaymentsReadView, AgrmntHistoryView, UserView,
    UserEditView, HeaderEditView, PaymentEditView, HeaderView, DiscussionView, UserModel, ClausesView) { 

    'use strict';

    var AgreementRouter = Backbone.Router.extend({

      routes: {
        '': 'readAgreement',
        'edit': 'editAgreement'
      },

      initialize: function () {
        this.model = new AgreementModel(window.agreement);
        this.model.set("comments", window.comments);
        this.layout = new LayoutView({model: this.model});
        this.user = new UserModel(window.thisUser);
      },

      readAgreement: function () {
        this.layout.paymentSchedule.show(new PaymentsReadView({model: this.model}));
        this.layout.agreementHistory.show(new AgrmntHistoryView({model: this.model}));
        this.layout.profile.show(new UserView());
        this.layout.header.show(new HeaderView({model: this.model, user: this.user}));
        this.layout.clauses.show(new ClausesView({model: this.model}));
        this.layout.discussion.show(new DiscussionView({model: this.model, user: this.user}));
      },
      editAgreement :function(){
        this.layout.header.show(new HeaderEditView({model: this.model, user:this.user}));
        this.layout.paymentSchedule.show(new PaymentEditView({model: this.model}));
        this.layout.clauses.show(new ClausesView({model: this.model}));
        this.layout.agreementHistory.show(new AgrmntHistoryView({model: this.model}));
        this.layout.profile.show(new UserEditView({model: this.model}));
        this.layout.discussion.show(new DiscussionView({model: this.model, user: this.user}));
      }

    });

return AgreementRouter;

}
);
