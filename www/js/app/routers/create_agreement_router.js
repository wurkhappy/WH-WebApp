/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'models/agreement', 'views/create_agreement/proposal_view', 'views/create_agreement/main_container_view',
  'views/create_agreement/estimate_view', 'views/create_agreement/recipient_view', 'models/user'],

  function (Backbone, AgreementModel, ProposalView, MainContainerView, EstimateView, RecipientView, UserModel) {

    'use strict';

    var CreateAgreementRouter = Backbone.Router.extend({

      routes: {
        '': 'proposal',
        'proposal': 'proposal',
        'estimate': 'estimate',
        'recipient': 'recipient',
      },

      initialize: function () {
        this.user = new UserModel(window.user);
        this.model = new AgreementModel({freelancerID:this.user.id});
        this.model.get("payments").add({title:"Deposit"});
        this.mainContainer = new MainContainerView({model: this.model});
      },

      proposal: function () {
        if (!this.proposalView) this.proposalView = new ProposalView({router:this, model: this.model, userID: this.user.id});
        this.mainContainer.switchToView(this.proposalView);
      },

      estimate: function () {
        if (!this.estimateView) {
          this.estimateView = new EstimateView({router:this, model: this.model, collection:this.model.get("payments")});
        }
        this.estimateView.render();
        this.mainContainer.switchToView(this.estimateView);
      },
      recipient: function () {
        if (!this.recipientView) {
          this.recipientView = new RecipientView({router:this, model: this.model});
        } 
        this.mainContainer.switchToView(this.recipientView);
      }

    });

return CreateAgreementRouter;

}
);
