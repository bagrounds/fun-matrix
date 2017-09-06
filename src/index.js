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
  var vector = require('fun-vector')
  var type = require('fun-type')
  var object = require('fun-object')
  var guarded = require('guarded')
  var bool = require('fun-boolean')

  var api = {
    addScaledRow: addScaledRow,
    scaleRow: scaleRow,
    swapRows: swapRows,
    vec: vec,
    isMatrix: isMatrix,
    sum: sum,
    set: set,
    setRow: setRow,
    get: get,
    row: row,
    col: col,
    sub: sub,
    dot: dot,
    map: map,
    zero: zero,
    id: id,
    k: k,
    t: t,
    j: j,
    dim: dim,
    scale: scale,
    equal: equal,
    near: near,
    eNear: eNear
  }

  var guards = {
    near: guarded(
      type.tuple([type.num, isMatrix, isMatrix]),
      type.bool
    ),
    eNear: guarded(type.tuple([isMatrix, isMatrix]), type.bool),
    equal: guarded(type.tuple([isMatrix, isMatrix]), type.bool),
    addScaledRow: guarded(
      type.tuple([type.num, type.num, type.num, isMatrix]),
      isMatrix
    ),
    scaleRow: guarded(
      type.tuple([type.num, type.num, isMatrix]),
      isMatrix
    ),
    swapRows: guarded(
      type.tuple([type.num, type.num, isMatrix]),
      isMatrix
    ),
    vec: guarded(type.tuple([isMatrix]), type.arrayOf(type.num)),
    sum: guarded(type.tuple([isMatrix, isMatrix]), isMatrix),
    sub: guarded(type.tuple([isMatrix, isMatrix]), isMatrix),
    map: guarded(type.tuple([type.fun, isMatrix]), isMatrix),
    id: guarded(type.tuple([type.num]), isMatrix),
    dot: guarded(type.tuple([isMatrix, isMatrix]), isMatrix),
    zero: guarded(type.tuple([type.vectorOf(2, type.num)]), isMatrix),
    k: guarded(
      type.tuple([type.vectorOf(2, type.num), type.num]),
      isMatrix
    ),
    j: guarded(
      type.tuple([type.num, type.vectorOf(2, type.num)]),
      isMatrix
    ),
    setRow: guarded(
      type.tuple([type.num, type.arrayOf(type.num), isMatrix]),
      isMatrix
    ),
    set: guarded(
      type.tuple([type.vectorOf(2, type.num), type.num, isMatrix]),
      isMatrix
    ),
    get: guarded(
      type.tuple([type.vectorOf(2, type.num), isMatrix]),
      type.num
    ),
    isMatrix: guarded(type.tuple([type.any]), type.bool),
    dim: guarded(type.tuple([isMatrix]), type.vectorOf(2, type.num)),
    scale: guarded(type.tuple([type.num, isMatrix]), isMatrix),
    t: guarded(type.tuple([isMatrix]), isMatrix),
    row: guarded(
      type.tuple([type.num, isMatrix]),
      type.arrayOf(type.num)
    ),
    col: guarded(
      type.tuple([type.num, isMatrix]),
      type.arrayOf(type.num)
    )
  }

  /* exports */
  module.exports = object.map(fn.curry, object.ap(guards, api))

  /**
   *
   * @function module:fun-matrix.near
   *
   * @param {Number} delta - threshold for nearness
   * @param {Matrix} m1 - first matrix to compare
   * @param {Matrix} m2 - second matrix to compare
   *
   * @return {Boolean} if m1 is delta-near m2 in each component
   */
  function near (delta, m1, m2) {
    return vector.equal(dim(m1), dim(m2)) &&
      bool.all(array.zipWith(vector.near(delta), m1, m2))
  }

  /**
   *
   * @function module:fun-matrix.eNear
   *
   * @param {Matrix} m1 - first matrix to compare
   * @param {Matrix} m2 - second matrix to compare
   *
   * @return {Boolean} if m1 is epsilon-near m2 in each component
   */
  function eNear (m1, m2) {
    return vector.equal(dim(m1), dim(m2)) &&
      bool.all(array.zipWith(vector.eNear, m1, m2))
  }

  /**
   *
   * @function module:fun-matrix.equal
   *
   * @param {Matrix} m1 - first matrix to compare
   * @param {Matrix} m2 - second matrix to compare
   *
   * @return {Boolean} if m1 equals m2 in each component
   */
  function equal (m1, m2) {
    return vector.equal(dim(m1), dim(m2)) &&
      bool.all(array.zipWith(vector.equal, m1, m2))
  }

  /**
   *
   * @function module:fun-matrix.addScaledRow
   *
   * @param {Number} target - index of row to add to
   * @param {Number} source - index of row to add (scaled) to target
   * @param {Number} factor - to scale by source by
   * @param {Matrix} m - matrix to operate on
   *
   * @return {Matrix} m with row source * factor added to target
   */ // eslint-disable-next-line max-params
  function addScaledRow (target, source, factor, m) {
    return setRow(
      target,
      vector.sum(
        row(target, m),
        vector.scale(factor, row(source, m))
      ),
      m
    )
  }

  /**
   *
   * @function module:fun-matrix.scaleRow
   *
   * @param {Number} i - index of row to scale
   * @param {Number} factor - to scale by
   * @param {Matrix} m - matrix to scale row on
   *
   * @return {Matrix} m with row i scaled by factor
   */
  function scaleRow (i, factor, m) {
    return setRow(i, vector.scale(factor, row(i, m)), m)
  }

  /**
   *
   * @function module:fun-matrix.swapRows
   *
   * @param {Number} r1 - a row to swap
   * @param {Number} r2 - another row to swap
   * @param {Matrix} m - matrix
   *
   * @return {Matrix} m with rows r1 and r2 swapped
   */
  function swapRows (r1, r2, m) {
    var temp = row(r1, m)
    return setRow(r2, temp, setRow(r1, row(r2, m), m))
  }

  /**
   *
   * @function module:fun-matrix.vec
   *
   * @param {Matrix} m - matrix to vectorize
   *
   * @return {Vector} of columns of m
   */
  function vec (m) {
    return array.fold(array.concat, [], m)
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
   * @param {Vector} coord - coordinate to set to 1
   *
   * @return {Matrix} square zero matrix of size n with coord set to 1
   */
  function j (n, coord) {
    return set(coord, 1, zero([n, n]))
  }

  /**
   *
   * @function module:fun-matrix.setRow
   *
   * @param {Number} n - row index to set
   * @param {Vector} row - to set
   * @param {Matrix} matrix - to set row on
   *
   * @return {Matrix} matrix with row n set to row
   */
  function setRow (n, row, matrix) {
    return matrix.map(function (column, i) {
      return array.set(n, row[i], column)
    })
  }

  /**
   *
   * @function module:fun-matrix.set
   *
   * @param {Vector} coord - coordinate of value to set
   * @param {Number} value - to set
   * @param {Matrix} matrix - to set the value on
   *
   * @return {Matrix} matrix with element at coord changed to value
   */
  function set (coord, value, matrix) {
    return array.set(
      coord[1],
      array.set(coord[0], value, matrix[coord[1]]),
      matrix
    )
  }

  /**
   *
   * @function module:fun-matrix.get
   *
   * @param {Vector} coord - coordinate of value to get
   * @param {Matrix} matrix - to get the value from
   *
   * @return {Number} value at matrix coordinate coord
   */
  function get (coord, matrix) {
    return matrix[coord[1]][coord[0]]
  }

  /**
   *
   * @function module:fun-matrix.isMatrix
   *
   * @param {*} m - candidate to check
   *
   * @return {Boolean} if m is a valid matrix
   */
  function isMatrix (m) {
    return type.matrixOf(type.num, m) &&
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
   * @return {Vector} [numRows, numColumns]
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

