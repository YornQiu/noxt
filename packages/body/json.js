const getRawBody = require('./getRawBody')

/**
 * parse JSON
 * @param {number} limit body size limit, default 1MB
 * @returns {object}
 */
module.exports = async function parseJSON(limit = 1024 * 1024) {
  const req = this
  const length = req.length
  const encoding = req.headers['content-encoding']

  const data = await getRawBody(req, { length, limit, encoding })

  try {
    return data ? JSON.parse(data) : null
  } catch (error) {
    error.status = 400
    error.message = '[Parsing error]: Invalid JSON, only object and array allowed'
    throw error
  }
}
