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
      initialize:function(options){
        this.title = options.title;
        this.render();
      },
      onRender:function(){
        this.$('h2').text(this.title);
      }

    });

    return SectionView;

  }
  );