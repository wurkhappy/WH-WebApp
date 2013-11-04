/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'models/agreement', 'views/create_agreement/proposal_view', 'views/create_agreement/main_container_view',
  'views/create_agreement/estimate_view', 'views/create_agreement/recipient_view', 'models/user', 'views/create_agreement/layout'],

  function (Backbone, AgreementModel, ProposalView, MainContainerView, EstimateView, RecipientView, UserModel, Layout) {

    'use strict';

    var CreateAgreementRouter = Backbone.Router.extend({

      routes: {
        '': 'proposal',
        'proposal': 'proposal',
        'estimate': 'estimate',
        'review': 'review',
        'edit':'edit'
      },

      initialize: function () {
        this.user = new UserModel(window.user);
        this.model = new AgreementModel({freelancerID:this.user.id});
        this.model.get("payments").add({title:"Deposit"});
        this.mainContainer = new MainContainerView({model: this.model});
        this.layout = new Layout({model: this.model});
      },
      proposal: function () {
        this.layout.switchToProposal();
      },
      estimate: function () {
        this.layout.switchToEstimate();
      },
      review: function () {
        this.layout.switchToReview();
      },
      edit: function(){
        this.layout.switchToEdit();
      }

    });

    return CreateAgreementRouter;

  }
  );
