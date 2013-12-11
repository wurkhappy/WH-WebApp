/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'flying-focus', 'models/agreement', 'views/agreement/layout_manager',
  'views/agreement/payments_read_view', 'views/agreement/user_view',
  'views/agreement/edit/user_edit_view', 'views/agreement/edit/header_edit_view', 'views/agreement/edit/payments_edit_view',
  'views/agreement/read/header_view', 'views/agreement/communication/communication_layout', 'views/agreement/payment_methods_view', 'models/user', 'views/agreement/progress_bar_view',
  'collections/tags'],

  function (Backbone, FlyingFocus, AgreementModel, LayoutView, PaymentsReadView, UserView,
    UserEditView, HeaderEditView, PaymentEditView, HeaderView, CommunicationLayout, PaymentMethodsView, UserModel, ProgressBarView, TagCollection) { 

    'use strict';

    var AgreementRouter = Backbone.Router.extend({

      routes: {
        '': 'readAgreement',
        'edit': 'editAgreement'
      },

      initialize: function () {
        this.model = new AgreementModel(window.agreement);
        this.model.set("comments", window.comments);
        this.user = new UserModel(window.thisUser);
        this.otherUser = new UserModel(window.otherUser);
        this.user.set("cards", window.cards);
        this.user.set("bank_accounts", window.bank_account);
        this.tags = new TagCollection(window.tags);
        this.tags.addMileStoneTags(this.model.get("payments"));
        this.layout = new LayoutView({model: this.model, user: this.user});
        FlyingFocus();
      },

      readAgreement: function () {
        this.layout.agreementProgressBar.show(new ProgressBarView({model: this.model}));
        this.layout.paymentMethods.show(new PaymentMethodsView({model: this.model}));
        this.layout.paymentSchedule.show(new PaymentsReadView({model: this.model}));
        this.layout.profile.show(new UserView());
        this.layout.header.show(new HeaderView({model: this.model, user: this.user, otherUser: this.otherUser}));
        var discussionView = new CommunicationLayout({messages: this.model.get("comments"), user: this.user, otherUser: this.otherUser, tags:this.tags});
        this.listenTo(discussionView, "commentAdded", this.commentAdded);
        this.layout.discussion.show(discussionView);

        if (this.model.sample) this.sample();
      },
      editAgreement :function(){
        this.layout.header.show(new HeaderEditView({model: this.model, user:this.user}));
        this.layout.paymentSchedule.show(new PaymentEditView({model: this.model}));
        this.layout.profile.show(new UserEditView({model: this.model}));
      },
      sample: function(){

      },
      commentAdded: function(comment){
        this.model.get("comments").add(comment);
        comment.collection = this.model.get("comments");
      }

    });

return AgreementRouter;

}
);
