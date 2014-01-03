/*
* Agreements Model.
*/


define(['backbone','backbone-relational', 'models/payment', 'collections/payments',
    'models/status', 'collections/status',  'models/comment', 'collections/comments', 'models/work_item', 'collections/work_items',],

    function(Backbone, Relational, PaymentModel, PaymentCollection, StatusModel, StatusCollection,
        CommentModel, CommentCollection, WorkItemModel, WorkItemCollection) {

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
                key: 'workItems',
                relatedModel: WorkItemModel,
                collectionType: WorkItemCollection,
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
                type: Backbone.HasOne,
                key: 'currentStatus',
                relatedModel: StatusModel,
                reverseRelation: {
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

            idAttribute: "versionID",
            userID: "",
            initialize: function(){
                this.get("workItems").AgreementVersionID = this.id;
            },
            urlRoot:function(){
                return "/agreement/v";
            },
            submit: function(message, successCallback){
                this.updateStatus("submitted", message, successCallback);
            },
            accept: function(message, successCallback){
                this.updateStatus("accepted", message, successCallback);
            },
            reject: function(message, successCallback){
                this.updateStatus("rejected", message, successCallback);
            },
            updateStatus:function(action, message, successCallback){
                $.ajax({
                  type: "POST",
                  url: "/agreement/v/"+this.id+"/status",
                  contentType: "application/json",
                  dataType: "json",
                  data:JSON.stringify({"action":action, "message":message, "userID": this.userID}),
                  success: _.bind(function(response){
                    this.set("currentStatus", response);
                    if (_.isFunction(successCallback)) successCallback();
                }, this)
              });
            },
            archive: function(userID, successCallback){
                $.ajax({
                  type: "POST",
                  url: "/agreement/v/"+this.id+"/archive",
                  contentType: "application/json",
                  dataType: "json",
                  data:JSON.stringify({userID: userID}),
                  success: _.bind(function(response){
                    this.set(response);
                    this.get("currentStatus").trigger("change");
                    if (_.isFunction(successCallback)) successCallback();
                }, this)
              });
            },
            percentComplete: function(){
                var deposit = this.get("workItems").findDeposit();
                var depositAmount = (deposit) ? deposit.get("amount") : 0;
                var totalAmountExDeposit = this.get("workItems").getTotalAmount() - depositAmount;
                return ((this.get("payments").getTotalAmount()- depositAmount)/totalAmountExDeposit) * 100;
            }
        });

return Agreement;

}

);