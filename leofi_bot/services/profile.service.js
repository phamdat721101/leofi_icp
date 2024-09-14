const fetch = require('node-fetch');
const { handleError } = require('../config/errorHandle');
const { COINGECKO_API_URL } = require('../config/constants');

process['env']['NODE_ENV'] = process['env']['NODE_ENV'] || 'development';
require('dotenv').config({ path: `./.env.${process['env']['NODE_ENV']}` });

class ProfileService {
    constructor(apiUrl = COINGECKO_API_URL) { this['apiUrl'] = apiUrl; }

    async getTokenData(token) {
        return {
            "price": 30.5,
            "marketCap": 25500000,
            "holders": 15,
            "volume24h": 1800000,
            "priceChange24h": -0.8,
            "priceChangePercentage24h": -2.57,
            "marketCapChange24h": -120000,
            "marketCapChangePercentage24h": -0.47
        }
    }
}

module.exports = new ProfileService();
