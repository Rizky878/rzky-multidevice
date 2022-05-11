const { convertTime } = require("../../lib");

module.exports = {
	name: "runtime",
	category: "info",
	type: "changelog",
	desc: "check time run  bot",
	isSpam: true,
	async run({ msg, conn }, { map }) {
		await msg.reply(convertTime(map.uptime.getTime()));
	},
};
