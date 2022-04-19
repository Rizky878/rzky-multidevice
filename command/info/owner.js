module.exports = {
	name: "owner",
	alias: ["pemilik"],
	category: "info",
	isSpam: true,
	async run(msg, conn, q, map, args) {
		var msga = await conn.sendContact(msg.from, config.owner, msg);
		await conn.sendMessage(msg.from, { text: `this my owner number, please don't spam` }, { quoted: msga });
	},
};
