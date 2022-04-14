module.exports = {
	name: "downloaderall",
	alias: ["pinterest", "pindl", "tiktokaudio", "tiktok", "fbdl", "fb", "soundcloud", "facebook"],
	use: "<url>",
	category: "downloader",
	desc: "Download audio/video from Facebook, Imgur, SoundCloud,  Pinterest, Dan Tiktok",
	wait: true,
	isUrl: true,
	isSpam: true,
	async run(msg, conn, q, map, args) {
		var pilih = msg.body.split(/ +/)[0].slice(1);
		var teks = args[0];
		var yt = await rzky.downloader.downloaderAll(teks);
		if (pilih == "downloaderall") return msg.reply("Silahkan Pilih Downloader: tiktok,soundcloud,facebook");
		var mp3 = yt.mp3[yt.mp3.length - 1];
		var mp4 = yt.mp4[yt.mp4.length - 1];
		var img = yt.image;
		var audio = yt.result;
		yt.size_audio = mp3 ? mp3.formattedSize : "";
		yt.size_video = mp4 ? mp4.formattedSize : "";
		delete yt.image;
		delete yt.mp4;
		delete yt.mp3;
		delete yt.status;
		var result = await rzky.tools.parseResult(yt, {
			title: "Downloader",
		});
		try {
			switch (pilih) {
				case "facebook":
				case "fb":
				case "fbdl":
					await conn.sendMessage(
						msg.from,
						{
							video: {
								url: mp4.url,
							},
							mimetype: "video/mp4",
							caption: result.replace(/downloader_from/gi, "Downloader From"),
							fileName: "facebook.mp4",
						},
						{
							quoted: msg,
						}
					);
					break;
				case "pindl":
				case "pinterest":
					await conn.sendMessage(
						msg.from,
						{
							video: {
								url: mp4.url,
							},
							mimetype: "video/mp4",
							caption: result.replace(/downloader_from/gi, "Downloader From"),
							fileName: "pinterest.mp4",
						},
						{
							quoted: msg,
						}
					);
					break;
				case "soundcloud":
					await conn.sendFile(
						msg.from,
						img,
						"yt.jpg",
						result.replace(/downloader_from/gi, "Downloader From"),
						msg
					);
					await conn.sendMessage(
						msg.from,
						{
							audio: {
								url: mp3.url,
							},
							mimetype: "audio/mpeg",
							fileName: yt.title + ".mp3",
						},
						{
							quoted: msg,
						}
					);
					break;
				case "tiktok":
					await conn.sendMessage(
						msg.from,
						{
							video: {
								url: mp4.url,
							},
							caption: result.replace(/downloader_from/gi, "Downloader From"),
							mimetype: "video/mp4",
							fileName: yt.title.substr(0, 19) + ".mp4",
						},
						{
							quoted: msg,
						}
					);
					break;
				case "tiktokaudio":
					await conn.sendFile(
						msg.from,
						img,
						"yt.jpg",
						result.replace(/downloader_from/gi, "Downloader From"),
						msg
					);
					await await conn.sendFile(msg.from, mp3.url, yt.title + ".mp3", "", msg);
					break;
			}
		} catch (err) {
			console.log(err);
			await msg.reply(response.error.api);
		}
	},
};
