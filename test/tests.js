;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var object = require('fun-object')
  var funTest = require('fun-test')
  var arrange = require('fun-arrange')
  var array = require('fun-array')
  var fn = require('fun-function')
  var curry = require('fun-curry')

  function makeMatrix (value, dim) {
    return array.repeat(dim[0], array.repeat(dim[1], value))
  }

  function generateDimensions (to) {
    return array.partition(
      array.any(predicate.equal(0)),
      array.cartesianN(array.repeat(2, array.index(to)))
    )
  }

  var isValid = fn.composeAll([
    array.map(array.ap([array.of])),
    array.fold(array.concat, []),
    array.map(array.map(array.append('isValid'))),
    array.ap([
      array.map(array.append(false)),
      array.map(array.append(true))
    ]),
    array.map(array.map(array.of)),
    array.map(array.map(curry(makeMatrix)(0))),
    generateDimensions
  ])(5)

  /* exports */
  module.exports = [
    isValid
  ].reduce(array.concat, [])
    .map(arrange({ inputs: 0, predicate: 1, contra: 2 }))
    .map(object.ap({
      predicate: predicate.equal,
      contra: object.get
    }))
    .map(funTest.sync)
})()

