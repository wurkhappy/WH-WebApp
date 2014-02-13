define(['backbone', 'backbone-relational'],

    function(Backbone, Relational) {

        'use strict';

        var ScopeItem = Backbone.RelationalModel.extend({
            getWorkItemID: function() {
                return this.collection.getWorkItemID();
            }
        });

        return ScopeItem;

    }

);