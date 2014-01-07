define(['backbone'],

	function(Backbone) {

		'use strict';

		Backbone.Model.prototype.toJSON = function() {
			if (this._isSerializing) {
				return this.id || this.cid;
			}
			this._isSerializing = true;
			var json = _.clone(this.attributes);
			_.each(json, function(value, name) {
				if (value instanceof Backbone.Collection || value instanceof Backbone.Model) {
					json[name] = value.toJSON();
				}
			});
			this._isSerializing = false;
			return json;
		}

		return Backbone;

	}

	);