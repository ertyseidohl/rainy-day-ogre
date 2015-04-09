module.exports = function(grunt) {
grunt.initConfig({

    jshint : {
        all : ['test/**/*.js', 'src/**/*.js', '!src/game/lib/**'],
    },
    
    jsdoc : {
        dist : {
            src : ['src/'],
            options: {
                destination : 'docs',
                recurse : true
            }
        }
    },

    browserify : {
       main : {
            src : ['src/game/**/*.js, !src/game/lib/**'],
            dest : ['scripts/ogre.js']
       }
    },

    mochaTest : {
        test : {
            options : {
                reporter : 'spec',
                require : 'coverage/blanket'
            },
            src : ['test/**/*.js']
        },
        coverage : {
            options : {
                reporter : 'html-cov',
                quiet : true,
                captureFile : 'coverage.html'
            },
            src : ['test/**/*.js']
        }
    },

    copy : {
        main : {
            files : [
                {expand : true, src : ['src/**'], dest : 'build/'}
            ],
        },
    },

    clean : ['build/'],

    watch : {
        files : ['test/**/*.js', 'src/**/*.js', '!src/game/lib/**'],
        tasks : ['default']
    },

    nodemon : {
        dev : {
            script : 'build/src/gameserver.js'
        }
    },

    concurrent : {
        build : {
            tasks: ['watch', 'nodemon'],
            options : {
                logConcurrentOutput: true
            }
        }
    }
});

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['jshint', 'mochaTest', 'clean', 'copy', 'jsdoc']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('run', ['concurrent:build']);
    grunt.registerTask('browserify', ['browserify']);
}
