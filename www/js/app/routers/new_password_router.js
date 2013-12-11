define(['backbone', 'flying-focus', 'views/new_password/new_password'],

    function (Backbone, FlyingFocus, NewPasswordView) {

      'use strict';

      var NewPasswordRouter = Backbone.Router.extend({

        routes: {
          '': 'index',
        },

        initialize: function () {
          FlyingFocus();
        },

        index: function () {

          this.view = new NewPasswordView({userID: window.user.id});
        },

      });

      return NewPasswordRouter;

    }
);