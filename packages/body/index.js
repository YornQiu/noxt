const parseJSON = require('./json')
const parseUrlencoded = require('./urlencoded')
const parseText = require('./text')
const parseMultipart = require('./multipart')

module.exports = function (req) {
  defineValue(req, 'json', parseJSON)

  defineValue(req, 'urlencoded', parseUrlencoded)

  defineValue(req, 'text', parseText)

  defineValue(req, 'multipart', parseMultipart)

  defineValue(req, 'body', body)
}

/**
 * parse body by conten-type
 * @param {number} limit body size limit
 * @returns {string|object}
 */
function body(limit) {
  const contentType = this.type

  const type = getType(contentType)

  switch (type) {
    case 'json':
      return this.json(limit)
    case 'urlencoded':
      return this.urlencoded(limit)
    case 'text':
      return this.text(limit)
    case 'multipart':
      return this.multipart(limit)

    default: {
      const err = new TypeError(`Unsupported Media Type: ${type}`)
      err.status = 415
      err.type = type
      throw err
    }
  }
}

/**
 * return common type from given mime-type
 * @param {string} type mime-type
 * @returns {string} type
 */
function getType(type) {
  const jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
  ]

  const urlencodedTypes = ['application/x-www-form-urlencoded']

  if (jsonTypes.includes(type)) {
    return 'json'
  }

  if (urlencodedTypes.includes(type)) {
    return 'urlencoded'
  }

  if (/text\/*/.test(type)) {
    return 'text'
  }

  if (/multipart\/*/.test(type)) {
    return 'multipart'
  }

  return type
}

/**
 * Helper function for creating a setter on an object.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} setter
 * @private
 */
function defineValue(obj, name, value) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    value,
  })
}
