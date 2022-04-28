module.exports = {
	name: "setnamegc",
	alias: ["sngc"],
	category: "group",
	desc: "To change name group ",
	use: "setname + query",
	query: "Masukkan teks",
	isGroup: true,
	isAdmin: true,
	isBotAdmin: true,
	async run({ msg, conn }, { q }) {
		await conn.groupUpdateSubject(msg.from, q);
		await msg.reply("Success change name group");
	},
};
