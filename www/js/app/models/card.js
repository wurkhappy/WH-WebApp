define(['backbone','backbone-relational'],

	function(Backbone, Relational) {

		'use strict';

		var Card = Backbone.RelationalModel.extend({
			urlRoot:function(){
				//this style of url really couples this model to both its collection and user model
				//However, we need to make sure a card is associated with a user so I think the coupling
				//is warranted.
				return "/user/"+this.getUserID()+"/cards";
			},
			getUserID: function(){
				return this.collection.getUserID();
			}
		});

		return Card;

	}

	);