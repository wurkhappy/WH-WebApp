/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'collections/agreements', 'collections/users', 'collections/payments', 'models/user', 'views/home/home_section_view', 'moment'],

  function (Backbone, AgreementCollection, UserCollection, PaymentCollection, UserModel, SectionView, moment) {

    'use strict';

    var ArchivesRouter = Backbone.Router.extend({

      routes: {
        '': 'AllAgreements',
      },

      initialize: function () {
        this.collection = new AgreementCollection(window.agreements);
        this.otherUsers = new UserCollection(window.otherUsers);
        this.currentUser = new UserModel(window.currentUser);
        this.freelancerAgreements = this.collection.findFreelancerAgreements(this.currentUser.id);
        this.clientAgreements = this.collection.findClientAgreements(this.currentUser.id);
      },

      AllAgreements: function () {

        //var paymentProgress = this.collection.paymentProgress();

        if (this.freelancerAgreements.length > 0) {
          var waitingView = new SectionView({
            title: 'Freelancer Agreements', 
            collection: this.freelancerAgreements,
            otherUsers: this.otherUsers, 
            currentUser: this.currentUser, 
            el:'#freelancerSection'
          });
        }
        if (this.clientAgreements.length > 0) {
          var progressView = new SectionView({
            title:"Client Agreements", 
            collection: this.clientAgreements,
            otherUsers: this.otherUsers,
            currentUser: this.currentUser, 
            el:'#clientSection'
          });
        }
      }

    });

return ArchivesRouter;

}
);