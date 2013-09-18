define(['backbone'],

    function(Backbone) {

        'use strict';

        var User = Backbone.Model.extend({
            url:function(){
                if (this.id) {return "/user/"+this.id;}
                return "/user"
            }
        });

        return User;

    }

    );