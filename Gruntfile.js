module.exports = function(grunt) {
grunt.initConfig({

    jshint : {
                all : ['js/**/*.js', '!js/lib/**'],
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
});

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['jshint', 'jsdoc']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('lint', ['jshint']);
}
