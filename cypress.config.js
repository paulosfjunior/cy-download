const { defineConfig } = require('cypress');
const { downloadTasks } = require('./src/index');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', downloadTasks);
    },
    baseUrl: 'http://localhost:8039',
  },
});
