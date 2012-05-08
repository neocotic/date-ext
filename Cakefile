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
  console.log 'Building date-ext...'
  exec "#{MINIFY} date-ext.js > date-ext.min.js", (error) -> throw error if error

task 'docs', 'Create documentation', ->
  console.log 'Generating documentation...'
  exec "#{DOCS} date-ext.js", (error) -> throw error if error