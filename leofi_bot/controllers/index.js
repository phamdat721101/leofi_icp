const authController = require('./auth.controller');
const alertController = require('./alert.controller');
const cryptoController = require('./crypto.controller');
const messageController = require('./message.controller');
const profileController = require('./profile.controller'); 

module.exports = { authController, messageController, cryptoController, alertController, profileController };