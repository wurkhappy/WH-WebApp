
define(['backbone', 'handlebars'],

  function (Backbone, Handlebars) {

    'use strict';
    var template = '<div id="overlay" class="overlay hide"><div class="cover"></div><div id="panel" class="panel"><div class="close">X</div></div>';

    var Modal = Backbone.View.extend({

      attributes:{"id": "popup_container"},

      template: template,
      holder : $('body'),

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
        this.holder.addClass('overflow_hidden');
        $("#popup_container").show();
        
      },

      events: {
        "click .close": "hide",
        "click .personal_message_link": "showPersonalMessage"
      },
      show: function(){
        this.$('#overlay').fadeIn('slow');
        $("#popup_container").show();
      },
      hide: function(event) {
        this.$('#overlay').fadeOut('slow');
        this.holder.removeClass('overflow_hidden');
        $("#popup_container").fadeOut('slow');
        this.remove();
      },
      showPersonalMessage: function() {
        $(".panel").animate({
          left: "30%",
          width: "900px"
        }, "fast");
        $(".personal_message_helper").fadeOut('fast');
        _.defer( function() {
          $(".personal_message_container").fadeIn('fast');
        });
      }

    });

return Modal;

}
);