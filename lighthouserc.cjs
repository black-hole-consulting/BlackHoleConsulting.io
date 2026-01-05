module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/mentions-legales',
        'http://localhost:4321/cgv',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
