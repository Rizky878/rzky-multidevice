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
	isLimit: true,
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
		let yt, mp3, mp4;
		try {
			yt = await y2mateV(teks, "480");
			if (yt[0].link == "https://app.y2mate.com/download") yt = await y2mateV(teks, "360");
			if (yt[0].link == "https://app.y2mate.com/download") yt = await y2mateV(teks, "144");
			if (pilih == "play" || pilih == "ytmp3" || pilih == "youtube") {
				yt = await y2mateA(teks, "256");
			}
		} catch {
			yt = await rzky.downloader.downloaderAll(teks);
			mp3 = yt.mp3[yt.mp3.length - 1];
			mp4 = yt.mp4[yt.mp4.length - 1];
		}
		switch (pilih) {
			case "play":
				await conn.sendMessage(msg.from, {
					image: { url: yt[0] ? yt[0].thumb : yt.image },
					caption: await rzky.tools.parseResult(yt[0] || yt, { title: "Youtube", delete: ["mp4", "mp3"] }),
					templateButtons: [
						{ urlButton: { displayText: "Source", url: teks } },
						{
							urlButton: {
								displayText: "Short Link",
								url: "https://sl.rzkyfdlh.tech",
							},
						},
						{ quickReplyButton: { displayText: "Audio 🎶", id: "#ytmp3 " + teks } },
						{ quickReplyButton: { displayText: "Video 🎥", id: "#ytmp4 " + teks } },
						{ quickReplyButton: { displayText: "Document Audio 📄", id: "#ytmp3 " + teks + " --doc" } },
					],
				});
				break;
			case "ytmp3":
				await conn.sendMessage(
					msg.from,
					{
						[q.endsWith("--doc") ? "document" : "audio"]: {
							url: yt[0] ? yt[0].link : mp3.url,
						},
						mimetype: "audio/mpeg",
						fileName: yt[0] ? yt[0].judul + ".mp3" : yt.title + ".mp3",
					},
					{
						quoted: msg,
					}
				);
				/*	await conn.sendFile(
					msg.from,
					yt[0] ? yt[0].link : mp3.url,
					yt[0] ? yt[0].judul + ".mp3" : yt.title + ".mp3",
					"",
					msg,
					false,
					{
						asDocument: q.endsWith("--doc"),
					}
				);*/
				break;
			case "ytmp4":
				if (q.endsWith("--doc")) {
					await conn.sendFile(
						msg.from,
						yt[0] ? yt[0].link : mp4.url,
						yt[0] ? yt[0].judul + ".mp4" : yt.title + ".mp4",
						"",
						msg,
						false,
						{
							asDocument: true,
						}
					);
				} else {
					try {
						await conn.sendMessage(
							msg.from,
							{
								video: {
									url: yt[0] ? yt[0].link : mp4.url,
								},
								mimetype: "video/mp4",
								caption: await rzky.tools.parseResult(yt[0] || yt, {
									title: "Youtube",
									delete: ["status", "mp3", "mp4"],
								}),
								fileName: yt[0] ? yt[0].judul : yt.title + ".mp4",
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
						await conn.sendFile(
							msg.from,
							yt[0] ? yt[0].link : mp4.url,
							yt[0] ? yt[0].judul + ".mp4" : yt.title + ".mp4",
							"",
							msg,
							false,
							{
								asDocument: true,
							}
						);
					}
				}
				break;
		}
	},
};
