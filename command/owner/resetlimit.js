module.exports = {
	name: "resetlimit",
	category: "private",
	desc: "Mereset limit",
	isSpam: true,
	isOwner: true,
	async run(msg) {
		limit.splice("reset");
		require("fs").writeFileSync("./database/limit.json", JSON.stringify(limit));
		await msg.reply(`Reset limit berhasil`);
	},
};
