module.exports = {
	name: "promote",
	alias: ["pm"],
	category: "group",
	desc: "Promote jadi admin group",
	use: "<tagMem>",
	isGroup: true,
	isBotAdmin: true,
	isAdmin: true,
	async run(msg, conn) {
		if (!msg.quoted && msg.mentions[0]) return msg.reply("Tag member!");
		const mm = msg.quoted ? msg.mentions : [msg.quoted.sender];
		for (let i of mm) await conn.groupParticipantsUpdate(msg.from, [i], "promote");
		await msg.reply("Suksess");
	},
};
