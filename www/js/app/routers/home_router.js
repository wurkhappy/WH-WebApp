/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'flying-focus', 'collections/agreements', 'collections/users', 'collections/payments', 'models/user', 'views/home/home_section_view', 'moment'],

  function (Backbone, FlyingFocus, AgreementCollection, UserCollection, PaymentCollection, UserModel, SectionView, moment) {

    'use strict';

    var HomeRouter = Backbone.Router.extend({

      routes: {
        '': 'AllAgreements',
        'Freelancer': 'FreelancerAgreements',
        'Client': 'ClientAgreements',
      },

      initialize: function () {
        this.collection = new AgreementCollection(window.agreements);
        this.otherUsers = new UserCollection(window.otherUsers);
        this.payments = new PaymentCollection(window.payments);
        this.currentUser = new UserModel(window.currentUser);
        FlyingFocus();
      },

      AllAgreements: function () {
        //need to to views
        //same view with different title and different models
        var sortedAgreements = this.collection.sortByStatus();

        //var paymentProgress = this.collection.paymentProgress();

        if (sortedAgreements.waitingOnRespAgrmnts.length > 0) {
          var waitingView = new SectionView({
            title: 'Waiting for Response', 
            collection: sortedAgreements.waitingOnRespAgrmnts,
            otherUsers: this.otherUsers, 
            currentUser: this.currentUser, 
            el:'#waitingSection'
          });
        }
        if (sortedAgreements.inProgressAgrmnts.length > 0) {
          var progressView = new SectionView({
            title:"In Progress", 
            collection: sortedAgreements.inProgressAgrmnts,
            otherUsers: this.otherUsers,
            currentUser: this.currentUser, 
            el:'#progressSection'
          });
        }
        if (sortedAgreements.draftAgrmnts.length > 0) {
          var draftView = new SectionView({
            title:"Drafts", 
            collection: sortedAgreements.draftAgrmnts, 
            otherUsers: this.otherUsers,
            currentUser: this.currentUser, 
            el:'#draftSection'
          });
        }
      },

      FreelancerAgreements: function () {

      },
      ClientAgreements: function () {

      }

    });

return HomeRouter;

}
);