
define(['backbone', 'handlebars'],

  function (Backbone, Handlebars) {

    'use strict';
    var template = '<div id="overlay" class="overlay hide"><div class="cover"></div><div id="panel" class="panel"><div class="close">X</div></div>';

    var Modal = Backbone.View.extend({

      attributes:{"id": "popup_container"},

      template: template,
      holder : $('#content'),

      initialize:function(options){
        this.view = options.view;
        this.listenTo(this.view, 'hide', this.hide);
        this.listenTo(this.view, 'close', this.remove);
        this.render();
      },

      render:function(event){
        this.$el.html(this.template);
        this.$('#panel').append(this.view.$el);
        this.holder.append(this.$el);
      },

      events: {
        "click .close": "hide",
      },
      show: function(){
        this.$('#overlay').fadeIn('slow');
      },
      hide: function(event) {
        this.$('#overlay').fadeOut('slow');
      }

    });

return Modal;

}
);