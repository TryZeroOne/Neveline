function SendUserSettingsPage(message) {
  message.reply("⚙️ Neveline user settings", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Add new user", callback_data: "addNewUserAction" },
          { text: "Remove user", callback_data: "removeUserAction" },
        ],
        [{ text: "User List", callback_data: "getUsersAction" }],
        [{ text: "⬅️ Back", callback_data: "mainPageAction" }],
      ],
    },
  });
}

module.exports = {
  SendUserSettingsPage,
};
