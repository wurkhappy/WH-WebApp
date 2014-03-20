/*
 * Services Preview View - in Create Agreement
 */

define(['backbone', 'handlebars', 'underscore', 'marionette', 'hbs!templates/create_agreement/services_preview_tpl',
        'views/create_agreement/service_preview_item_view'
    ],

    function(Backbone, Handlebars, _, Marionette, servicesPreviewTemplate, ServicePreviewItemView) {

        'use strict';

        var ServicesPreviewView = Backbone.Marionette.CompositeView.extend({

            template: servicesPreviewTemplate,

            itemView: ServicePreviewItemView,

        });

        return ServicesPreviewView;

    }
);