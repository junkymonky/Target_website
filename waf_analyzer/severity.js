function getSeverity(attackType) {
  switch (attackType) {
    case 'SQL_INJECTION':
      return 'CRITICAL';
    case 'XSS':
      return 'HIGH';
    case 'BRUTE_FORCE':
      return 'WARNING';
    case 'SUSPICIOUS_IP':
      return 'INFO';
    default:
      return 'LOW';
  }
}

module.exports = { getSeverity };
