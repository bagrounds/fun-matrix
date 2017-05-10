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
    [[1, [[1, 2], [3, 4]]], [2, 4], 'row']
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

