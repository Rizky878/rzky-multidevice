module.exports = {
	name: "loli",
	alias: ["randomloli", "lolianime"],
	category: "random",
	isSpam: true,
	async run(msg, conn) {
		await msg.reply(response.wait);
		const buttons = [{ buttonId: "#loli", buttonText: { displayText: "Get Again" }, type: 1 }];
		const buttonMessage = {
			image: { url: (await rzky.image.loli()).url },
			caption: "Pedo🫵",
			buttons: buttons,
			headerType: 4,
		};

		await conn.sendMessage(msg.from, buttonMessage);
	},
};
