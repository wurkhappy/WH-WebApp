define(['backbone','backbone-relational'],

    function(Backbone, Relational) {

        'use strict';

        var Comment = Backbone.RelationalModel.extend({
        	url:"/agreement/comment"
        });

        return Comment;

    }

    );