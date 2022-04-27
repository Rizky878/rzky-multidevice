module.exports = {
	name: "hidetag",
	alias: ["ht"],
	category: "group",
	isAdmin: true,
	isGroup: true,
	desc: "Buat ngasih informasi / bikin 1 gc kesel :v",
	use: "<text>",
	query: "Masukkan teks",
	async run(msg, conn, q) {
		const gc = await conn.groupMetadata(msg.from);
		const mem = gc.participants;

		conn.sendMessage(msg.from, { text: `${q}`, mentions: mem.map((a) => a.id) });
	},
};
