const failedAttempts = {}

function recordFailure(ip) {
  const now = Date.now()

  if (!failedAttempts[ip]) {
    failedAttempts[ip] = []
  }

  // keep only last 60 seconds
  failedAttempts[ip] = failedAttempts[ip].filter(t => now - t < 60000)

  failedAttempts[ip].push(now)

  return failedAttempts[ip].length >= 5
}
