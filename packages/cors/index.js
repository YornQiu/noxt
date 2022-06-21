/**
 * @param {object} options
 * @param {string|Function} options.origin Access-Control-Allow-Origin. Default is request's origin
 * @param {boolean|Function} options.credentials Access-Control-Allow-Credentials.
 * @param {number} options.maxAge Access-Control-Max-Age.
 * @param {string|string[]} options.allowHeaders Access-Control-Allow-Methods. Default is requrest's Access-Control-Request-Headers
 * @param {string|string[]} options.allowMethods Access-Control-Allow-Headers. Default is GET,PUT,HEAD,POST,DELETE,PATCH
 * @param {string|string[]} options.exposeHeaders Access-Control-Expose-Headers.
 * @param {boolean} options.secureContext  Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy. Default is false
 * @param {boolean} options.privateNetworkAccess Access-Control-Allow-Private-Network. Default is false
 * @returns
 */
module.exports = function (options) {
  const defaults = {
    allowMethods: 'GET,PUT,HEAD,POST,DELETE,PATCH',
    secureContext: false,
  }

  options = { ...defaults, ...options }

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',')
  }

  return async function cors(req, res) {
    const { origin: reqOrigin, method } = req

    if (!reqOrigin) return

    let { origin = reqOrigin, credentials } = options

    const {
      maxAge,
      allowMethods,
      allowHeaders = req.get('Access-Control-Request-Headers'),
      exposeHeaders,
      secureContext,
      privateNetworkAccess,
    } = options

    if (typeof origin === 'function') {
      origin = origin(req)
      if (!origin) return
    }

    if (typeof credentials === 'function') {
      credentials = credentials(req)
    }

    if (method === 'OPTIONS') {
      // preflight request method is required
      if (!req.get('Access-Control-Request-Method')) {
        return
      }

      res.set('Access-Control-Allow-Origin', origin)

      if (credentials) {
        res.set('Access-Control-Allow-Credentials', 'true')
      }

      if (secureContext) {
        res.set('Cross-Origin-Opener-Policy', 'same-origin')
        res.set('Cross-Origin-Embedder-Policy', 'require-corp')
      }

      if (privateNetworkAccess && req.get('Access-Control-Request-Private-Network')) {
        res.set('Access-Control-Allow-Private-Network', 'true')
      }

      if (maxAge) {
        res.set('Access-Control-Max-Age', maxAge)
      }

      if (allowMethods) {
        res.set('Access-Control-Allow-Methods', Array.isArray(allowMethods) ? allowMethods.join(',') : allowMethods)
      }

      if (allowHeaders) {
        res.set('Access-Control-Allow-Headers', Array.isArray(allowHeaders) ? allowHeaders.join(',') : allowHeaders)
      }

      res.status = 204
    } else {
      res.set('Access-Control-Allow-Origin', origin)

      if (credentials === true) {
        res.set('Access-Control-Allow-Credentials', 'true')
      }

      if (secureContext) {
        res.set('Cross-Origin-Opener-Policy', 'same-origin')
        res.set('Cross-Origin-Embedder-Policy', 'require-corp')
      }

      if (exposeHeaders) {
        res.set('Access-Control-Expose-Headers', Array.isArray(exposeHeaders) ? exposeHeaders.join(',') : exposeHeaders)
      }
    }
  }
}
