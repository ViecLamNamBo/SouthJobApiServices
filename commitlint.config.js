module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['ABC-', '#'],
    },
  },
  rules: {
    'references-empty': [2, 'never'],
  },
};
