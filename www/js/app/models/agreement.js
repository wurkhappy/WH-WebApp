/*
* Agreements Model.
*/


define(['backbone','backbone-relational', 'backbone-validation', 'models/payment', 'collections/payments',
    'models/status', 'collections/status',  'models/comment', 'collections/comments'],

    function(Backbone, Relational, validation, PaymentModel, PaymentCollection, StatusModel, StatusCollection,
        CommentModel, CommentCollection, ClausesCollection, ClauseModel) {

        'use strict';

        //provide custom callbacks for global backbone-validation
        _.extend(Backbone.Validation.callbacks, {
            valid: function (view, attr, selector) {
                var $el = view.$('[name=' + attr + ']'), 
                    $group = $el.closest('.form-group');
                
                $group.removeClass('has-error');
                $group.find('.error_message').html('').addClass('hide');
            },
            invalid: function (view, attr, error, selector) {
                var $el = view.$('[name=' + attr + ']'), 
                    $group = $el.closest('.form-group');
                
                $group.addClass('has-error');
                $group.find('.error_message').html(error).removeClass('hide');
            }
        });

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

            validation: {
                title: {
                    required: true,
                    msg: 'Please enter an agreement title'
                }
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
                  data:JSON.stringify({"action":action, "message":message, "versionlessID":this.get("versionlessID")}),
                  success: _.bind(function(response){
                    this.set("currentStatus", response);
                    if (_.isFunction(successCallback)) successCallback();
                }, this)
              });
            },
            archive: function(successCallback){
                $.ajax({
                  type: "POST",
                  url: "/agreement/v/"+this.id+"/archive",
                  contentType: "application/json",
                  dataType: "json",
                  data:JSON.stringify({}),
                  success: _.bind(function(response){
                    this.set(response);
                    this.get("currentStatus").trigger("change");
                    if (_.isFunction(successCallback)) successCallback();
                }, this)
              });
            }
        });

return Agreement;

}

);