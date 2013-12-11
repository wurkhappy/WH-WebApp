/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'views/create_agreement/header_cancel', 'views/create_agreement/header_review',
  'views/create_agreement/proposal_view', 'views/create_agreement/progress_bar_view',
  'views/create_agreement/estimate_view', 'views/create_agreement/review_view', 'views/create_agreement/edit_view', 'views/create_agreement/send_view'],

  function (Backbone, Handlebars, _, Marionette, HeaderCancel, HeaderReview, ProposalView, ProgressBar,
    EstimateView, ReviewView, EditView, SendView) {

    'use strict';

    var Layout = Backbone.Marionette.Layout.extend({
      el:'#mainContainer',

      regions: {
        header: "#header-section",
        progress: "#progress-section",
        main: "#main-section",
      },

      initialize: function(options) {
        this.user = options.user;
        this.otherUser = options.otherUser;
      },
      switchToProposal: function(){
        this.header.show(new HeaderCancel({model: this.model}));
        this.progress.show(new ProgressBar({title: "Agreement Overview", value: 0}));
        this.main.show(new ProposalView({model: this.model}));
      },
      switchToEstimate: function(){
        this.header.show(new HeaderCancel({model: this.model}));
        this.progress.show(new ProgressBar({title: "Payment Schedule", value: 1}));
        this.main.show(new EstimateView({
          model: this.model,
          collection: this.model.get("payments"),
          acceptsCreditCard: this.model.get("acceptsCreditCard"),
          acceptsBankTransfer: this.model.get("acceptsBankTransfer")
        }));
      },
      switchToReview:function(){
        this.header.show(new HeaderCancel({model: this.model}));
        this.progress.show(new ProgressBar({title: "Agreement Review", value: 2}));
        this.main.show(new ReviewView({model: this.model}));
      },
      switchToEdit: function(){
        this.header.show(new HeaderCancel({model: this.model}));
        this.progress.show(new ProgressBar({title: "Agreement Review", value: 2}));
        this.main.show(new EditView({model: this.model}));
      },
      switchToSend: function(){
        this.header.show(new HeaderCancel({model: this.model}));
        this.progress.show(new ProgressBar({title: "Agreement Review", value: 3}));
        this.main.show(new SendView({model: this.model, user: this.user, otherUser: this.otherUser}));
      }
    });

    return Layout;

  }
  );