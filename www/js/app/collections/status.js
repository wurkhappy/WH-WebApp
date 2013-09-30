/*
 * Collection.
 */

define(['backbone', 'models/status'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            model: Model,
            comparator:function(item){
            	return -item.get("date").valueOf();
            }

        });

        return Collection;

    }

);