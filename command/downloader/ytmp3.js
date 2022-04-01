module.exports = {
	name: "ytmp3",
	alias: ["youtubeaudio", "ytaudio", "yta"],
	use: "#ytmp3 <url youtube>",
	category: "downloader",
	desc: "Download audio from YouTube",
	wait: false,
	isUrl: true,
        isSpam: true,
	async run(msg, conn, q, isOwner, body, map, config, args) {
		var yt = await rzky.yt.ytmp3(args[0]);
		var img = yt.thumb;
		var audio = yt.result;
		delete yt.thumb;
		delete yt.dislike;
		delete yt.result;
		var result = await rzky.tools.parseResult(yt);
		await conn.sendFile(msg.from, img, "yt.jpg", result, msg);
		await conn.sendFile(msg.from, audio, yt.title + ".mp3", result, msg);
	},
};
