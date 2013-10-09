/*
 * Collection.
 */

define(['backbone', 'models/item'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            model: Model,


        });

        return Collection;

    }

);