define(['backbone','backbone-relational', 'moment', 'models/comment', 'collections/comments'],

    function(Backbone, Relational, moment, CommentModel, CommentCollection) {

        'use strict';

        var Status = Backbone.RelationalModel.extend({
            StatusCreated:"created",
            StatusSubmitted:"submitted",
            StatusAccepted:"accepted",
            StatusRejected:"rejected",

            relations: [{
                type: Backbone.HasMany,
                key: 'comments',
                relatedModel: CommentModel,
                collectionType: CommentCollection,
            }
            ],
            
            set: function( key, value, options ) {
                Backbone.RelationalModel.prototype.set.apply( this, arguments );

                if (typeof key === 'object') {
                    if (_.has(key, "date")) {
                        this.attributes.date = moment(key["date"]);
                    }
                } else if (key === 'date'){
                    this.attributes.date = moment(value);
                }
            },
            url:function(){
                if(this.get("paymentID")){
                    return "/agreement/"+this.get("agreementID")+"/payment/"+this.get("paymentID")+"/status";
                }
                return "/agreement/"+this.get("agreementID")+"/status";
            }


        });

return Status;

}

);