function SendUBlacklistPage(message) {
  message.reply("⚙️ Neveline url blacklist settings", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Add url", callback_data: "addNewUrlToBlacklistAction" },
          { text: "Remove url", callback_data: "removeUrlFromBlacklist" },
        ],
        [
          {
            text: "Blacklisted urls list",
            callback_data: "getBlacklistedAction",
          },
        ],
        [{ text: "⬅️ Back", callback_data: "mainPageAction" }],
      ],
    },
  });
}

module.exports = {
  SendUBlacklistPage,
};
