const xssRegex = /<[^>]+>/i

function detectXSS(req) {
  const body = JSON.stringify(req.body || {})
  const query = JSON.stringify(req.query || {})
  return xssRegex.test(body) || xssRegex.test(query)
}
