const supportedEncodings = ['ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'latin1', 'binary', 'hex']

/**
 * Get raw body of a Http stream
 * @param {stream} stream
 * @param {object} options
 * @param {number} options.length
 * @param {number} options.limit
 * @param {function} options.decoder
 * @param {string} options.encoding
 * @return {Promise<string>}
 */
module.exports = function getRawBody(stream, options = {}) {
  const decoder = options.decoder
  const length = options.length
  const limit = options.limit
  const encoding = options.encoding === 'utf-8' || !options.encoding ? 'utf8' : options.encoding

  if (!supportedEncodings.includes(encoding)) {
    throw TypeError(`Unsupported encoding: ${encoding}.
      Only ${supportedEncodings.join(', ')} are supported, or you can use your own decoder.
    `)
  }

  if (limit && length && length > limit) {
    const err = new Error('Request Entity Too Large')
    err.status = 413
    err.length = length
    err.limit = limit
    throw err
  }

  return new Promise(function (resolve, reject) {
    readStream(stream, decoder, encoding, function (err, body) {
      if (err) return reject(err)
      resolve(body)
    })
  })
}

/**
 * Read data from stream.
 * @param {object} stream
 * @param {function} decoder
 * @param {string} encoding
 * @param {function} callback
 */
function readStream(stream, decoder, encoding, callback) {
  let data = ''

  const onData = decoder
    ? (chunk) => {
        data += decoder(chunk)
      }
    : (chunk) => {
        data += chunk.toString(encoding)
      }

  stream.on('data', onData)

  stream.on('end', (err) => {
    if (err) return callback(err)

    return callback(null, data)
  })

  stream.on('error', (err) => {
    callback(err)
  })
}
