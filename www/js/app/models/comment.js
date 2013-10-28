define(['backbone','backbone-relational', 'moment'],

	function(Backbone, Relational, moment) {

		'use strict';

		var Comment = Backbone.RelationalModel.extend({
			url:function(){
				return "/agreement/"+this.collection.agreement.get("agreementID")+"/comments";
			},
			set: function( key, value, options ) {
				Backbone.RelationalModel.prototype.set.apply( this, arguments );

				if (typeof key === 'object') {
					if (_.has(key, "dateCreated")) {
						this.attributes.dateCreated = moment(key["dateCreated"]);
					}
				} else if (key === 'dateCreated'){
					this.attributes.dateCreated = moment(value);
				}
			},
		});

		return Comment;

	}

	);