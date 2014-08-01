/*
 * Gruntfile for the Grunt Front-End Workflow/Boilerplate
 * (previously called Backbone/RequireJS multipage boilerplate).
 *
 * DEV URL: http://localhost:9001/
 *
 * @author Aki Karkkainen
 * @url https://github.com/akikoo/grunt-frontend-workflow
 * Twitter: http://twitter.com/akikoo
 *
 */

// Needed for `grunt-contrib-livereload`.
var path = require('path'),
    lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    folderMount = function folderMount(connect, point) {
        return connect.static(path.resolve(point));
    };

// Grunt configuration wrapper function.
module.exports = function(grunt) {

    'use strict';

    // Configurable paths and other variables. 
    var config = {
        webroot: 'www',
        dist: 'www-built',
        testroot: 'test',
        tstamp: '<%= grunt.template.today("ddmmyyyyhhMMss") %>'
    };

    // Initialize our configuration object.
    grunt.initConfig({

        /*
         * Get configuration options.
         */
        config: config,


        /*
         * Get the project metadata.
         */
        pkg: grunt.file.readJSON('package.json'),


        /*
         * Create a dynamic build header.
         */
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | ' +
            '<%= grunt.template.today("dd-mm-yyyy-hh:MM:ss") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> |',


        /*
         * Start a static web server.
         * DEV URL http://localhost:9001/.
         * To view the local site on another device on the same LAN, use your master machine's IP address instead, for example http://10.0.0.32:9001/.
         */
        connect: {
            livereload: {
                options: {
                    port: 9001, // The port on which the webserver will respond.
                    hostname: '*', // Default 'localhost'. Setting this to '*' will make the server accessible from anywhere. Useful for cross-device testing.
                    base: '<%= config.webroot %>', // The base (or root) directory from which files will be served. Defaults to the project Gruntfile's directory.
                    middleware: function(connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            }
        },


        /*
         * Run predefined tasks whenever watched file patterns are added, changed or deleted.
         */
        watch: {
            options: {
                // Reload assets live in the browser.
                livereload: 35729 // Default livereload listening port.
            },
            css: {
                files: ['<%= config.webroot %>/scss/**/*.scss'],
                tasks: [
                    'compass',
                    //'csslint'
                ]
            }
        },


        /*
         * Compile Sass to CSS using Compass.
         */
        compass: {
            //options: {

            //},
            dist: {
                options: {
                    httpPath: '/',
                    cssDir: '<%= config.webroot %>/css',
                    sassDir: '<%= config.webroot %>/scss',
                    imagesDir: '<%= config.webroot %>/img',
                    javascriptsDir: '<%= config.webroot %>/js',
                    outputStyle: 'expanded',
                    require: ['sass', 'compass', 'style-prototypes'], //used to manage compass plugins in grunt without having a typical config.rb file
                    bundleExec: true, // bundler will be used to find dependencies in the load path given by the gemfile
                    relativeAssets: true,
                    noLineComments: false,
                    force: true,
                    raw: 'Sass::Script::Number.precision = 15\n' // Use `raw` since it's not directly available.
                }
            }
        },


        /*
         * Lint CSS files.
         */
        csslint: {
            options: {
                csslintrc: '.csslintrc' // Get CSSLint options from external file.
            },
            strict: {
                options: {},
                src: ['<%= config.webroot %>/css/*.css']
            },
            lax: {
                options: {}
                // src: ['www/css/common/*.css']
            }
        },


        /*
         * Validate files with JSHint.
         */
        jshint: {
            // Configure JSHint (documented at http://www.jshint.com/docs/).
            options: {
                jshintrc: '.jshintrc' // Get JSHint options from external file.
            },
            // Define the files to lint.
            files: [
                'Gruntfile.js',
                '<%= config.webroot %>/js/app/**/*.js' // Only process custom scripts, exclude libraries.
            ]
        },


        /*
         * Optimize RequireJS projects using r.js.
         */
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js', // The JS source dir, relative to the 'appDir' if set below. No forward slash here!
                    appDir: '<%= config.webroot %>', // The top level assets directory, relative to this file. All the files from this directory will be copied to 'dir'.
                    dir: '<%= config.dist %>', // The CSS and JS output dir, relative to this file.
                    mainConfigFile: '<%= config.webroot %>/js/config.js', // Include the main configuration file (paths, shim). Relative to this file.
                    optimize: 'uglify', // (default) uses UglifyJS to minify the code.
                    skipDirOptimize: true, // Set to true, to skip optimizing other non-build layer JS files (speeds up builds).
                    optimizeCss: 'standard', // @import inlining, comment removal and line returns.
                    fileExclusionRegExp: /^\.|\.((json))|scss$/, // If the regexp matches, it means the file/directory will be excluded.

                    // List of modules that will be optimized. All their immediate and deep dependencies will be included.
                    modules: [
                        // First set up the common build layer. Module names are relative to 'baseUrl'.
                        {
                            name: 'config',
                            // List common dependencies here. Only need to list top level dependencies, "include" will find nested dependencies.
                            include: [
                                'jquery',
                                'backbone',
                                'underscore',
                                'handlebars',
                                'hbs',
                                'json2',
                                'i18nprecompile',
                                'text',
                                'moment',
                                'flying-focus'
                            ]
                        },


                        // NOTE: If you're building a Single Page Application, you can combine the shim 
                        // config with your page logic, resulting in only one http request (plus requirejs itself), 
                        // like so:

                        // Otherwise if you have multiple pages, do the following:
                        // Now set up a build layer for each main layer, but exclude the common one.
                        // "exclude" will exclude the nested, built dependencies from "config".
                        // Any "exclude" that includes built modules should be listed before the
                        // build layer that wants to exclude it. The "mainpage" and "subpage" modules
                        // are **not** the targets of the optimization, because shim config is
                        // in play, and shimmed dependencies need to maintain their load order.
                        // In this example, config.js will hold jquery, so other scripts need to be
                        // delayed from loading until config.js finishes. That loading sequence
                        // is controlled in mainpage.js.
                        {
                            name: 'app/mainaccount',
                            exclude: ['config'],
                        }, {
                            name: 'app/mainagreement',
                            exclude: ['config']
                        }, {
                            name: 'app/maincreateagreement',
                            exclude: ['config']
                        }, {
                            name: 'app/mainhome',
                            exclude: ['config']
                        }, {
                            name: 'app/mainlanding',
                            exclude: ['config']
                        }, {
                            name: 'app/mainnewpassword',
                            exclude: ['config']
                        }, {
                            name: 'app/mainarchives',
                            exclude: ['config']
                        }, {
                            name: 'app/mainlegal',
                            exclude: ['config']
                        }, {
                            name: 'app/mainsamplehome',
                            exclude: ['config']
                        }
                    ]
                }
            }
        },

        /*
         * Minify PNG and JPEG images using OptiPNG and jpegtran.
         */
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 // PNG only.
                },
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%= config.webroot %>/img/', // Src matches are relative to this path.
                    src: '**/*.{png,jpg,jpeg}', // Actual pattern(s) to match.
                    dest: '<%= config.dist %>/img/' // Destination path prefix.
                }]
            }
        },


        /*
         * Concatenate dynamic banner information to built CSS and JS files.
         */
        concat: {
            options: {
                stripBanners: true, // Strip any existing JavaScript banner comments from source files.
            },
            dist: {
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%= config.dist %>/', // Src matches are relative to this path.
                    src: [ // Actual pattern(s) to match.
                        'css/*.css', // Process only main css files in CSS root.
                        'js/app/*.js', // Process only main js files in JS app root.
                        'js/config.js' // Process also the common layer. 
                    ],
                    dest: '<%= config.dist %>/', // Destination path prefix.
                    nonull: false // Set nonull to true if you want the concat task to warn if a given file is missing or invalid.
                }]
            }
        },

        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                files: [{
                    expand: true,
                    src: ['www-built/js/config.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainaccount.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainagreement.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainarchives.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/maincreateagreement.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainhome.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainlanding.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainlegal.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainnewpassword.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/js/app/mainsamplehome.js'],
                    dest: 'js-gz',
                    ext: '.js'
                }, {
                    expand: true,
                    src: ['www-built/css/landing.css'],
                    dest: 'js-gz',
                    ext: '.css'
                }, {
                    expand: true,
                    src: ['www-built/css/main_app.css'],
                    dest: 'js-gz',
                    ext: '.css'
                }, {
                    expand: true,
                    src: ['www-built/css/pdf.css'],
                    dest: 'js-gz',
                    ext: '.css'
                }]
            }
        },
        jasmine: {
            dist: {
                options: {
                    specs: 'www/js/spec/**/*Spec.js',
                    helpers: ['www/js/lib/jasmine-ajax/lib/mock-ajax.js'],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: ['www/js/config.js'],
                        requireConfig: {
                            baseUrl: 'www/js'
                        }
                    }
                }
            }
        }

    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // The default (DEV) task can be run just by typing "grunt" on the command line.
    grunt.registerTask('default', [
        //'includereplace', Disable live reload
        'compass',
        //'csslint',
        //'jshint',
        'connect',
        //'karma:unit', On change, run the tests specified in the unit target using the already running karma server.
        'watch'
    ]);


    // The optimized production build would be run by typing "grunt dist" on the command line.
    grunt.registerTask('dist', [
        'compass',
        'csslint',
        //'jshint',
        'connect',
        'requirejs',
        'concat',
        'compress'
    ]);

};