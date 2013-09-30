/*
 * Collection.
 */

 define(['backbone', 'models/agreement'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

            // Reference to this collection's model.
            model: Model,

            sortByStatus: function(){
            	var waitingOnRespAgrmnts = new Collection();
            	var inProgressAgrmnts = new Collection();
            	this.each(function(model){
            		var status = model.get("statusHistory").at(0);
            		(status.get("action") === status.StatusSubmitted) ? waitingOnRespAgrmnts.add(model) : inProgressAgrmnts.add(model);
            	});

            	return {
            		waitingOnRespAgrmnts: waitingOnRespAgrmnts,
            		inProgressAgrmnts: inProgressAgrmnts
            	};
            }

        });

 		return Collection;

 	}

 	);