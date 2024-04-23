const { PORT } = require('./config');
const app = require('./app');

const server = app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});

module.exports = server;
