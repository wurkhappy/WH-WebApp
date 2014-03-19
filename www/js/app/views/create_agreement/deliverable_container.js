/* 
 * Scope of Work - Create Agreement View.
 */

define(['backbone', 'handlebars', 'underscore', 'kalendae', 'autonumeric', 'hbs!templates/create_agreement/services_preview_tpl',
        'views/create_agreement/tasks_view', 'views/create_agreement/deliverable_preview'
    ],

    function(Backbone, Handlebars, _, Kalendae, autoNumeric, Tpl, TasksView, DeliverablePreview) {

        'use strict';

        var DeliverableContainer = Backbone.Marionette.CompositeView.extend({

            tagName: 'div',
            template: Tpl,
            itemView: DeliverablePreview,
            itemViewOptions: {
                some: "option",
                goes: "here"
            },

            initialize: function(options) {
                console.log(options);
                //this.collection = this.model.get("scopeItems");
                console.log('Initializing container view');
                //this.listenTo(this.collection, 'change', this.render);
            }

        });

        return DeliverableContainer;

    }
);