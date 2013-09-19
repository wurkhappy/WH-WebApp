define(['backbone','backbone-relational', 'models/scope_item', 'collections/scope_items'],

    function(Backbone, Relational, ScopeItemModel, ScopeItemCollection) {

        'use strict';

        var Payment = Backbone.RelationalModel.extend({
        	relations: [{
                type: Backbone.HasMany,
                key: 'scopeItems',
                relatedModel: ScopeItemModel,
                collectionType: ScopeItemCollection,
            }],
        });

        return Payment;

    }

    );