define(['backbone','backbone-relational'],

	function(Backbone, Relational) {

		'use strict';

		var Account = Backbone.RelationalModel.extend({
			urlRoot:function(){
				return "/user/"+this.collection.user.id+"/bank_account";
			},
			verify: function(amounts, successCallback){
				$.ajax({
					type: "POST",
					url: this.url()+"/verify",
					contentType: "application/json",
					dataType: "json",
					data:JSON.stringify(amounts),
					success: _.bind(function(response){
						this.set("can_debit", true);
						successCallback(response);
					}, this)
				});
			}
		});

		return Account;

	}

	);