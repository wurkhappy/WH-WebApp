define(['backbone','backbone-relational', 'models/payment', 'collections/payments'],

    function(Backbone, Relational, PaymentModel, PaymentCollection) {

        'use strict';

        var Agreement = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'payments',
                relatedModel: PaymentModel,
                collectionType: PaymentCollection,
            }],
            url:function(){
                if (this.id) {return "/agreement/"+this.id;}
                return "/agreement"
            }
        });

        return Agreement;

    }

    );