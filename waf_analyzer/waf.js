const { logAttack } = require('./logger')
const { getSeverity } = require('./severity')

/* =======================
   ATTACK PATTERNS
======================= */
const sqlPatterns = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /\bOR\b.+\=/i,
  /UNION.+SELECT/i,
  /SELECT.+FROM/i
]

const xssPattern = /<[^>]+>/i

/* =======================
   BRUTE FORCE TRACKER
======================= */
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

/* =======================
   WAF MIDDLEWARE
======================= */
module.exports = function waf(req, res, next) {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    req.ip

  const endpoint = req.originalUrl
  const userAgent = req.headers['user-agent']

  const payload = JSON.stringify({
    body: req.body,
    query: req.query,
    headers: req.headers
  })

  /* ---------- SQL INJECTION ---------- */
  for (const pattern of sqlPatterns) {
    if (pattern.test(payload)) {
      const attackType = 'SQL_INJECTION'
      const severity = getSeverity(attackType)

      console.log('🚨 SQL INJECTION DETECTED', { ip, endpoint })

      logAttack({
        ip,
        attackType,
        severity,
        endpoint,
        payload,
        userAgent
      })

      return res.status(403).send('🚫 Request blocked by WAF')
    }
  }

  /* ---------- XSS ---------- */
  if (xssPattern.test(payload)) {
    const attackType = 'XSS'
    const severity = getSeverity(attackType)

    console.log('🚨 XSS ATTACK DETECTED', { ip, endpoint })

    logAttack({
      ip,
      attackType,
      severity,
      endpoint,
      payload,
      userAgent
    })

    return res.status(403).send('🚫 XSS Attempt Blocked')
  }

  /* ---------- BRUTE FORCE (AFTER RESPONSE) ---------- */
  res.on('finish', () => {
    if (req.path === '/login' && res.statusCode === 401) {
      if (recordFailure(ip)) {
        const attackType = 'BRUTE_FORCE'
        const severity = getSeverity(attackType)

        console.log('🚨 BRUTE FORCE DETECTED', ip)

        logAttack({
          ip,
          attackType,
          severity,
          endpoint,
          payload,
          userAgent
        })
      }
    }
  })

  next()
}
