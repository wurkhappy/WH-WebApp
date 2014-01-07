/*
 * Collection.
 */

 define(['backbone', 'models/card'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,
 			initialize:function(models, options){
 				if (options) {
 					this.userID = options.userID;
 				}
 			},
 			url: function(){
 				return "/user/"+this.getUserID()+"/cards";
 			},
 			getUserID:function(){
 				return this.parent.id;
 			}

 		});

 		return Collection;

 	}

 	);