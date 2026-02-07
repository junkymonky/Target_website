module.exports = function detectSQLi(input) {
  if (!input) return false;

  const patterns = [
    /(\bor\b|\band\b)\s+\d+=\d+/i,
    /union\s+select/i,
    /--/,
    /'/,
    /;/
  ];

  return patterns.some(p => p.test(input));
};
