const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged is as ${client.user.tag}`);
});
const token =
  'MTE0MTk4MjgwNjc4NDg3MjQ0OQ.GokHqb.R2F6t0j3HxlB-jR0SO9-bLzZI1WmC3rTXx0z2E';
client.login(token);

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;
  if (msg.content === 'hello') {
    msg.reply('Hello How can i assists you today!');
  }
});
