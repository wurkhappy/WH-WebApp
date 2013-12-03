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
 			}

 		});

 		return Collection;

 	}

 	);