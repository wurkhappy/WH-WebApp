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
                type: Backbone.HasOne,
                key: 'currentStatus',
                relatedModel: StatusModel,
                collectionType: StatusCollection,
            }
            ],
            urlRoot:function(){
                return "/agreement/v/"+this.collection.parent.id+"/payment";
            },
            set: function( key, value, options ) {
                Backbone.RelationalModel.prototype.set.apply( this, arguments );

                //amount has to be a float or integer. Backend won't accept number as string.
                if (typeof key === 'object') {
                    if (_.has(key, "amount")) {
                        this.attributes.amount = parseFloat(key["amount"]);
                    }
                    if (_.has(key, "dateExpected")) {
                        this.attributes.dateExpected = moment(key["dateExpected"]);
                    }
                } else if (key === 'amount'){
                    this.attributes.amount = parseFloat(value);
                } else if (key === 'dateExpected'){
                    this.attributes.dateExpected = moment(value);
                }
                return this;
            },
            submit: function(creditSource, successCallback){
                this.updateStatus({"action":"submitted", "creditSourceURI":creditSource, "userID":this.collection.parent.userID}, successCallback);
            },
            accept: function(debitSource, paymentType){
                this.updateStatus({"action":"accepted", "debitSourceURI": debitSource, "paymentType": paymentType, "userID":this.collection.parent.userID});
            },
            reject: function(message){
                this.updateStatus({"action":"rejected", "message":message, "userID":this.collection.parent.userID});
            },
            updateStatus:function(reqData, successCallback){
                $.ajax({
                  type: "POST",
                  url: "/agreement/v/"+this.collection.parent.id+"/payment/"+this.id+"/status",
                  contentType: "application/json",
                  dataType: "json",
                  data:JSON.stringify(reqData),
                  success: _.bind(function(response){
                    this.collection.parent.set("currentStatus",response);
                    this.set("currentStatus",this.collection.parent.get("currentStatus"));
                    successCallback();
                }, this)
              });
            },
            isDeposit: function() {
                if (this.get("title") === "Deposit") {
                  return true
                }
            }
        });

return Payment;

}

);