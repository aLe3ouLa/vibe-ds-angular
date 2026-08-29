module.exports = {
  source: ['tokens/*.tokens.json'],
  platforms: {
    primitives: {
      transforms: ['attribute/cti', 'name/kebab'],
      buildPath: 'src/lib/styles/',
      files: [
        {
          destination: '_primitives.scss',
          format: 'scss/variables',
          filter: (token) => token.filePath.endsWith('primitives.tokens.json'),
        },
      ],
    },
    semantic: {
      transforms: ['attribute/cti', 'name/kebab'],
      prefix: 'ds',
      buildPath: 'src/lib/styles/',
      files: [
        {
          destination: '_semantic.scss',
          format: 'css/variables',
          filter: (token) => {
            if (token.filePath.endsWith('semantic.tokens.json')) return true;
            if (token.filePath.endsWith('typography.tokens.json')) return true;
            if (token.filePath.endsWith('primitives.tokens.json')) {
              return token.path[0] === 'space' || token.path[0] === 'radius';
            }
            return false;
          },
        },
      ],
    },
  },
};
