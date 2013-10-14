/*
 * Collection.
 */

 define(['backbone', 'models/comment'],

 	function(Backbone, Model) {

 		'use strict';

 		var Collection = Backbone.Collection.extend({

 			model: Model,
 		});

 		return Collection;

 	}

 	);