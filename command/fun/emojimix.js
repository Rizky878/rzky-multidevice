const { sticker } = require("../../lib/convert");

function isEmoji(str) {
	var ranges = [
		"(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])", // U+1F680 to U+1F6FF
	];
	if (str.match(ranges.join("|"))) {
		return true;
	} else {
		return false;
	}
}
const getBuffer = async (url, options) => {
	try {
		options ? options : {};
		const res = await require("axios")({
			method: "get",
			url,
			headers: {
				DNT: 1,
				"Upgrade-Insecure-Request": 1,
			},
			...options,
			responseType: "arraybuffer",
		});
		return res.data;
	} catch (e) {
		console.log(`Error : ${e}`);
	}
};

module.exports = {
	name: "emojimix",
	use: "<emoji || emoji+emoji>",
	category: "fun",
	desc: "Sending Emoji stickers plus other emojis",
	wait: true,
	query: "Enter Emoji\nExample: #emojimix 😅+😅",
	isSpam: true,
	async run({ msg, conn }, { q, map, args }) {
		try {
			const [teks1, teks2, teks3] = q;
			if (!q)
				throw "Enter Emojis Correctly, \ntype\n• #emojimix 👻\n- if you want to show some stickers\n• #emojimix 😅+😅\n- if you want to bring up a special sticker";
			const result = teks3 ? await rzky.fun.emojimix(teks1, teks3) : await rzky.fun.emojimix(teks1);
			if (result.status == 404) throw "Emojis not found";
			for (let i of result) {
				stickerBuff = await sticker(await getBuffer(i.url), {
					isImage: true,
					cmdType: "1",
					withPackInfo: true,
					packInfo: config.packInfo,
				});
				await conn.sendMessage(msg.from, { sticker: stickerBuff }, { quoted: msg });
			}
		} catch (e) {
			console.log(e);
			await msg.reply(String(e));
		}
	},
};
