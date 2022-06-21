const { resolve } = require('path')
const assert = require('assert')

/**
 * Serve files in root directory
 * @param {string} root
 * @param {object} options
 * @returns
 */
module.exports = function (root, options) {
  assert(root, 'root is required')
  options = Object.assign({}, options)

  // options
  options.root = resolve(root)
  options.index = options.index === false ? false : options.index || 'index.html'

  return async function (req, res) {
    // serve only on GET or HEAD requests
    if (req.method !== 'HEAD' && req.method !== 'GET') return
    // response is already handled
    if (res.body != null || res.status !== 404) return

    try {
      await res.send(req.path, options)
    } catch (err) {
      if (err.status !== 404) {
        throw err
      }
    }
  }
}
