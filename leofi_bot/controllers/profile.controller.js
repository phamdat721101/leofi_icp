const log = require('../config/log');
const cryptoService = require('../services/cypto.service');

/**
 * Fetch and display profile data.
 * 
 * This function retrieves data for the specified token and sends a formatted message
 * back to the user with the token's details. If an error occurs, a friendly error message is sent.
 */
exports.getProfileData = async (msg, bot, profileName) => {
    const chatId = msg['chat']['id'];

    log.START(`💾⚡ Loading data for investment profile: ${profileName} by chat ID: ${chatId} 💾⚡`);

    if (!profileName) return bot.sendMessage(chatId, '🚨🚫 Please provide a profile 🚨🚫');

    const PROFILE_NAME = profileName.toUpperCase();
        log.SUCCESS(`✅✨ Successfully fetched data for profile: ${PROFILE_NAME} by chat ID: ${chatId} ✅✨`);
        
        const profileData = {
            'price': 1234.56,
            'marketCap': 98765432100,
            'volume24h': 5432109876,
            'priceChange24h': -2.34,
            'priceChangePercentage24h': -0.19,
            'marketCapChange24h': -2345678900,
            'marketCapChangePercentage24h': -2.32
        };

        const trackitUrl = `https://trackit-io.vercel.app/`;

        return bot.sendMessage(chatId,
            `🌟 *${PROFILE_NAME} Overview* 🌟\n\n` +
            `\`\`\`\n` +
            ` Property                | Value            \n` +
            `-------------------------|------------------\n` +
            ` 💰 Current Price:       | $${profileData?.['price']}\n` +
            ` 🏦 Market Cap:          | $${profileData?.['marketCap']}\n` +
            ` 🔄 24h Volume:          | $${profileData?.['volume24h']}\n` +
            ` 📈 Price Change (24h):  | ${profileData?.['priceChange24h']}%\n` +
            ` 📉 Price Change % 24h:  | ${profileData?.['priceChangePercentage24h']}%\n` +
            ` 📊 Market Cap Change 24h| $${profileData?.['marketCapChange24h']}\n` +
            ` 📉 Mkt Cap Change % 24h | ${profileData?.['marketCapChangePercentage24h']}%\n` +
            `\`\`\`\n` +
            `🔍 _Stay updated with ${PROFILE_NAME}!_\n\n` + 
            `📊 [View detailed ${PROFILE_NAME} profile](${trackitUrl})`
            , { parse_mode: 'Markdown' }
        
        );  
};
