/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'flying-focus', 'toastr', 'collections/agreements', 'collections/users', 'models/user', 'views/sample_home/home_section_view', 'moment', 'views/ui-modules/modal', 'views/sample_home/welcome', 'views/sample_home/introduction_progress_view','views/sample_home/signup'],

    function(Backbone, FlyingFocus, toastr, AgreementCollection, UserCollection, UserModel, SectionView, moment, Modal, WelcomeModal, IntroductionProgressView, SignupModal) {

        'use strict';

        var HomeRouter = Backbone.Router.extend({

            routes: {
                '': 'AllAgreements',
                'Freelancer': 'FreelancerAgreements',
                'Client': 'ClientAgreements',
            },

            initialize: function() {
                this.collection = new AgreementCollection(window.agreements);
                this.otherUsers = new UserCollection(window.otherUsers);
                this.currentUser = new UserModel(window.currentUser);
                this.numberOfTimesVisited = window.numberOfTimesVisited;
                FlyingFocus();
                if (window.production) {
                    $("#create_agreement").click(function(event) {
                        analytics.track('Potential Client Create Agreement');
                    });
                }
                $('a:not(.clickable)').click( function(event) {
                    event.preventDefault();
                    toastr.error('Please create an account for full access');
                });                
            },

            AllAgreements: function() {
                //need to views
                //same view with different title and different models
                var sortedAgreements = this.collection.sortByStatus();

                if (sortedAgreements.waitingOnRespAgrmnts.length > 0) {
                    var waitingView = new SectionView({
                        title: 'Waiting for Response',
                        collection: sortedAgreements.waitingOnRespAgrmnts,
                        otherUsers: this.otherUsers,
                        currentUser: this.currentUser,
                        el: '#waitingSection'
                    });
                }
                if (sortedAgreements.inProgressAgrmnts.length > 0) {
                    var progressView = new SectionView({
                        title: "In Progress",
                        collection: sortedAgreements.inProgressAgrmnts,
                        otherUsers: this.otherUsers,
                        currentUser: this.currentUser,
                        el: '#progressSection'
                    });
                }
                if (sortedAgreements.draftAgrmnts.length > 0) {
                    var draftView = new SectionView({
                        title: "Drafts",
                        collection: sortedAgreements.draftAgrmnts,
                        otherUsers: this.otherUsers,
                        currentUser: this.currentUser,
                        el: '#draftSection'
                    });
                }

                //Display a modal when the page loads
                if (this.numberOfTimesVisited < 3) {
                    var view = new WelcomeModal();
                    this.modal = new Modal({
                        view: view
                    });
                    this.modal.show();
                } else {
                    var view = new SignupModal();
                    this.modal = new Modal({
                        view: view
                    });
                    this.modal.show();
                }
                

                // The progress bar boom!
                new IntroductionProgressView({
                    el: '#introduction_progress_container'
                }).render();

            },

            FreelancerAgreements: function() {

            },
            ClientAgreements: function() {

            }

        });

        return HomeRouter;

    }
);