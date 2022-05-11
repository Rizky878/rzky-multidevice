module.exports = {
	name: "hidetag",
	alias: ["ht"],
	category: "group",
	isAdmin: true,
	isGroup: true,
	desc: "Buat ngasih informasi / bikin 1 gc kesel :v",
	use: "<text>",
	async run({ msg, conn }, { q }) {
		const gc = await conn.groupMetadata(msg.from);
		const mem = gc.participants;
		let mes = msg.quoted ? await msg.getQuotedObj() : msg;
		msg.quoted ? (mes.message[msg.quoted.mtype].caption = q) : "";
		msg.quoted
			? await conn.sendMessage(msg.from, { forward: mes, mentions: mem.map((a) => a.id) }, { quoted: mes })
			: conn.sendMessage(msg.from, { text: `${q}`, mentions: mem.map((a) => a.id) });
	},
};
