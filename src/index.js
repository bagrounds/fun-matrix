/**
 * A 2 dimensional array of numbers (where each inner array is the same length)
 * @typedef {Array<Array<Number>>} Matrix
 */

/**
 * An array of numbers
 * @typedef {Array<Number>} Vector
 */

/**
 *
 * @module fun-matrix
 */
;(function () {
  'use strict'

  /* imports */
  var array = require('fun-array')
  var fn = require('fun-function')
  var predicate = require('fun-predicate')
  var vector = require('fun-vector')
  var lens = require('fun-lens')

  /* exports */
  module.exports = {
    isValid: isValid,
    sum: fn.curry(sum),
    set: fn.curry(set),
    get: fn.curry(get),
    row: fn.curry(row),
    sub: fn.curry(sub),
    dot: fn.curry(dot),
    map: fn.curry(map),
    zero: zero,
    id: id,
    k: fn.curry(k),
    t: t,
    j: fn.curry(j),
    dim: dim,
    scale: fn.curry(scale)
  }

  /**
   *
   * @function module:fun-matrix.sum
   *
   * @param {Matrix} m1 - summand
   * @param {Matrix} m2 - summand
   *
   * @return {Matrix} m1 + m2
   */
  function sum (m1, m2) {
    return array.zipWith(vector.sum, m1, m2)
  }

  /**
   *
   * @function module:fun-matrix.sub
   *
   * @param {Matrix} m1 - subtrahend
   * @param {Matrix} m2 - minuend
   *
   * @return {Matrix} m2 - m1
   */
  function sub (m1, m2) {
    return array.zipWith(vector.sub, m1, m2)
  }

  /**
   *
   * @function module:fun-matrix.map
   *
   * @param {Function} f - (value, i, j) -> value'
   * @param {Matrix} m - matrix to map over
   *
   * @return {Matrix} with each element mapped by f
   */
  function map (f, m) {
    return m.map(function (column, j) {
      return column.map(function (value, i) {
        return f(value, i, j)
      })
    })
  }

  /**
   *
   * @function module:fun-matrix.id
   *
   * @param {Number} n - size of identity matrix to return
   *
   * @return {Matrix} n by n identity matrix
   */
  function id (n) {
    return map(oneIfDiagonal, zero([n, n]))

    function oneIfDiagonal (v, i, j) {
      return i === j ? 1 : 0
    }
  }

  /**
   *
   * @function module:fun-matrix.dot
   *
   * @param {Matrix} m1 - multiplier
   * @param {Matrix} m2 - multiplicand
   *
   * @return {Matrix} m1 * m2
   */
  function dot (m1, m2) {
    return map(ijDot, zero([dim(m1)[0], dim(m2)[1]]))

    function ijDot (v, i, j) {
      return vector.dot(row(i, m1), col(j, m2))
    }
  }

  /**
   *
   * @function module:fun-matrix.zero
   *
   * @param {Array<Number>} dim - of zero matrix to return
   *
   * @return {Matrix} zero matrix
   */
  function zero (dim) {
    return k(dim, 0)
  }

  /**
   *
   * @function module:fun-matrix.k
   *
   * @param {Array<Number>} dim - dimensions of matrix to make
   * @param {Number} value - of each element of matrix to return
   *
   * @return {Matrix} with dimension dim where every element is value
   */
  function k (dim, value) {
    return Array.apply(null, { length: dim[1] })
      .map(fn.k(vector.k(dim[0], value)))
  }

  /**
   *
   * @function module:fun-matrix.j
   *
   * @param {Number} n - dimension of square matrix to return
   * @param {Number} coord - coordinate to set to 1
   *
   * @return {Matrix} square zero matrix of size n with coord set to 1
   */
  function j (n, coord) {
    return set(coord[0], coord[1], 1, zero([n, n]))
  }

  /**
   *
   * @function module:fun-matrix.set
   *
   * @param {Number} i - row index
   * @param {Number} j - column index
   * @param {Number} value - to set
   * @param {Matrix} matrix - to set the value on
   *
   * @return {Matrix} square zero matrix of size n with coord set to 1
   */
  function set (i, j, value, matrix) { // eslint-disable-line max-params
    return array.set(j, array.set(i, value, matrix[j]), matrix)
  }

  /**
   *
   * @function module:fun-matrix.get
   *
   * @param {Number} i - row index
   * @param {Number} j - column index
   * @param {Matrix} matrix - to get the value from
   *
   * @return {Number} value at matrix row i, column j
   */
  function get (i, j, matrix) {
    return lens.get([j, i], matrix)
  }

  /**
   *
   * @function module:fun-matrix.isValid
   *
   * @param {*} m - candidate to check
   *
   * @return {Boolean} if m is a valid matrix
   */
  function isValid (m) {
    return predicate.type('[[Number]]', m) &&
      m.length > 0 &&
      m[0].length > 0 &&
      m.map(vector.dim)
       .reduce(function (result, length) {
         return result && length === m[0].length
       }, true)
  }

  /**
   *
   * @function module:fun-matrix.dim
   *
   * @param {Matrix} m - matrix to check dimensions of
   *
   * @return {Array<Number>} [numRows, numColumns]
   */
  function dim (m) {
    return [m[0].length, m.length]
  }

  /**
   *
   * @function module:fun-matrix.scale
   *
   * @param {Number} n - factor to scale by
   * @param {Matrix} m - matrix to scale
   *
   * @return {Matrix} m scaled by n
   */
  function scale (n, m) {
    return m.map(vector.scale(n))
  }

  /**
   *
   * @function module:fun-matrix.t
   *
   * @param {Matrix} m - matrix to transpose
   *
   * @return {Matrix} transpose of m
   */
  function t (m) {
    return m[0].map(function (v, i) {
      return row(i, m)
    })
  }

  /**
   *
   * @function module:fun-matrix.row
   *
   * @param {Number} i - index of row to get from matrix
   * @param {Matrix} m - matrix to get row of
   *
   * @return {Vector} nth row of m
   */
  function row (i, m) {
    return m.map(function (column) {
      return column[i]
    })
  }

  /**
   *
   * @function module:fun-matrix.col
   *
   * @param {Number} i - index of column to get from matrix
   * @param {Matrix} m - matrix to get column of
   *
   * @return {Vector} ith column of m
   */
  function col (i, m) {
    return m[i]
  }
})()

