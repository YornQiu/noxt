const { URL } = require('url')
const qs = require('querystring')

/**
 * Parse request
 * @param {http.req} req
 * @returns
 */
module.exports = function request(req) {
  defineGetter(req, 'protocol', function () {
    if (req.socket.encrypted) return 'https'

    const proto = req.headers['x-forwarded-proto']
    return proto ? proto.split(/\s*,\s*/, 1)[0] : 'http'
  })

  defineGetter(req, 'host', function () {
    const { headers, httpVersionMajor } = req
    const host = headers['x-forwarded-host'] || (httpVersionMajor >= 2 ? headers[':authority'] : headers['host'])

    if (!host) return ''
    return host.split(/\s*,\s*/, 1)[0]
  })

  defineGetter(req, 'hostname', function () {
    const host = req.host
    if (!host) return ''
    // IPv6
    return host[0] === '[' ? req.URL.hostname : host.split(':', 1)[0]
  })

  defineGetter(req, 'origin', function () {
    return `${req.protocol}://${req.host}`
  })

  defineGetter(req, 'URL', function () {
    return new URL(`${req.origin}${req.url}`)
  })

  defineGetter(req, 'pathname', function () {
    return req.URL.pathname
  })

  defineGetter(req, 'path', function () {
    return req.pathname
  })

  defineGetter(req, 'search', function () {
    return req.URL.search
  })

  defineGetter(req, 'querystring', function () {
    return req.search ? req.search.slice(1) : ''
  })

  defineGetter(req, 'query', function () {
    return req.querystring ? qs.parse(req.querystring) : undefined
  })

  defineGetter(req, 'ip', function () {
    return req.socket.remoteAddress || ''
  })

  defineGetter(req, 'type', function () {
    return req.get('content-type')
  })

  defineGetter(req, 'length', function () {
    return req.get('content-length')
  })

  Object.defineProperty(req, 'get', {
    configurable: true,
    enumerable: true,
    value: function (field) {
      field = field.toLowerCase()
      if (field === 'referer' || field === 'referrer') {
        return req.headers.referer || req.headers.referrer
      }
      return req.headers[field]
    },
  })

  return req
}

/**
 * Helper function for creating a getter on an object.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} getter
 * @private
 */
function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter,
  })
}
