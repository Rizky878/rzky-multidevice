module.exports = {
	name: "whatmusic",
	alias: ["wmusic", "whatmusik", "wmusik"],
	category: "search",
	use: "<reply audio>",
	isSpam: true,
	wait: true,
	isMedia: { isQVideo: true, isQAudio: true },
	desc: "Search for song titles through music or voice",
	async run(msg, conn, q, map, args) {
		//if(!msg.quoted) return msg.reply('Reply Audio')
		const content = JSON.stringify(msg.quoted);
		const isQAudio = msg.type === "extendedTextMessage" && content.includes("audioMessage");
		//f(!isQAudio) return msg.reply(`Reply Audio`)
		var what = await rzky.search.whatmusic(await msg.quoted.download());
		delete what.status;
		var result = await rzky.tools.parseResult(what, { title: "What Music" });
		await msg.reply(result);
	},
};
