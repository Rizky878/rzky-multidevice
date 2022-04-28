module.exports = {
	name: "promote",
	alias: ["pm"],
	category: "group",
	desc: "Promote jadi admin group",
	use: "<tagMem>",
	isGroup: true,
	isBotAdmin: true,
	isAdmin: true,
	async run({ msg, conn }) {
		const mm = msg.quoted ? [msg.quoted.sender] : msg.mentions;
		for (let i of mm) await conn.groupParticipantsUpdate(msg.from, [i], "promote");
		await msg.reply("Suksess");
	},
};
