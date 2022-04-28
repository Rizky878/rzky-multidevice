module.exports = {
	name: "demote",
	alias: ["dm"],
	category: "group",
	desc: "Demote admin group",
	use: "<tagMem>",
	isGroup: true,
	isBotAdmin: true,
	isAdmin: true,
	async run({ msg, conn }) {
		const mm = msg.quoted ? [msg.quoted.sender] : msg.mentions;
		for (let i of mm) await conn.groupParticipantsUpdate(msg.from, [i], "demote");
		await msg.reply("Suksess");
	},
};
