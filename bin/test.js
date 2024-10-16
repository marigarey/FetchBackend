import { configure, processCLIArgs, run } from '@japa/runner'
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'

processCLIArgs(process.argv.splice(2))
configure({
  files: ['tests/**/*.spec.js'],
  plugins: [
    assert(),
    apiClient('http://localhost:8000/api/')
  ],
  exclude: ['node_module/**']
})

run()