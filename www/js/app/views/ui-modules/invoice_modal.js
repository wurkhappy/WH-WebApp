define(['backbone', 'handlebars', 'hbs!templates/ui-modules/invoice_modal_tpl'],

    function(Backbone, Handlebars, tpl) {

        'use strict';

        var Modal = Backbone.View.extend({

            attributes: {
                "id": "popup_container"
            },

            template: tpl,
            holder: $('body'),

            initialize: function(options) {
                if (options) {
                    this.view = options.view;
                    this.hideClose = options.hideClose;
                }
                this.listenTo(this.view, 'hide', this.hide);
                this.listenTo(this.view, 'close', this.remove);
                this.render();
            },

            render: function(event) {
                this.$el.html(this.template({
                    showClose: !this.hideClose,
                }));
                this.$('#panel').append(this.view.$el);
                this.holder.append(this.$el);
                this.holder.addClass('overflow_hidden');
                $("#popup_container").show();

            },

            events: {
                "click .close": "hide",
                "click .personal_message_link": "showPersonalMessage"
            },
            show: function() {
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
                _.defer(function() {
                    $(".personal_message_container").fadeIn('fast');
                });
            }

        });

        return Modal;

    }
);