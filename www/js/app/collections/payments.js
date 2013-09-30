/*
 * Collection.
 */

define(['backbone', 'models/payment'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,

            getTotalAmount:function(){
                return this.reduce(function(memo, value) { return memo + value.get("amount") }, 0);
            }

        });

        return Collection;

    }

);