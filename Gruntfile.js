/**
 * Created by ivanhoe on 2/26/15.
 */
module.exports = function(grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        browserify: {

            js: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                // A single entry point for our app
                src: 'src/js/entry.js',
                // Compile to a single file to add a script tag for in your HTML
                dest: 'tmp/main.js'
            }
        },



        //paths: {
        //    src: {
        //        js: 'src/**/*.js'
        //    },
        //    dest: {
        //        js: 'dist/js/entry.js',
        //        jsMin: 'dist/main.min.js'
        //    }
        //},

        //HTML
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'src/index.html'     // 'destination': 'source'
                }
            },
            dev: {                                       // Another target
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },

        copy: {
            main: {
                src: 'tmp/main.js',
                dest: 'dist/js/main.min.js'
            },
            bootstrap: {
                src: 'bower_components/bootstrap/dist/js/bootstrap.min.js',
                dest: 'dist/js/bootstrap.min.js'
            },
            jquery: {
                src: 'bower_components/jquery/dist/jquery.min.js',
                dest: 'dist/js/jquery.min.js'
            }
        },

        // configure jshint to validate js files -----------------------------------
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            all: ['Gruntfile.js', 'src/**/*.js','api/app.js','api/functionFactory.js']
        },

        // configure uglify to minify js files -------------------------------------
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/js/main.min.js': 'tmp/main.js',
                    'dist/js/mocha.min.js': 'bower_components/mocha/mocha.js',
                    'dist/js/tests.js': 'test/functionFactoryTests.js'
                }
            }
        },

        // configure cssmin to minify css files ------------------------------------
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/css/main.min.css': ['bower_components/bootstrap/dist/css/bootstrap.min.css','src/css/custom.css']
                }
            }
        },

        // configure watch to auto update ------------------------------------------
        watch: {
            stylesheets: {
                files: ['src/**/*.css', 'src/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            scripts: {
                files: 'src/**/*.js',
                tasks: ['browserify','copy'] //'jshint',
            },
            pegjs: {
                files: 'api/pegjs/*.pegjs',
                tasks: ['peg']
            },
            html: {
                files: 'src/*.html',
                tasks: ['htmlmin']
            },
            configFiles: {
                files: [ 'Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },

        peg: {
            mathapi: {
                src: "api/pegjs/math.pegjs",
                dest: "api/pegjs/math.js"
            }

        }

    });

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // ===========================================================================
    // CREATE TASKS ==============================================================
    // ===========================================================================
    //'jshint',
    //grunt.registerTask('development', ['peg','browserify','copy']);
    grunt.registerTask('development', ['peg','browserify','copy','htmlmin','cssmin']); //copy instead of uglify
    grunt.registerTask('production', ['peg','browserify','uglify', 'htmlmin', 'cssmin']);

};