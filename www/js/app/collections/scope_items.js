/*
 * Collection.
 */

define(['backbone', 'models/scope_item'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,

        });

        return Collection;

    }

);