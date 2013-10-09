define(['backbone','backbone-relational'],

	function(Backbone, Relational) {

		'use strict';

		var Comment = Backbone.RelationalModel.extend({
			url:function(){
				console.log(this.collection);
				return "/agreement/"+this.collection.agreement.get("agreementID")+"/comments";
			}
		});

		return Comment;

	}

	);