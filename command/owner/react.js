module.exports = {
	name: "react",
	alias: ["re"],
	category: "private",
	isOwner: true,
	isSpam: true,
	desc: "Reaction message",
	use: "<Tag Mess>",
	isQuoted: true,
	query: "Masukkan emoji",
	async run({ msg, conn }, { q }) {
		const reactionMessage = {
			react: {
				text: `${q}`,
				key: msg.quoted.key,
			},
		};
		await conn.sendMessage(msg.from, reactionMessage);
	},
};
