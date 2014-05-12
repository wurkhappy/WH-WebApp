/*
 * Scope of Work - Create Agreement View.
 */

define(['backbone', 'handlebars', 'underscore', 'marionette',
        'hbs!templates/home/section_tpl', 'views/home/agreement_view'
    ],

    function(Backbone, Handlebars, _, Marionette, sectionTemplate, AgreementView) {

        'use strict';

        var SectionView = Backbone.Marionette.CompositeView.extend({

            template: sectionTemplate,

            itemView: AgreementView,
            itemViewContainer: 'table',
            itemViewOptions: function() {
                return {
                    otherUsers: this.otherUsers,
                    currentUser: this.currentUser,
                    tasks: this.tasks
                }
            },
            initialize: function(options) {
                this.title = options.title;
                this.otherUsers = options.otherUsers;
                this.currentUser = options.currentUser;
                this.tasks = options.tasks;
                this.render();
            },
            onRender: function() {
                this.$('h2').text(this.title);
            },
            events: {
                "click a": "isEmailVerified"
            }

        });

        return SectionView;

    }
);