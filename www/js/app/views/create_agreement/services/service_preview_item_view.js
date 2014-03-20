/* 
 * Service Preview Item View - in Create Agreement.
 * A unit of work, previewed in the agreement.
 * Item View, listens.
 */

define(['backbone', 'handlebars', 'underscore', 'hbs!templates/create_agreement/service_preview_item_tpl'
    ],

    function(Backbone, Handlebars, _, servicePreviewItemTemplate) {

        'use strict';

        var ServicePreviewView = Backbone.Marionette.ItemView.extend({

            template: servicePreviewItemTemplate,

            initialize: function(options) {
                this.listenTo(this.model.get("scopeItems"), "add", this.render);
                this.listenTo(this.model.get("scopeItems"), "remove", this.render);
                this.listenTo(this.model, "change", this.render);
            }

        });

        return ServicePreviewView;

    }
);