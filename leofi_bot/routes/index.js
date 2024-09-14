const authRoutes = require('./auth.route');
const alertRoutes = require('./alert.route');
const cryptoRoutes = require('./crypto.route');
const messageRoutes = require('./message.route');
const profileRoutes = require('./profile.route');

module.exports = (bot) => { authRoutes(bot), messageRoutes(bot), cryptoRoutes(bot), alertRoutes(bot), profileRoutes(bot) }