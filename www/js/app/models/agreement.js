define(['backbone','backbone-relational', 'models/payment', 'collections/payments', 'models/status', 'collections/status'],

    function(Backbone, Relational, PaymentModel, PaymentCollection, StatusModel, StatusCollection) {

        'use strict';

        var Agreement = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'payments',
                relatedModel: PaymentModel,
                collectionType: PaymentCollection,
            },
            {
                type: Backbone.HasMany,
                key: 'statusHistory',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            },
            {
                type: Backbone.HasMany,
                key: 'completeHistory',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }
            ],
            url:function(){
                if (this.id) {return "/agreement/"+this.id;}
                return "/agreement"
            },
            updateCompleteHistory:function(){
                this.get("payments").each(_.bind(function(payment){
                    this.get("completeHistory").add(payment.get("statusHistory").models);
                },this));
                this.get("completeHistory").add(this.get("statusHistory").models);
            }
        });

return Agreement;

}

);