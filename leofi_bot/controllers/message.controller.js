const { menuMessage } = require("../config/constants");

exports.handleStartCommand = (msg, bot) => {
  const chatId = msg['chat']['id'];
  const welcomeMessage = `
🤖 Welcome *${msg['from']['first_name'] || ''} ${msg['from']['last_name'] || ''}*, to 🌟🚀 *LeoFi Bot* 🌟🚀

LeoFi: Smart DeFi Assistant

${menuMessage}

Feel free to explore my features!
  `;

  return bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
};

exports.handleUnrecognizedCommand = (msg, bot) => {
  const chatId = msg['chat']['id'];
  const unrecognizedMessage = `
😕 I didn't recognize that command.

Here’s what I can do for you:

${menuMessage}
  `;

  return bot.sendMessage(chatId, unrecognizedMessage, { parse_mode: 'Markdown' });
};
