define(['backbone', 'collections/cards', 'models/card', 'collections/bank_accounts', 'models/bank_account', ],

    function(Backbone, CardCollection, CardModel, AccountCollection, AccountModel) {

        'use strict';

        var User = Backbone.RelationalModel.extend({
            relations: [{
                type: Backbone.HasMany,
                key: 'cards',
                relatedModel: CardModel,
                collectionType: CardCollection,
                reverseRelation: {
                    key: 'parent',
                    includeInJSON: false
                }
            }, {
                type: Backbone.HasMany,
                key: 'bank_accounts',
                relatedModel: AccountModel,
                collectionType: AccountCollection,
                reverseRelation: {
                    key: 'parent',
                    includeInJSON: false
                }
            }],

            url: function() {
                if (this.id) {
                    return "/user/" + this.id;
                }
                return "/user";
            },
            login: function(reqData, options) {
                $.ajax({
                    type: "POST",
                    url: "/user/login",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(_.extend(this.toJSON(), reqData)),
                    success: _.bind(function(response) {
                        this.set(response);
                        if (_.isFunction(options["success"])) options.success(this, response);
                    }, this),
                    error: _.bind(function(response) {
                        if (_.isFunction(options["error"])) options.error(this, response);
                    }, this)
                });
            },
            createAccount: function(reqData, options) {
                $.ajax({
                    type: "POST",
                    url: "/user",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(_.extend(this.toJSON(), reqData)),
                    success: _.bind(function(response) {
                        this.set(response);
                        if (_.isFunction(options["success"])) options.success(this, response);
                    }, this),
                    error: _.bind(function(response) {
                        if (_.isFunction(options["error"])) options.error(this, response);
                    }, this)
                });
            },
        });

        return User;

    }

);