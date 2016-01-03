module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //concat 설정
        concat: {
            basic: {
                src: ['views/js/*.js'],
                dest: 'views/build/result.js'
            },
            extras: {
                src: ['views/library/*.js', 'views/library/jqm/jquery.mobile-1.4.5.min.js'],
                dest: 'views/build/library-result.js'
            },
            options: {
                process: function(src, filepath) {
                    return '\n\n/**\n***    ' + filepath + '\n***/\n\n' + src;
                }
            }
        },
        jshint: {
            all: ['*.js', 'views/js/*.js'],
            options: {
                reporter: require('jshint-stylish')
            }
        }
    });

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat']); //grunt 명령어로 실행할 작업

};
