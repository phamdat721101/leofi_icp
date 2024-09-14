const { profileController } = require('../controllers');
const { recognizedCommands } = require('../config/constants');
const processingCommands = require('../config/stateManager');


module.exports = (bot) => {
    /**
     * Handles the /start command to initiate interaction with the bot.
     * 
     * @param {Object} msg - The message object received from the Telegram API.
     */
    bot.onText(/\/profile_tracker/, (msg) => {
        processingCommands.set(msg['chat']['id'], true);

        bot.sendMessage(msg['chat']['id'], '🔍 Please provide the name of profile you want to get data for (PQD):');

        bot.once('message', async (responseMsg) => {
            const profileName = responseMsg['text'].trim().toLowerCase();
            if (profileName) await profileController.getProfileData(msg, bot, profileName);
            else bot.sendMessage(msg['chat']['id'], '🚨🚫 Invalid profile name. Please try again with a valid profile.');
            processingCommands.delete(msg['chat']['id']);
        });        
    });
};
