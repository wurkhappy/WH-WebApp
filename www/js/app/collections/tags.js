/*
 * Collection.
 */

 define(['backbone', 'models/tag'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,

 			addMileStoneTags: function(payments){
 				var that = this;
 				var tagsToAdd = payments.clone();
 				var pCount = payments.length;
 				this.each(function(tag){
 					for (var i = 0; i < pCount; i++) {
 						var payment = payments.at(i);
 						if (payment.get("title") === tag.get("name")){
 							tagsToAdd.remove(tagsToAdd.get(payment.id));
 							break;
 						}
 					}
 				})
 				tagsToAdd.each(function(payment){
 					that.add({name: payment.get("title")});
 				})
 			},
 			addTags: function(tags){
 				var that = this;
 				_.each(tags, _.bind(function(tag){
 					this.each(function(model){
 						if (model.get("name") === tag.name) {
 							if(!model.id) that.remove(model);
 						}
 					})
 					that.add(tag);
 				},this));
 			},

 		});

return Collection;

}

);