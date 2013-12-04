/*
 * Router. Initializes the root-level View(s), and calls the render() method on Sub-View(s).
 */

 define(['backbone','views/legal/terms', 'views/legal/privacy'],

  function (Backbone, TermsView, PrivacyView) {

    'use strict';

    var LegalRouter = Backbone.Router.extend({

      routes: {
        '': 'terms',
        'privacy':"privacy"
      },

      initialize: function () {
        this.$mainSection = $("#content");
      },

      terms: function () {
        if (!this.termsView) this.termsView = new TermsView({router:this});
        this.$mainSection.html(this.termsView.el);
      },
      privacy: function(){
        if (!this.privacyView) this.privacyView = new PrivacyView({router:this});
        this.$mainSection.html(this.privacyView.el);
      }

    });

return LegalRouter;

}
);