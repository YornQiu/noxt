const qs = require('querystring')
const getRawBody = require('./getRawBody')

/**
 * parse urlencoded
 * @param {number} limit body size limit, default 56KB
 * @returns {object}
 */
module.exports = async function parseUrlencoded(limit = 1024 * 56) {
  const req = this
  const length = req.length
  const encoding = req.headers['content-encoding']

  const data = await getRawBody(req, { length, limit, encoding })

  try {
    return data ? qs.parse(data) : null
  } catch (error) {
    error.status = 400
    error.message = '[Parsing error]: Invalid urlencoded'
    throw error
  }
}
