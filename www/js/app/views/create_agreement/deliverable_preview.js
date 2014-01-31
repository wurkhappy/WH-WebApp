define(['backbone', 'handlebars', 'underscore', 'marionette', 'hbs!templates/create_agreement/deliverable_preview'],

    function(Backbone, Handlebars, _, Marionette, tpl) {

        'use strict';

        var DeliverablePreview = Backbone.View.extend({
            template: tpl,

            initialize: function(options) {
                this.listenTo(this.model.get("scopeItems"), "add", this.render);
                this.listenTo(this.model.get("scopeItems"), "remove", this.render);
                this.listenTo(this.model, "change", this.render);
                this.render();
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return DeliverablePreview;

    }
);