/*
 * Collection.
 */

define(['backbone', 'models/work_item'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,
            AgreementVersionID: "",

            getTotalAmount:function(){
                return this.reduce(function(memo, value) { return memo + value.get("amount") }, 0);
            },
            findSubmitted:function(){
                var models = this.filter(function(model){
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return models[0];
            },
            findFirstOutstanding:function(){
                var models = this.filter(function(model){
                    return model.get("amount") > model.get("amountPaid");
                });
                return models[0];
            },
            findAllOutstanding:function(){
                var models = this.filter(function(model){
                    return model.get("amount") > model.get("amountPaid");
                });
                return new Collection(models);
            },
            findDeposit:function(){
                var models = this.filter(function(model){
                    return model.get("required");
                });
                if (models.length == 0) return null;
                return models[0];
            },
            getAccepted: function() {
                var models = this.filter(function(model) {

                    if (model.get("currentStatus") !== null) {
                        return model.get("currentStatus").get("action") === 'accepted';
                    } else {
                        return false;
                    }
                });
                return new Collection(models);
            },
            getNumberOfSubmitted: function () {
                var models = this.filter(function(model){
                    return model.get("currentStatus") && model.get("currentStatus").get("action") === 'submitted';
                });
                return models.length;
            },
            getPercentComplete: function() {
                var numberAccepted = this.getAccepted().length;

                if (numberAccepted === 0) {
                    return 0;
                } else {
                    return (numberAccepted/this.length) * 100;
                }
            }

        });

        return Collection;

    }

);