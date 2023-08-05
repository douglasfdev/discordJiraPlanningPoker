import { request, createServer } from 'http';
import 'dotenv/config';
import { ExtendedClient } from './ExtendedClient';

const discordClient = new ExtendedClient()
discordClient.start();

const server = createServer((req, res) => {
  const status = req.url === '/status';

  if (!status) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Not Found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  const statusResponse = { status: 'Server is running' };
  res.end(JSON.stringify(statusResponse));
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export { discordClient };