module.exports = function(grunt) {
grunt.initConfig({

    jshint : {
                all : ['server.js', 'js/**/*.js', '!js/lib/**'],
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

    grunt.registerTask('default', ['jshint', 'mochaTest',  'jsdoc']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('lint', ['jshint']);
}
