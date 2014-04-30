define(['backbone', 'handlebars', 'underscore', 'marionette',
        'hbs!templates/agreement/edit/work_item_edit_tpl', 'views/create_agreement/services/work_item_view',
        'views/agreement/work_item_view'
    ],

    function(Backbone, Handlebars, _, Marionette, workItemEditTemplate, WorkItemView, WorkItemPaidView) {

        'use strict';

        var WorkItemEditView = Backbone.Marionette.CompositeView.extend({

            template: workItemEditTemplate,

            itemView: WorkItemView,
            itemViewContainer: 'ul',

            initialize: function() {},
            events: {
                "click #addMoreButton": "addMilestone"
            },
            getItemView: function(item) {
                if (item.isPaid()) return WorkItemPaidView;
                return WorkItemView;
            },

            addMilestone: function(event) {
                event.preventDefault();
                event.stopPropagation();

                this.collection.add({});
            },

        });

        return WorkItemEditView;

    }
);