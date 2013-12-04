define(['backbone','backbone-relational', 'moment', 'models/tag', 'collections/tags'],

	function(Backbone, Relational, moment, TagModel, TagCollection) {

		'use strict';

		var Comment = Backbone.RelationalModel.extend({
			relations: [{
				type: Backbone.HasMany,
				key: 'tags',
				relatedModel: TagModel,
				collectionType: TagCollection,
			}],
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
				return this;
			}
		});

		return Comment;

	}

	);