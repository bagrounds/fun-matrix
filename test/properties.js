;(function () {
  'use strict'

  /* imports */
  var fn = require('fun-function')
  var guarded = require('guarded')
  var type = require('fun-type')
  var object = require('fun-object')

  var api = {
    leftId: leftId,
    rightId: rightId,
    associative: associative,
    monoid: monoid
  }

  var guards = {
    leftId: guarded(
      type.tuple([type.fun, type.fun, type.fun, type.any, type.any]),
      type.bool
    ),
    rightId: guarded(
      type.tuple([type.fun, type.fun, type.fun, type.any, type.any]),
      type.bool
    ),
    associative: guarded(
      type.tuple([type.fun, type.fun, type.vector(3), type.any]),
      type.bool
    ),
    monoid: guarded(
      type.tuple([type.fun, type.fun, type.fun, type.vector(3), type.any]),
      type.bool
    )
  }

  /* exports */
  module.exports = object.map(fn.curry, object.ap(guards, api))

  // eslint-disable-next-line max-params
  function monoid (getEq, getOp, getUnit, as, s) {
    return leftId(getEq, getOp, getUnit, as[0], s) &&
      rightId(getEq, getOp, getUnit, as[1], s) &&
      associative(getEq, getOp, as, s)
  }

  // eslint-disable-next-line max-params
  function leftId (getEq, getOp, getUnit, a, s) {
    var eq = getEq(s)
    var op = getOp(s)
    var unit = getUnit(s)

    return eq(op(unit, a), a)
  }

  // eslint-disable-next-line max-params
  function rightId (getEq, getOp, getUnit, a, s) {
    var eq = getEq(s)
    var op = getOp(s)
    var unit = getUnit(s)

    return eq(op(a, unit), a)
  }

  // eslint-disable-next-line max-params
  function associative (getEq, getOp, as, s) {
    var op = getOp(s)
    var eq = getEq(s)

    return eq(
      op(op(as[0], as[1]), as[2]),
      op(as[0], op(as[1], as[2]))
    )
  }
})()
