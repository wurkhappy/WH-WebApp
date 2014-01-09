/*
 * Collection.
 */

 define(['backbone', 'underscore', 'models/tag'],

 	function(Backbone, _, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,

 			addMileStoneTags: function(workItemsArray){
 				var that = this;
 				var tagsToAdd = _.clone(workItemsArray);
 				var pCount = tagsToAdd.length;
 				this.each(function(tag){
 					for (var i = 0; i < pCount; i++) {
 						var tagCheck = tagsToAdd[i];
 						if (tagCheck.get("title") === tag.get("name")){
 							tagsToAdd.splice(i, 1);
 							pCount -= 1;
 							break;
 						}
 					}
 				})
 				_.each(tagsToAdd, function(workItem){
 					that.add({name: workItem.get("title")});
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