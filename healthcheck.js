const { request } = require('http');
require('dotenv').config();

const options = {
  host: process.env.LOCAL,
  path: '/status',
  port: process.env.PORT,
  timeout: process.env.TIMEOUT
}

const req = request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);

  if (res.statusCode == 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.log(`ERROR: ${err.message}`)
  process.exit(1);
});

req.end();
