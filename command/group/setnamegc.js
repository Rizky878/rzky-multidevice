module.exports = {
	name: "setnamegc",
	alias: ["sngc"],
	category: "group",
	desc: "malas",
	use: "gtw",
	query: "Masukkan teks",
	isGroup: true,
	isAdmin: true, 
	isBotAdmin: true,
	async run(msg, conn, q) {
		await conn.groupUpdateSubject(msg.from, q)
		await msg.reply('rill') 
}
}
