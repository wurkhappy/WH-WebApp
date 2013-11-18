/**
 *
 * RequireJS file paths and shim config.
 *
 *
 * The build will inline common dependencies into this file.
 * File paths will be used for other module packages too, as defined in build.js.
 *
 *
 * More info            https://github.com/jrburke/r.js/blob/master/build/example.build.js
 *                      https://github.com/ryanfitzer/Example-RequireJS-jQuery-Project
 *                      https://github.com/tbranyen/backbone-boilerplate
 *                      https://github.com/requirejs/example-multipage-shim
 *
 * @author Aki Karkkainen - adapted from https://github.com/requirejs/example-multipage-shim
 * @url https://github.com/akikoo/grunt-frontend-workflow
 * Twitter: http://twitter.com/akikoo
 *
 */

 require.config({

    paths: {

        // Core libraries.
        jquery: 'lib/jquery/jquery',
        underscore: 'lib/underscore/underscore',
        backbone: 'lib/backbone/backbone',
        marionette: 'lib/backbone.marionette/lib/backbone.marionette',
        modernizr: 'lib/modernizr/modernizr',
        'backbone-relational' : 'lib/backbone-relational/backbone-relational',

        // Models
        /*agreementModel: 'app/models/agreement',
        bankAccountModel: 'app/models/bank_account',
        cardModel: 'app/models/card',
        commentModel: 'app/models/comment',
        paymentModel: 'app/models/payment',
        scopeItemModel: 'app/models/scope_item',
        statusModel: 'app/models/status',
        userModel: 'app/models/user',

        // Collections
        agreementCollection: 'app/collections/agreements',
        bankAccountCollection: 'app/collections/bank_accounts',
        cardCollection: 'app/collections/cards',
        commentCollection: 'app/collections/comments',
        paymentCollection: 'app/collections/payments',
        scopeItemCollection: 'app/collections/scope_items',
        statusCollection: 'app/collections/status',
        userCollection: 'app/collections/users',


        //from grunt file
        'agreementModel',
        'bankAccountModel',
        'cardModel',
        'clauseModel',
        'commentModel',
        'paymentModel',
        'scopeItemModel',
        'statusModel',
        'userModel',
        'agreementCollection',
        'bankAccountCollection',
        'cardCollection',
        'clauseCollection',
        'commentCollection',
        'paymentCollection',
        'scopeItemCollection',
        'statusCollection',
        'userCollection'

        */

        // Templating.
        handlebars: 'lib/handlebars/handlebars',

        // Plugins.
        text: 'lib/requirejs-text/text',
        moment: 'lib/momentjs/moment',
        noty: 'lib/noty/js/noty/jquery.noty',
        "noty-inline": 'lib/noty/js/noty/layouts/inline',
        "noty-default": 'lib/noty/js/noty/themes/default',
        "intro": 'lib/intro.js/intro',
        kalendae: 'lib/kalendae/build/kalendae.standalone.min',
        parsley: 'lib/parsleyjs/parsley',

        // Custom AMD modules.
        // utils: 'app/utils',

        // App folders.
        collections: 'app/collections',
        models: 'app/models',
        routers: 'app/routers',
        templates: 'app/templates',
        views: 'app/views'
        
    },

    // Dependencies for scripts that are not wrapped as AMD modules.
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        marionette : {
            deps : ['jquery', 'underscore', 'backbone'],
            exports : 'Marionette'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        'backbone-relational' : {
            deps: ['backbone']
        },
        parsley : {
            deps : ['jquery'],
            exports : 'parsley'
        },
        noty : {
            deps : ['jquery'],
            exports : 'noty'
        },
        "noty-inline" : {
            deps : ['noty']
        },
        "noty-default" : {
            deps : ['noty']
        },
        "intro" : {
            exports : ['introJs']
        },
        kalendae : {
            exports : 'Kalendae'
        }
    }
});
