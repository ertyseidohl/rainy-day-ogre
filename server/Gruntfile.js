module.exports = function(grunt) {
grunt.initConfig({

    jshint : {
                all : ['server.js', 'test/**/*.js', 'js/**/*.js', '!js/lib/**'],
    },
    
    jsdoc : {
        dist : {
            src : ['js/'],
            options: {
                destination : 'docs',
                recurse : true
            }
        }
    },

    browserify : {
       main : {
            src : ['js/**/*.js, !js/lib/**'],
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
    }
});

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['jshint', 'mochaTest',  'jsdoc']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('browserify', ['browserify']);
}