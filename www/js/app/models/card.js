define(['backbone','backbone-relational'],

	function(Backbone, Relational) {

		'use strict';

		var Card = Backbone.RelationalModel.extend({
			urlRoot:function(){
				//this style of url really couples this model to both its collection and user model
				//However, we need to make sure a card is associated with a user so I think the coupling
				//is warranted.
				return "/user/"+this.collection.user.id+"/cards";
			},
			// set: function( key, value, options ) {
			// 	Backbone.RelationalModel.prototype.set.apply( this, arguments );

			// 	if (typeof key === 'object') {
			// 		if (_.has(key, "dateCreated")) {
			// 			this.attributes.dateCreated = moment(key["dateCreated"]);
			// 		}
			// 	} else if (key === 'dateCreated'){
			// 		this.attributes.dateCreated = moment(value);
			// 	}
			// },
		});

		return Card;

	}

	);