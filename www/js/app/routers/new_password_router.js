define(['backbone', 'views/new_password/new_password'],

    function (Backbone, NewPasswordView) {

      'use strict';

      var NewPasswordRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
        },

        initialize: function () {
        },

        index: function () {

          this.view = new NewPasswordView({userID: window.user.id});
        },

      });

      return NewPasswordRouter;

    }
);