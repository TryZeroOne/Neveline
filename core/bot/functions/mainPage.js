const config = require("../config.js");
const IsOwner = require("./IsOwner.js");

function SendMainPage(message) {
  try {
    let ids = config["Bot"]["OwnerIds"];
    let st = IsOwner(ids, message.from.id);

    if (!st) {
      return message.reply("No rights to use the bot");
    }
    message.reply(
      "Hello! I'm Neveline, your personal proxy setup bot.\nSource code: https://github.com/TryZeroOne/Neveline",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⚙️ User settings",
                callback_data: "userSettingsAction",
              },
              {
                text: "⚙️ Url blacklist settings",
                callback_data: "urlBlacklistSettingsAction",
              },
            ],
          ],
        },
      },
    );
  } catch (err) {
    console.log("<< Neveline >> Uknown error: " + err);
  }
}

module.exports = { SendMainPage };
