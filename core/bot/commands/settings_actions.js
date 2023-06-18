const { Composer } = require("telegraf");
const composer = new Composer();
const db = require("../db.js");
const { SendMainPage } = require("../functions/mainPage.js");
const { SendUserSettingsPage } = require("../functions/userSettingsPage.js");
// prettier-ignore
const { SendUBlacklistPage } = require("../functions/urlBlacklistSettingsPage.js");

composer.action("userSettingsAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  SendUserSettingsPage(message);
});

composer.action("getUsersAction", async (message) => {
  message.deleteMessage();
  let users = [];

  const getUsers = new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      rows.forEach((row) => {
        users.push(
          `***Login:*** \`${row.login}\` ***Password:*** \`${row.password}\``,
        );
      });
      resolve(users);
    });
  });

  getUsers
    .then((users) => {
      if (users.length == 0) {
        message.reply("🙁 No users");
        return;
      }
      message.replyWithMarkdownV2(
        "***Total users: ***" + users.length + "\n" + users.join("\n"),
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ Back", callback_data: "backToUserPageAction" }],
            ],
          },
        },
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

composer.action("getBlacklistedAction", async (message) => {
  message.deleteMessage();
  let urls = [];

  const getUrls = new Promise((resolve, reject) => {
    db.all(`SELECT * FROM urlBlacklist`, [], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      rows.forEach((row) => {
        urls.push(`${row.url}`);
      });
      resolve(urls);
    });
  });

  getUrls
    .then((urls) => {
      if (urls.length == 0) {
        message.reply("🙁 No urls");
        return;
      }
      // prettier-ignore
      message.reply(
        "Total urls: " +  urls.length + "\n" +urls.join("\n"),
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ Back", callback_data: "backToBlacklistPageAction" }],
            ],
          },
        },
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

composer.action("mainPageAction", async (message) => {
  message.deleteMessage();
  SendMainPage(message);
});

composer.action("addNewUserAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  message.reply("Enter login ⬇️");
  message.scene.enter("addNewUser");
});

composer.action("removeUserAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  message.reply("Enter login ⬇️ ");
  message.scene.enter("removeUser");
});

composer.action("backToUserPageAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  SendUserSettingsPage(message);
});

composer.action("backToBlacklistPageAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}
  SendUBlacklistPage(message);
});

composer.action("urlBlacklistSettingsAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  SendUBlacklistPage(message);
});

composer.action("addNewUrlToBlacklistAction", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  message.reply("Enter domain ⬇️ \nExample: google.com ");
  message.scene.enter("addurl");
});

composer.action("removeUrlFromBlacklist", async (message) => {
  try {
    message.deleteMessage();
  } catch {}

  message.reply("Enter domain ⬇️ \nExample: google.com ");
  message.scene.enter("removeurl");
});

module.exports = composer;
