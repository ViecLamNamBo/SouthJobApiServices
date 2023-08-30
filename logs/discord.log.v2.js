const { Client, GatewayIntentBits } = require('discord.js');
const { CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env;

class LoggerServices {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    // add channel Id
    const channelId = CHANNEL_ID_DISCORD;
    this.client.on('ready', () => {
      console.log(`Logger is as ${this.client.user.tag}!`);
    });
    this.client.login(TOKEN_DISCORD);
  }
  sendToFormatCode(logData) {
    const {
      code,
      message = 'This is  some additional about the code ',
      title = 'Code example',
    } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    };
    this.sendToMessage(codeMessage);
  }
  sendToMessage(message = 'message') {
    const channelId = CHANNEL_ID_DISCORD;
    const channel = this.client.channels.cache.get(channelId);
    if (!channel) {
      console.error(`Could't find the channel ...`, channelId);
      return;
    }
    channel.send(message).catch((e) => console.error(e));
  }
}

module.exports = new LoggerServices();
