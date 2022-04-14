module.exports = {
	name: "meme",
	alias: ["randommeme", "memeindo"],
	category: "random",
	isSpam: true,
	async run(msg, conn) {
		await msg.reply(response.wait);
		const buttons = [{ buttonId: "#meme", buttonText: { displayText: "Get Again" }, type: 1 }];
		const meme = await rzky.random.meme();
		const buttonMessage = {
			image: { url: meme.url },
			caption: `Link Post: ${meme.postLink}\nSubreddit: *${meme.subreddit}*\nTitle: *${meme.title}*\nNsfw: *${meme.nsfw}*\nSpoiler: *${meme.spoiler}*\nAuthor: *${meme.author}*`,
			buttons: buttons,
			headerType: 4,
		};

		await conn.sendMessage(msg.from, buttonMessage);
	},
};
