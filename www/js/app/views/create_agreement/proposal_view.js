/*
 * Scope of Work - Create Agreement View.
 */

define(['backbone', 'handlebars', 'underscore', 'moment', 'parsley', 'ckeditor', 'ckadapter', 'hbs!templates/create_agreement/proposal_tpl'],

    function(Backbone, Handlebars, _, moment, parsley, CKEDITOR, ckadapter, scopeTemplate) {

        'use strict';

        var ProposalView = Backbone.View.extend({

            className: 'clear white_background',
            attributes: {
                'id': 'content'
            },

            template: scopeTemplate,

            initialize: function(options) {
                this.userID = options.userID;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                _.defer(_.bind(this.onRender, this));
                return this;
            },

            events: {
                "blur input": "updateField",
                'blur input[type="radio"]': "updateRole",
                'blur input[type="checkbox"]': "updateClauses",
                "blur textarea": "updateField",
                "click #save_continue": "debounceSaveAndContinue",
            },
            onRender: function() {
                if (this.userID === this.model.get("clientID")) this.$('input[name=role][value=clientID]').prop("checked", true);

                CKEDITOR.basePath = 'https://d3kq8dzp7eezz0.cloudfront.net/css/ckeditor/';
                CKEDITOR.replace('message_editor', {
                    toolbar: [{
                        items: ['Bold', '-', 'Italic', '-', 'Underline', 'NumberedList', 'BulletedList']
                    }],
                    disableNativeSpellChecker: false,
                    language: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/en.js',
                    skin: 'wurkhappy,https://d3kq8dzp7eezz0.cloudfront.net/css-1/wurkhappy/',
                    customConfig: 'https://d3kq8dzp7eezz0.cloudfront.net/css-1/config.js'
                });
                CKEDITOR.config.contentsCss = 'https://d3kq8dzp7eezz0.cloudfront.net/css/contents.css';
                CKEDITOR.config.stylesSet = 'my_styles:https://d3kq8dzp7eezz0.cloudfront.net/css-1/styles.js';

            },
            updateField: function(event) {
                this.model.set(event.target.name, event.target.value);
            },
            updateRole: function(event) {
                this.model.set("clientID", "");
                this.model.set("freelancerID", "");
                this.model.set(event.target.value, this.userID);
            },
            updateClauses: function(event) {
                var $element = $(event.target);
                this.model.get("clauses").add({
                    id: $element.data('clauseid'),
                    text: $element.data('text'),
                    userID: this.userID
                });
            },

            debounceSaveAndContinue: function(event) {
                event.preventDefault();
                event.stopPropagation();
                this.saveAndContinue();
            },
            saveAndContinue: _.debounce(function(event) {

                var editor = CKEDITOR.instances.message_editor;
                var html = editor.getData();

                this.model.set("proposedServices", html);

                $('.proposal_form').parsley('validate');
                var isValid = $('.proposal_form').parsley('isValid');

                if (isValid) {
                    this.model.set("draft", true);
                    this.model.save({}, {
                        success: _.bind(function(model, response) {
                            window.location.hash = 'deliverables';
                        }, this)
                    });
                }
            }, 500, true)
        });

        return ProposalView;

    }
);