/*
 * Collection.
 */

 define(['backbone', 'models/comment'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,
 			initialize: function(models, options){
 				if(options){
 					this.agreementVersionID = options.agreementVersionID;
 					this.agreementID = options.agreementID;
 				}
 			},
 			comparator:function(item){
 				return item.get("dateCreated").valueOf();
 			},
 			filterByTagID:function(tagID){
 				var filtered = this.filter(function(model){
 					var tags = model.get("tags");
 					if (tags.get(tagID)) return true;
 					return false;
 				});
 				return new Collection(filtered);
 			},

 		});

 		return Collection;

 	}

 	);