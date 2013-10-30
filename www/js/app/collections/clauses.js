/*
 * Collection.
 */

 define(['backbone', 'models/clause'],

    function(Backbone, Model) {

        'use strict';

        var Collection = Backbone.Collection.extend({

            model: Model,

        });

        return Collection;

    }

    );