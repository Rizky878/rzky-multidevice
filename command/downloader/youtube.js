const yts = require("yt-search"),
	{ y2mateV, y2mateA } = require("../../lib/y2mate");

module.exports = {
	name: "youtube",
	alias: ["play", "ytmp4", "ytmp3"],
	use: "<url>",
	category: "downloader",
	desc: "Download audio/video from YouTube",
	wait: true,
	query: true,
	isSpam: true,
	async run(msg, conn, q, map, args) {
		var pilih = msg.body.split(/ +/)[0].slice(1);
		var teks = args[0];
		if (pilih == "play" || pilih == "youtube") {
			yets = await yts(args[0]);
			var results = await yets.all.filter((s) => s.type == "video");
			var vid = results.find((video) => video.seconds < 3600);
			teks = vid.url;
		}
		var yt = await y2mateV(teks, "480");
		if (pilih == "play" || pilih == "ytmp3" || pilih == "youtube") {
			yt = await y2mateA(teks, "256");
		}
		console.log(yt);
		switch (pilih) {
			case "ytmp3":
			case "play":
				await conn.sendFile(
					msg.from,
					yt[0].thumb,
					Date.now() + ".jpg",
					await rzky.tools.parseResult(yt[0], { title: "Youtube" }),
					msg
				);
				await conn.sendFile(msg.from, yt[0].link, yt[0].judul + ".mp3", "", msg);
				break;
			case "ytmp4":
				await conn.sendMessage(
					msg.from,
					{
						video: {
							url: yt[0].link,
						},
						mimetype: "video/mp4",
						caption: await rzky.tools.parseResult(yt[0], { title: "Youtube" }),
						fileName: yt.title + ".mp4",
					},
					{
						quoted: msg,
					}
				);
				break;
		}
	},
};
