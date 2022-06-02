const axios = require("axios");
const expand = async (url) => {
	let axs = await axios.get("https://caliph.my.id/api/expandurl.php?url=" + url);
	return axs.data.result;
};

module.exports = {
	name: "downloaderall",
	alias: ["pinterest", "pindl", "tiktokaudio", "tiktok", "fbdl", "fb", "soundcloud", "facebook"],
	use: "<url>",
	category: "downloader",
	desc: "Download audio/video from Facebook, Imgur, SoundCloud,  Pinterest, Dan Tiktok",
	wait: true,
	isUrl: true,
	isSpam: true,
	async run({ msg, conn }, { q, map, args }) {
		var pilih = msg.body.split(/ +/)[0].slice(1);
		var teks = args[0];
		let tiktok;
		if (pilih == "tiktok" || pilih == "tiktokaudio") tiktok = await rzky.downloader.tiktok(teks);
		var yt = await rzky.downloader.downloaderAll(teks);
		if (pilih == "downloaderall") return msg.reply("Silahkan Pilih Downloader: tiktok,soundcloud,facebook");
		var mp3 = yt.mp3[yt.mp3.length - 1];
		var mp4 = yt.mp4[yt.mp4.length - 1];
		var img = yt.image;
		let resu;
		if (pilih == "tiktok" || pilih == "tiktokaudio") resu = tiktok.result;
		yt.size_audio = mp3 ? mp3.formattedSize : "";
		if (pilih == "tiktok" || pilih == "tiktokaudio") tiktok.size = resu.video.nowm.size;
		if (pilih == "tiktok" || pilih == "tiktokaudio") tiktok.audio_name = resu.audio.audio_name;
		yt.size_video = mp4 ? mp4.formattedSize : "";
		delete yt.image;
		delete yt.mp4;
		delete yt.mp3;
		delete yt.status;
		if (pilih == "tiktok" || pilih == "tiktokaudio") delete tiktok.result;
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
								url: await resu.video.nowm.video_url,
							},
							caption: await rzky.tools.parseResult(tiktok, { title: "Tiktok Download" }),
							mimetype: "video/mp4",
							fileName: tiktok.desc.substr(0, 19) + ".mp4",
							templateButtons: [
								{ urlButton: { displayText: "Source", url: q } },
								{ urlButton: { displayText: "Downloader", url: "https://down.rzkyfdlh.tech" } },
								{ quickReplyButton: { displayText: "Audio🎶", id: "#tiktokaudio " + q } },
							],
						},
						{
							quoted: msg,
						}
					);
					break;
				case "tiktokaudio":
					await conn.sendMessage(
						msg.from,
						{
							image: { url: await tiktok.thumbnail },
							fileName: "tiktok.jpg",
							caption: await rzky.tools.parseResult(tiktok, { title: "Tiktok Download" }),
						},
						{ quoted: msg }
					);
					await conn.sendFile(msg.from, await resu.audio.audio_url, tiktok.author + ".mp3", "", msg);
					break;
			}
		} catch (err) {
			console.log(err);
			await msg.reply(response.error.api);
		}
	},
};
