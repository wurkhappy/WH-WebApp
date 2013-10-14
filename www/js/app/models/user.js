define(['backbone', 'collections/cards', 'models/card', 'collections/bank_accounts', 'models/bank_account',],

    function(Backbone, CardCollection, CardModel, AccountCollection, AccountModel) {

        'use strict';

        var User = Backbone.RelationalModel.extend({
            relations: [{           
                type: Backbone.HasMany,
                key: 'cards',
                relatedModel: CardModel,
                collectionType: CardCollection,
                reverseRelation: {
                    key: 'user',
                    includeInJSON: false
                }}
                // {           
                // type: Backbone.HasMany,
                // key: 'bank_accounts',
                // relatedModel: AccountModel,
                // collectionType: AccountCollection,
                // reverseRelation: {
                //     key: 'user',
                //     includeInJSON: false
                // }
                ],

                url:function(){
                    if (this.id) {return "/user/"+this.id;}
                    return "/user"
                }
            });

        return User;

    }

    );