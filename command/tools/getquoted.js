module.exports = {
	name: "getquoted",
	alias: ["q"],
	category: "tools",
	isQuoted: true,
	async run({ msg, conn }) {
		const { serialize } = require("../../lib/serialize");
		const message = await msg.getQuotedObj();
		if (!message.quoted) throw "The message you replied does not contain a reply";
		conn.sendMessage(msg.from, { forward: await serialize(message.quoted, conn) });
	},
};
