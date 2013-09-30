define(['backbone','backbone-relational', 'models/payment', 'collections/payments', 'models/status', 'collections/status'],

    function(Backbone, Relational, PaymentModel, PaymentCollection, StatusModel, StatusCollection) {

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
            }
            ],
            urlRoot:function(){
                return "/agreement";
            },
            submit: function(){
                this.updateStatus("submitted");
            },
            accept: function(){
                this.updateStatus("accepted");
            },
            reject: function(){
                this.updateStatus("rejected");
            },
            updateStatus:function(action){
                $.ajax({
                  type: "POST",
                  url: "/agreement/"+this.id+"/status?action="+action,
                  contentType: "application/json",
                  dataType: "json",
                  success: _.bind(function(response){
                    this.get("statusHistory").add(response);
                }, this)
              });
            }
        });

return Agreement;

}

);