/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'models/agreement', 'views/create_agreement/proposal_view', 'views/create_agreement/main_container_view', 'views/create_agreement/estimate_view'],

    function (Backbone, AgreementModel, ProposalView, MainContainerView, EstimateView) {

      'use strict';

      var CreateAgreementRouter = Backbone.Router.extend({

        routes: {
          '': 'proposal',
          'estimate': 'estimate',
        },

        initialize: function () {
          this.model = new AgreementModel();
          this.mainContainer = new MainContainerView({model: this.model});
        },

        proposal: function () {
          if (!this.proposalView) this.proposalView = new ProposalView({router:this, model: this.model});
          this.mainContainer.switchToView(this.proposalView);
        },

        estimate: function () {
          if (!this.estimateView) this.estimateView = new estimateView({router:this});
          this.mainContainer.switchToView(this.estimateView);
        },

      });

      return CreateAgreementRouter;

    }
);