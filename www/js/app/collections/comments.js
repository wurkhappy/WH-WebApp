/*
 * Collection.
 */

 define(['backbone', 'models/comment'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,
 			comparator:function(item){
 				return item.get("dateCreated").valueOf();
 			}

 		});

 		return Collection;

 	}

 	);