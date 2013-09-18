define(['backbone'],

    function(Backbone) {

        'use strict';

        var Agreement = Backbone.Model.extend({
            url:function(){
                if (this.id) {return "/agreement/"+this.id;}
                return "/agreement"
            }
        });

        return Agreement;

    }

    );