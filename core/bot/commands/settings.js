const { Composer, Scenes, session } = require("telegraf");
const composer = new Composer();
const db = require("../db.js");

const addNewUser = new Scenes.WizardScene(
  "addNewUser",
  async (message) => {
    try {
      return message.wizard.next();
    } catch {
      return message.scene.leave();
    }
  },
  async (message) => {
    try {
      const b = message.update.message.text;
      message.session.login = b;

      message.reply("Enter password ⬇️");

      return message.wizard.next();
    } catch (e) {
      console.log(e);
    }
  },
  async (message) => {
    const b = message.update.message.text;

    db.run(
      `INSERT INTO users (login, password) VALUES (?, ?)`,
      [message.session.login, b],
      (err) => {
        if (err) {
          console.log(err);
          message.reply("❌ Unknown error");
        } else {
          message.reply("✅ New user successfully saved", {
            reply_markup: {
              inline_keyboard: [
                [{ text: "⬅️ Back", callback_data: "backToUserPageAction" }],
              ],
            },
          });
        }

        return message.scene.leave();
      },
    );
  },
);

const removeUser = new Scenes.WizardScene(
  "removeUser",
  async (message) => {
    try {
      return message.wizard.next();
    } catch {
      return message.scene.leave();
    }
  },
  async (message) => {
    const b = message.update.message.text;

    db.run(`DELETE FROM users WHERE login = ?`, [b], (err) => {
      if (err) {
        console.error(err);
        message.reply("❌ Unknown error");
      } else {
        message.reply("✅ User successfully deleted", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ Back", callback_data: "backToUserPageAction" }],
            ],
          },
        });
      }
    });

    return message.scene.leave();
  },
);

const removeurl = new Scenes.WizardScene(
  "removeurl",
  async (message) => {
    try {
      return message.wizard.next();
    } catch {
      return message.scene.leave();
    }
  },
  async (message) => {
    const b = message.update.message.text;

    db.run(`DELETE FROM urlBlacklist WHERE url = ?`, [b], (err) => {
      if (err) {
        console.error(err);
        message.reply("❌ Unknown error");
      } else {
        message.reply("✅ Url removed from blacklist", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ Back", callback_data: "backToBlacklistPageAction" }],
            ],
          },
        });
      }
    });

    return message.scene.leave();
  },
);

const addurl = new Scenes.WizardScene(
  "addurl",
  async (message) => {
    try {
      return message.wizard.next();
    } catch {
      return message.scene.leave();
    }
  },
  async (message) => {
    const b = message.update.message.text;

    db.run(`INSERT INTO urlBlacklist (url) VALUES (?)`, [b], (err) => {
      if (err) {
        console.error(err);
        message.reply("❌ Unknown error");
      } else {
        message.reply("✅ Url successfully added to blacklist", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⬅️ Back", callback_data: "backToBlacklistPageAction" }],
            ],
          },
        });
      }
    });

    return message.scene.leave();
  },
);

const stage = new Scenes.Stage([addNewUser, removeUser, addurl, removeurl]);
composer.use(session());
composer.use(stage.middleware());

module.exports = composer;
