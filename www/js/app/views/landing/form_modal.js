/*
 * Login View.
 */

define(['backbone', 'handlebars', 'parsley', 'hbs!templates/landing/form_modal', 'models/user'],

    function (Backbone, Handlebars, parsley, tpl, UserModel) {

      'use strict';

      var FormModal = Backbone.View.extend({

        // Compile our footer template.
        template: tpl,

        initialize: function (options) {
          this.childView = options.childView;
          this.render();
        },

        render: function () {

          // Update el with the cached template.
          var tplHtml = $(this.template());
          tplHtml.find('.form_holder').html(this.childView.el);
          $(this.el).html(tplHtml);


          return this;

        }

      });

      return FormModal;

    }
);