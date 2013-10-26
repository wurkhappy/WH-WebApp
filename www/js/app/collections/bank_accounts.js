/*
 * Collection.
 */

 define(['backbone', 'models/comment'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,
 			url: function(){
 				return "/user/"+this.user.id+"/bank_account";
 			}
 		});

 		return Collection;

 	}

 	);