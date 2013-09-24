/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone', 'collections/agreements', 'views/create_agreement/proposal_view', 'moment'],

  function (Backbone, AgreementCollection, view, moment) {

    'use strict';

    var HomeRouter = Backbone.Router.extend({

      routes: {
        '': 'AllAgreements',
        'Freelancer': 'FreelancerAgreements',
        'Client': 'ClientAgreements',
      },

      initialize: function () {
        this.collection = new AgreementCollection(window.agreements);
        this.collection.each(function(agreement){
          agreement.updateCompleteHistory();
        })
        this.collection.at(0).get("completeHistory").add({date:moment()});
        console.log(this.collection);
      },

      AllAgreements: function () {

      },

      FreelancerAgreements: function () {

      },
      ClientAgreements: function () {

      }

    });

    return HomeRouter;

  }
  );