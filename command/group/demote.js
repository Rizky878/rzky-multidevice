module.exports = {
	name: "demote",
	alias: ["dm"],
	category: "group",
	desc: "Demote admin group",
	use: "<tagMem>",
	isGroup: true, 
	isBotAdmin: true,
	isAdmin: true
	async run(msg, conn) {
		if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return msg.reply('Tag member!') 
		const mm = msg.quoted.sender
		for (let i of mm) await conn.groupParticipantsUpdate(msg.from, [i], "demote")
		await msg.reply("Suksess")
}
}
