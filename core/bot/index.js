const { Telegraf } = require('telegraf');
const fs = require('fs');
const config = require('./config.js');
let token = config['Bot']['Token'];
const client = new Telegraf(token);

let path = './commands/';
fs.readdirSync(path).forEach(function (file) {
  if (file.endsWith('.js')) {
    client.use(require(path + file));
  }
});

client.telegram.getMe().then((bot) => {
  console.log(`<< Neveline >> Bot started: @${bot.username}`);
});

process.on('unhandledRejection', (reason) => {
  console.log(reason);
});

process.on('uncaughtException', (reason) => {
  console.log(reason);
});

process.on('uncaughtExceptionMonitor', (reason) => {
  console.log(reason);
});

client.launch();
process.once('SIGINT', () => client.stop('SIGINT'));
process.once('SIGTERM', () => client.stop('SIGTERM'));
