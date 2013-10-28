/*
 * Collection.
 */

 define(['backbone', 'models/comment'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,
 			url: function(){
 				return "/user/"+this.user.id+"/cards";
 			}

 		});

 		return Collection;

 	}

 	);