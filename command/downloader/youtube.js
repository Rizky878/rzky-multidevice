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
	async run({ msg, conn }, { q, map, args }) {
		var pilih = msg.body.split(/ +/)[0].slice(1);
		var teks = q.replace(/ --doc/gi, "");
		if (pilih == "play" || pilih == "youtube") {
			yets = await yts(teks);
			var results = await yets.all.filter((s) => s.type == "video");
			var vid = results.find((video) => video.seconds < 3600);
			teks = vid.url;
		}
		var yt = await y2mateV(teks, "480");
		if (yt[0].link == "https://app.y2mate.com/download") yt = await y2mateV(teks, "360");
		if (yt[0].link == "https://app.y2mate.com/download") yt = await y2mateV(teks, "144");
		if (pilih == "play" || pilih == "ytmp3" || pilih == "youtube") {
			yt = await y2mateA(teks, "256");
		}
		switch (pilih) {
			case "play":
				await conn.sendMessage(msg.from, {
					image: { url: yt[0].thumb },
					caption: await rzky.tools.parseResult(yt[0], { title: "Youtube" }),
					templateButtons: [
						{ urlButton: { displayText: "Source", url: teks } },
						{ urlButton: { displayText: "Short Link", url: "https://sl.rzkyfdlh.tech" } },
						{ quickReplyButton: { displayText: "Audio 🎶", id: "#ytmp3 " + teks } },
						{ quickReplyButton: { displayText: "Video 🎥", id: "#ytmp4 " + teks } },
						{ quickReplyButton: { displayText: "Document Audio 📄", id: "#ytmp3 " + teks + " --doc" } },
					],
				});
				break;
			case "ytmp3":
				await conn.sendFile(msg.from, yt[0].link, yt[0].judul + ".mp3", "", msg, false, {
					asDocument: q.endsWith("--doc"),
				});
				break;
			case "ytmp4":
				if (q.endsWith("--doc")) {
					await conn.sendFile(msg.from, yt[0].link, yt[0].judul + ".mp4", "", msg, false, {
						asDocument: true,
					});
				} else {
					try {
						await conn.sendMessage(
							msg.from,
							{
								video: {
									url: yt[0].link,
								},
								mimetype: "video/mp4",
								caption: await rzky.tools.parseResult(yt[0], { title: "Youtube" }),
								fileName: yt.title + ".mp4",
								templateButtons: [
									{ urlButton: { displayText: "Source", url: teks } },
									{
										quickReplyButton: {
											displayText: "Document 📄",
											id: "#ytmp4 " + teks + " --doc",
										},
									},
								],
							},
							{
								quoted: msg,
							}
						);
					} catch {
						await msg.reply("Size Terlalu besar, media akan dikirim melalui document");
						await conn.sendFile(msg.from, yt[0].link, yt[0].judul + ".mp4", "", msg, false, {
							asDocument: true,
						});
					}
				}
				break;
		}
	},
};
