const getRawBody = require('./getRawBody')

/**
 * parse multipart
 * @param {number} limit body size limit, default 10MB
 * @returns {object}
 */
module.exports = async function parseMultipart(limit = 1024 * 1024 * 10) {
  const req = this
  const length = req.length
  const encoding = req.headers['content-encoding']

  const data = await getRawBody(req, { length, limit, encoding })
}
