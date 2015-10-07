module.exports = function(grunt) {
	grunt.initConfig({
		dstPath: 'public/',
		srcPath: 'source/',
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dev: {
				files: {
					'<%= dstPath %>responsivizr.css': '<%= srcPath %>scss/responsivizr.scss'
				}
			}
		},
		import: {
			dev: {
				files: {
					'<%= dstPath %>responsivizr.js': '<%= srcPath %>js/responsivizr.js'
				}
			}
		},
		watch: {
			css: {
				files: '<%= srcPath %>scss/**/*.scss',
				tasks: ['sass'],
				options: {
					livereload: true
				}
			},
      import: {
        files: '<%= srcPath %>js/**/*.js',
				tasks: ['import']
      },
      js: {
        files: '<%= dstPath %>js/*.js',
        options: {
          spawn: false
        }
      },
			html: {
				files: '<%= dstPath %>*.html',
				options: {
					spawn: false
				}
			},
		},
		browserSync: {
			dev: {
				bsFiles: {
					src: '<%= dstPath %>*.*'
				},
				options: {
					watchTask: true,
					server: '<%= dstPath %>'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-import');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.registerTask('default', ['sass', 'import', 'browserSync', 'watch']);
}
