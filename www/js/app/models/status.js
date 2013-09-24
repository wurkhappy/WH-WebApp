define(['backbone','backbone-relational', 'moment'],

    function(Backbone, Relational, moment) {

        'use strict';

        var Status = Backbone.RelationalModel.extend({
            set: function( key, value, options ) {
                Backbone.RelationalModel.prototype.set.apply( this, arguments );

                if (typeof key === 'object') {
                    if (_.has(key, "date")) {
                        console.log(key);
                        this.attributes.date = moment(key["date"]);
                    }
                } else if (key === 'date'){
                    this.attributes.date = moment(value);
                }
            }
        });

        return Status;

    }

    );