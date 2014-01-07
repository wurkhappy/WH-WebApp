/*
 * Collection.
 */

 define(['backbone', 'models/scope_item'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,

 			update: function(){
 				$.ajax({
 					type: "PUT",
 					url: "/agreement/v/"+this.getAgreementVersionID()+"/work_item/"+this.getWorkItemID()+"/tasks",
 					contentType: "application/json",
 					dataType: "json",
 					data:JSON.stringify(this.toJSON()),
 					success: function(response){
 						if (_.isFunction(successCallback)) successCallback();
 					}
 				});
 			},
 			getAgreementVersionID:function(){
 				return this.parent.getAgreementVersionID();
 			},
 			getWorkItemID: function(){
 				return this.parent.id;
 			}

 		});

 		return Collection;

 	}

 	);