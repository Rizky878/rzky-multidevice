const { isUrl } = require("../../lib/index");

module.exports = {
	name: "instagram",
	alias: ["ig", "igdl", "igstory", "instagramdl", "instagramstory"],
	category: "downloader",
	use: "<url>",
	desc: "download video and photo from instagram",
	query: `Options:\n1. #igdl - Download Video Or Photo From Post\n\n2. #igstory - Download Video or photo from story\n\nExample: \n1. #igdl https://www.instagram.com/p/CbxLLgKJXOa/?utm_source=ig_web_copy_link\n2. #igstory petanikode`,
	wait: true,
	isSpam: true,
	async run(msg, conn, q) {
		var command = msg.body.split(/ +/)[0].slice(1);
		if (command == "ig" || command == "instagram")
			return msg.reply(
				`Pilihan:\n1. #igdl - Mendownload Video Atau Foto Dari postingan\n\n2. #igstory - Mendownload Video atau foto dari story\n\nExample: \n1. #igdl https://www.instagram.com/p/CbxLLgKJXOa/?utm_source=ig_web_copy_link\n2. #igstory petanikode`
			);
		var ig;
		if (command == "igstory" || (command == "instagramstory" && !isUrl(q))) {
			ig = await rzky.downloader.igStory(q);
		} else {
			if (!isUrl(q) && !q.includes("instagram.com")) return msg.reply(`Invalid Url`);
			ig = await rzky.downloader.igdl(q);
		}
		var img = ig.user.profilePicUrl;
		var result = ig.medias;
		delete ig.user.profilePicUrl;
		delete ig.medias;
		var parse = await rzky.tools.parseResult(ig.user, { title: "Instagram Download" });
		await conn.sendFile(msg.from, img, "ig.jpg", parse, msg);
		for (let i of result) {
			await conn.sendFile(msg.from, i.url, ig.user.username + i.fileType, "From " + ig.user.fullName, msg);
		}
	},
};
