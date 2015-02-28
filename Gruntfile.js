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
                    'dist/js/magic.min.js': 'src/js/magic.js'
                }
            }
        },

        // compile less stylesheets to css -----------------------------------------
        less: {
            build: {
                files: {
                    'dist/css/pretty.css': 'src/css/pretty.less'
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
                    'dist/css/style.min.css': 'src/css/style.css'
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
                tasks: ['jshint', 'uglify']
            },
            pegjs: {
                files: 'api/pegjs/*.pegjs',
                tasks: ['peg']
            }
        },

        peg: {
            mathapi: {
                src: "api/pegjs/math.pegjs",
                dest: "api/pegjs/math.js"
            },
            mathfront: {
                src: "api/pegjs/math.pegjs",
                dest: "dist/js/math.js"
            }

        }

    });

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-peg');

    // ===========================================================================
    // CREATE TASKS ==============================================================
    // ===========================================================================
    grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'less', 'peg']);

};