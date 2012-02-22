# Commands
# --------

DOCS   = '`which docco`'
MINIFY = '`which uglifyjs`'

# Functions
# ---------

{exec} = require 'child_process'

# Tasks
# -----

task 'build', 'Build library', ->
  console.log 'Building date.js...'
  exec "#{MINIFY} date.js > date.min.js", (error) -> throw error if error

task 'docs', 'Create documentation', ->
  console.log 'Generating documentation...'
  exec "#{DOCS} date.js", (error) -> throw error if error