define(['backbone','backbone-relational', 'models/scope_item', 'collections/scope_items', 'models/status', 'collections/status'],

    function(Backbone, Relational, ScopeItemModel, ScopeItemCollection, StatusModel, StatusCollection) {

        'use strict';

        var Payment = Backbone.RelationalModel.extend({
        	relations: [{
                type: Backbone.HasMany,
                key: 'scopeItems',
                relatedModel: ScopeItemModel,
                collectionType: ScopeItemCollection,
            },
            {
                type: Backbone.HasMany,
                key: 'statusHistory',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }
            ],
        });

        return Payment;

    }

    );