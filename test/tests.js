;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('fun-test')
  var arrange = require('fun-arrange')
  var array = require('fun-array')

  var equalityTests = [
    [[[]], false, 'isMatrix'],
    [[[[]]], false, 'isMatrix'],
    [[[[], [1]]], false, 'isMatrix'],
    [[[[1], [1, 2]]], false, 'isMatrix'],
    [[[[1]]], true, 'isMatrix']
  ].map(arrange({ inputs: 0, predicate: 1, contra: 2 }))
    .map(object.ap({
      predicate: predicate.equalDeep,
      contra: object.get
    }))

  /* exports */
  module.exports = [
    equalityTests
  ].reduce(array.concat, [])
    .map(funTest.sync)
})()

