const { Composer } = require("telegraf");
const composer = new Composer();
const { SendMainPage } = require("../functions/mainPage.js");

composer.start(async (message) => {
  SendMainPage(message);
});

module.exports = composer;
