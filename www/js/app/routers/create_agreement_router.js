/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'models/agreement', 'views/create_agreement/proposal_view', 'views/create_agreement/main_container_view',
  'views/create_agreement/estimate_view', 'views/create_agreement/recipient_view'],

  function (Backbone, AgreementModel, ProposalView, MainContainerView, EstimateView, RecipientView) {

    'use strict';

    var CreateAgreementRouter = Backbone.Router.extend({

      routes: {
        '': 'proposal',
        'estimate': 'estimate',
        'recipient': 'recipient',
      },

      initialize: function () {
        this.model = new AgreementModel();
        this.mainContainer = new MainContainerView({model: this.model});
      },

      proposal: function () {
        if (!this.proposalView) this.proposalView = new ProposalView({router:this, model: this.model});
        this.mainContainer.switchToView(this.proposalView);
        console.log(this.proposalView.el);
      },

      estimate: function () {
        if (!this.estimateView) this.estimateView = new EstimateView({router:this, model: this.model});
        this.mainContainer.switchToView(this.estimateView);
      },
      recipient: function () {
        if (!this.recipientView) this.recipientView = new RecipientView({router:this, model: this.model});
        this.mainContainer.switchToView(this.recipientView);
      }

    });

    return CreateAgreementRouter;

  }
  );