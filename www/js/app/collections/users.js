/*
 * Collection.
 */

define(['backbone', 'models/user'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            model: Model,

        });

        return Collection;

    }

);