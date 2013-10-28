define(['backbone','backbone-relational', 'moment'],

    function(Backbone, Relational, moment) {

        'use strict';

        var Status = Backbone.RelationalModel.extend({
            StatusCreated:"created",
            StatusSubmitted:"submitted",
            StatusAccepted:"accepted",
            StatusRejected:"rejected",

            set: function( key, value, options ) {
                Backbone.RelationalModel.prototype.set.apply( this, arguments );

                if (typeof key === 'object') {
                    if (_.has(key, "date")) {
                        this.attributes.date = moment(key["date"]);
                    }
                } else if (key === 'date'){
                    this.attributes.date = moment(value);
                }
            },
            url:function(){
                if(this.get("paymentID")){
                    return "/agreement/v/"+this.get("agreementID")+"/payment/"+this.get("paymentID")+"/status";
                }
                return "/agreement/v/"+this.get("agreementID")+"/status";
            }


        });

return Status;

}

);