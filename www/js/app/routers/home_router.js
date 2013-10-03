/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'collections/agreements', 'views/home/home_section_view', 'moment'],

  function (Backbone, AgreementCollection, SectionView, moment) {

    'use strict';

    var HomeRouter = Backbone.Router.extend({

      routes: {
        '': 'AllAgreements',
        'Freelancer': 'FreelancerAgreements',
        'Client': 'ClientAgreements',
      },

      initialize: function () {
        this.collection = new AgreementCollection(window.agreements);
        console.log(this.collection);
        
      },

      AllAgreements: function () {
        //need to to views
        //same view with different title and different models
        var sortedAgreements = this.collection.sortByStatus();

        var waitingView = new SectionView({
          title:"Waiting for Response", 
          collection: sortedAgreements.waitingOnRespAgrmnts, 
          el:'#waitingSection'
        });
        var progressView = new SectionView({
          title:"In Progress", 
          collection: sortedAgreements.inProgressAgrmnts, 
          el:'#progressSection'
        });
        var draftView = new SectionView({
          title:"Drafts", 
          collection: sortedAgreements.draftAgrmnts, 
          el:'#draftSection'
        });
      },

      FreelancerAgreements: function () {

      },
      ClientAgreements: function () {

      }

    });

return HomeRouter;

}
);