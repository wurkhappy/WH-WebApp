/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'hbs!templates/agreement/communication/filters_box', 'views/agreement/communication/filter_item'],

  function (Backbone, Handlebars, _, Marionette, tpl, FilterItem) {

    'use strict';

    var FilterBox = Backbone.Marionette.CompositeView.extend({

      template: tpl,
      className: "tags_container float_left",

      itemView: FilterItem
    });

    return FilterBox;

  }
  );