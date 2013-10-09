define(['backbone', 'handlebars', 'underscore', 'marionette', 'moment',
  'text!templates/agreement/action_select_tpl.html'],

  function (Backbone, Handlebars, _, Marionette, moment, actionSelectTpl) {

    'use strict';
    Handlebars.registerHelper('dateFormat', function(date) {
      return date.format('MMM D, YYYY');
    });

    var ActionSelect = Backbone.Marionette.ItemView.extend({
      tagName:'select',
      attributes:{id:"actionSelect"},
      template: Handlebars.compile(actionSelectTpl),
      collectionEvents: {
        "reset": "render"
      }
    });

    return ActionSelect;

  }
  );
