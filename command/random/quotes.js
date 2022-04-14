module.exports = {
	name: "quotesanime",
	alias: ["quotes", "animequotes", "quote", "quoteanime"],
	category: "random",
	isSpam: true,
	wait: true,
	async run(msg, conn, q, map, args) {
		var animquote = await rzky.random.quotesAnime();
		var animrandom = animquote.result[Math.floor(Math.random() * animquote.result.length)];
		var img = animrandom.img;
		delete animrandom.img;
		var result = await rzky.tools.parseResult(animrandom, { title: "Quotes Anime" });
		await conn.sendFile(
			msg.from,
			img,
			"quotes.jpg",
			result.replace(/Char_name/gi, "Nama Karakter").replace(/Date/gi, "Release Date"),
			msg
		);
	},
};
