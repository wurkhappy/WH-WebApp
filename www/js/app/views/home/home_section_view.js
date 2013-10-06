/*
 * Scope of Work - Create Agreement View.
 */

 define(['backbone', 'handlebars', 'underscore', 'marionette',
  'text!templates/home/section_tpl.html', 'views/home/agreement_view'],

  function (Backbone, Handlebars, _, Marionette, sectionTemplate, AgreementView) {

    'use strict';

    var SectionView = Backbone.Marionette.CompositeView.extend({

      template: Handlebars.compile(sectionTemplate),

      itemView: AgreementView,
      itemViewContainer:'table',
      itemViewOptions: function(){
        return {
          otherUsers: this.otherUsers,
          currentUser: this.currentUser
        }
      },
      initialize:function(options){
        this.title = options.title;
        this.otherUsers = options.otherUsers;
        this.currentUser = options.currentUser;
        this.render();
      },
      onRender:function(){
        this.$('h2').text(this.title);
      }

    });

    return SectionView;

  }
  );