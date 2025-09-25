const logger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.originalUrl
  const ip = req.ip || req.connection.remoteAddress

  console.log(`[${timestamp}] ${method} ${url} - ${ip}`)

  // Log request body for POST/PUT requests (excluding sensitive data)
  if ((method === "POST" || method === "PUT") && req.body) {
    const logBody = { ...req.body }
    // Remove sensitive fields
    delete logBody.otp
    delete logBody.password

    if (Object.keys(logBody).length > 0) {
      console.log(`[${timestamp}] Request body:`, JSON.stringify(logBody, null, 2))
    }
  }

  next()
}

module.exports = logger
