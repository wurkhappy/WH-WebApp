/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

define(['backbone', 'flying-focus', 'toastr', 'collections/agreements', 'collections/users', 'models/user',
        'views/home/home_section_view', 'moment', 'collections/tasks'
    ],

    function(Backbone, FlyingFocus, toastr, AgreementCollection, UserCollection, UserModel, SectionView, moment, TaskCollection) {

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
                this.sortedTasks = _.groupBy(window.tasks, "versionID");
                for (var key in this.sortedTasks) {
                    this.sortedTasks[key] = new TaskCollection(this.sortedTasks[key]);
                }
                FlyingFocus();
                if (window.production) {
                    $("#create_agreement").click(function(event) {
                        analytics.track('Clicked Create Agreement');
                    });
                }
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
                        tasks: this.sortedTasks,
                        el: '#waitingSection'
                    });
                }
                if (sortedAgreements.inProgressAgrmnts.length > 0) {
                    var progressView = new SectionView({
                        title: "In Progress",
                        collection: sortedAgreements.inProgressAgrmnts,
                        otherUsers: this.otherUsers,
                        currentUser: this.currentUser,
                        tasks: this.sortedTasks,
                        el: '#progressSection'
                    });
                }
                if (sortedAgreements.draftAgrmnts.length > 0) {
                    var draftView = new SectionView({
                        title: "Drafts",
                        collection: sortedAgreements.draftAgrmnts,
                        otherUsers: this.otherUsers,
                        currentUser: this.currentUser,
                        tasks: this.sortedTasks,
                        el: '#draftSection'
                    });
                }
            },

            FreelancerAgreements: function() {

            },
            ClientAgreements: function() {

            }

        });

        return HomeRouter;

    }
);