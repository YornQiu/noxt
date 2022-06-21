const getRawBody = require('./getRawBody')

/**
 * parse text
 * @param {number} limit body size limit, default 56KB
 * @returns {string}
 */
module.exports = async function parseText(limit = 1024 * 56) {
  const req = this
  const length = req.length
  const encoding = req.headers['content-encoding']

  return await getRawBody(req, { length, limit, encoding })
}
