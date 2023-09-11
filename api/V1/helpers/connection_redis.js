const { createClient } = require('redis');

const client = createClient({
  username: 'default',
  password: '9JMzUPBERZAiQBKbRtDEn4P4ZrogKUGx',
  socket: {
    host: 'redis-11543.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 11543,
    ttl: true,
  },
});
(async () => {
  await client.connect();
})();

console.log('Connecting to the Redis');

client.on('ready', () => {
  console.log('Redis Connected!');
});

client.on('error', (err) => {
  console.log('Error in the Connection', err);
});
module.exports = client;
