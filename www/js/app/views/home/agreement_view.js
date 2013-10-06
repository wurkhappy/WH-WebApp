/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore',
  'text!templates/home/agreement_tpl.html'],

  function (Backbone, Handlebars, _, agreementTpl) {

    'use strict';
    //helper functions
    var createStatusInfo = function(status, client){
      var currentState;
      var prefix = (status.get("paymentID")) ? "Payment" : "Agreement"
      var lastAction = prefix + " " +status.get("action") + " on " + status.get("date").format('MMM D, YYYY');
        switch (status.get("action")){
          case status.StatusSubmitted:
          currentState = "Waiting for " + prefix;
          break;
          case status.StatusCreated:
          currentState = null;
          lastAction = null;
          break;
          default:
          currentState = "Waiting for Current Milestone";
        }

      return {
        lastAction:lastAction,
        currentState:currentState
      };
    };

    var AgreementView = Backbone.View.extend({

      tagName:'tr',
      template: Handlebars.compile(agreementTpl),

      initialize: function (options) {
        this.currentUser = options.currentUser;
        this.userIsClient = this.model.get("clientID") === this.currentUser.id;
        var otherUserID = (otherUserID) ? this.model.get("freelancerID") : this.model.get("clientID");
        this.otherUser = options.otherUsers.get(otherUserID);
      },

      render: function () {
        var status = this.model.get("statusHistory").at(0);

        var statusInfo = createStatusInfo(status, this.userIsClient);

        this.$el.html(this.template({
          model: this.model.toJSON(),
          statusInfo: statusInfo,
          client:this.userIsClient,
          otherUser: this.otherUser
        }));
        return this;

      }
    });

    return AgreementView;

  }
  );