# Functions
# ---------

{exec} = require 'child_process'

# Tasks
# -----

task 'build', 'Build library', ->
  console.log 'Building date-ext...'
  exec 'node_modules/.bin/uglifyjs date-ext.js > date-ext.min.js', (error) -> throw error if error

task 'docs', 'Create documentation', ->
  console.log 'Generating documentation...'
  exec 'node_modules/.bin/docco date-ext.js', (error) -> throw error if error
