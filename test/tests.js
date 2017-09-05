;(function () {
  'use strict'

  /* imports */
  var setProp = require('set-prop')
  var fn = require('fun-function')
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('fun-test')
  var arrange = require('fun-arrange')
  var array = require('fun-array')
  var generate = require('fun-generator')
  var properties = require('./properties')

  function mByNMatrix (pair) {
    return generate.arrayOf(
      generate.arrayOf(generate.integer(-100, 100)),
      array.map(
        array.sequence(Math.random),
        array.sequence(fn.k(pair[1]), pair[0])
      )
    )
  }

  function wrapSyncTest (test) {
    return setProp('name', test.name, function (subject, callback) {
      callback(null, test(subject))
    })
  }

  function monoidProperty (dim) {
    return properties.monoid(
      fn.k(predicate.equalDeep),
      object.get('sum'),
      fn.compose(fn.apply([dim]), object.get('zero')),
      array.map(mByNMatrix, array.repeat(3, array.reverse(dim)))
    )
  }

  var propertyTests = array.map(monoidProperty, array.cartesian(
    array.range(1, 4),
    array.range(1, 4)
  )).map(wrapSyncTest)

  var equalityTests = [
    [[0, 1, 3, [[1, 2], [3, 4]]], [[7, 2], [15, 4]], 'addScaledRow'],
    [[0, 3, [[1, 2], [3, 4]]], [[3, 2], [9, 4]], 'scaleRow'],
    [[0, 1, [[1, 2], [3, 4]]], [[2, 1], [4, 3]], 'swapRows'],
    [[1, [1, 2], [[0, 0], [0, 0]]], [[0, 1], [0, 2]], 'setRow'],
    [[0, [1, 2], [[0, 0], [0, 0]]], [[1, 0], [2, 0]], 'setRow'],
    [[[[1]]], [1], 'vec'],
    [[[[1, 2]]], [1, 2], 'vec'],
    [[[[1], [2]]], [1, 2], 'vec'],
    [[[[1, 2], [3, 4]]], [1, 2, 3, 4], 'vec'],
    [[[[1, 2], [3, 4], [5, 6]]], [1, 2, 3, 4, 5, 6], 'vec'],
    [[[]], false, 'isMatrix'],
    [[[[]]], false, 'isMatrix'],
    [[[[], [1]]], false, 'isMatrix'],
    [[[[1], [1, 2]]], false, 'isMatrix'],
    [[['1']], false, 'isMatrix'],
    [[[[1]]], true, 'isMatrix'],
    [[[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [[6, 8], [10, 12]], 'sum'],
    [[[[1, 2], [3, 4]], [[5, 6], [7, 8]]], [[4, 4], [4, 4]], 'sub'],
    [[[[1, 2], [3, 4]], [[1, 0], [0, 1]]], [[1, 2], [3, 4]], 'dot'],
    [[[[1, 0], [0, 1]], [[1, 2], [3, 4]]], [[1, 2], [3, 4]], 'dot'],
    [[[[1, 1], [1, 1]], [[1, 1], [1, 1]]], [[2, 2], [2, 2]], 'dot'],
    [[[2, 2]], [[0, 0], [0, 0]], 'zero'],
    [[[1, 2]], [[0], [0]], 'zero'],
    [[[2, 1]], [[0, 0]], 'zero'],
    [[1], [[1]], 'id'],
    [[2], [[1, 0], [0, 1]], 'id'],
    [[[2, 2], 7], [[7, 7], [7, 7]], 'k'],
    [[[1, 2], 8], [[8], [8]], 'k'],
    [[[[1]]], [[1]], 't'],
    [[[[1, 2]]], [[1], [2]], 't'],
    [[[[1], [2]]], [[1, 2]], 't'],
    [[2, [0, 0]], [[1, 0], [0, 0]], 'j'],
    [[2, [0, 1]], [[0, 0], [1, 0]], 'j'],
    [[2, [1, 0]], [[0, 1], [0, 0]], 'j'],
    [[2, [1, 1]], [[0, 0], [0, 1]], 'j'],
    [[[[0]]], [1, 1], 'dim'],
    [[[[0], [1]]], [1, 2], 'dim'],
    [[[[0, 1]]], [2, 1], 'dim'],
    [[[[0, 1], [2, 3]]], [2, 2], 'dim'],
    [[3, [[1, 2], [3, 4]]], [[3, 6], [9, 12]], 'scale'],
    [[0, [[1, 2], [3, 4]]], [1, 3], 'row'],
    [[1, [[1, 2], [3, 4]]], [2, 4], 'row'],
    [[[0, 0], 9, [[1, 2], [3, 4]]], [[9, 2], [3, 4]], 'set'],
    [[[0, 1], 8, [[1, 2], [3, 4]]], [[1, 2], [8, 4]], 'set'],
    [[[1, 0], 7, [[1, 2], [3, 4]]], [[1, 7], [3, 4]], 'set'],
    [[[1, 1], 6, [[1, 2], [3, 4]]], [[1, 2], [3, 6]], 'set'],
    [[[0, 0], [[1, 2], [3, 4]]], 1, 'get'],
    [[[0, 1], [[1, 2], [3, 4]]], 3, 'get'],
    [[[1, 0], [[1, 2], [3, 4]]], 2, 'get'],
    [[[1, 1], [[1, 2], [3, 4]]], 4, 'get']
  ].map(arrange({ inputs: 0, predicate: 1, contra: 2 }))
    .map(object.ap({
      predicate: predicate.equalDeep,
      contra: object.get
    }))

  /* exports */
  module.exports = propertyTests.concat(
    equalityTests.map(funTest.sync)
  )
})()

