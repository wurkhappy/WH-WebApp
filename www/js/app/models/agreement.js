define(['backbone','backbone-relational', 'models/payment', 'collections/payments',
    'models/status', 'collections/status',  'models/comment', 'collections/comments'],

    function(Backbone, Relational, PaymentModel, PaymentCollection, StatusModel, StatusCollection,
        CommentModel, CommentCollection) {

        'use strict';

        var Agreement = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'payments',
                relatedModel: PaymentModel,
                collectionType: PaymentCollection,
                reverseRelation: {
                    key: 'parent',
                    includeInJSON: false
                }
            },
            {
                type: Backbone.HasMany,
                key: 'statusHistory',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
                reverseRelation: {
                    key: 'ownerModel',
                    includeInJSON: false
                }
            },
            {
                type: Backbone.HasMany,
                key: 'comments',
                relatedModel: CommentModel,
                collectionType: CommentCollection,
                includeInJSON: false,
                reverseRelation: {
                    key: 'agreement',
                    includeInJSON: false
                }
            }
            ],
            urlRoot:function(){
                return "/agreement";
            },
            submit: function(successCallback){
                this.updateStatus("submitted", successCallback);
            },
            accept: function(successCallback){
                this.updateStatus("accepted", successCallback);
            },
            reject: function(successCallback){
                this.updateStatus("rejected", successCallback);
            },
            updateStatus:function(action, successCallback){
                $.ajax({
                  type: "POST",
                  url: "/agreement/"+this.id+"/status?action="+action,
                  contentType: "application/json",
                  dataType: "json",
                  success: _.bind(function(response){
                    this.get("statusHistory").add(response);
                    if (_.isFunction(successCallback)) successCallback();
                }, this)
              });
            }
        });

return Agreement;

}

);