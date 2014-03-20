define(['jquery', 'backbone', 'handlebars', 'toastr', 
        'hbs!templates/create_agreement/payment_schedule', 'ckeditor', 'ckadapter'
        , ],

    function($, Backbone, Handlebars, toastr, tpl, CKEDITOR, ckadapter) {

        'use strict';

        var PaymentSchedule = Backbone.View.extend({

            template: tpl,
            milestone: "<p>Payment will be based on the completion of the following:</p><p><br></p><p>Milestone 1</p><ul><li>Due January 31, 2014</li><li>$1000</li></ul><p>Milestone 2</p><ul><li>Due February 8, 2014</li><li>$2000</li></ul>",
            hourly: "<p>Hourly</p>",
            reoccuring: "<p>Reoccuring</p>",

            events: {
                'change input': "changeTemplate"
            },

            initialize: function() {
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                _.defer(_.bind(this.onRender, this));
                return this;
            },
            onRender: function() {
                CKEDITOR.basePath = 'https://d3kq8dzp7eezz0.cloudfront.net/css/ckeditor/';
                this.editor = this.$('#message_editor').ckeditor({
                    toolbar: [{
                        items: ['Bold', '-', 'Italic', '-', 'Underline', 'NumberedList', 'BulletedList', 'Link', 'Unlink']
                    }],
                    disableNativeSpellChecker: false,
                    language: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/en.js',
                    skin: 'wurkhappy,https://d3kq8dzp7eezz0.cloudfront.net/css-1/wurkhappy/',
                    customConfig: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/config.js'
                }).ckeditorGet();
                CKEDITOR.config.contentsCss = 'https://d3kq8dzp7eezz0.cloudfront.net/css/contents.css';
                CKEDITOR.config.stylesSet = 'my_styles:https://d3kq8dzp7eezz0.cloudfront.net/css-1/styles.js';

            },
            getSchedule: function() {
                return this.editor.getData();
            },
            changeTemplate: function(event) {
                console.log(this.editor)
                this.editor.setData(this[event.target.value]);
            }

        });

        return PaymentSchedule;

    }
);