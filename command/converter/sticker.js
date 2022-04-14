const { sticker } = require("../../lib/convert");

module.exports = {
	name: "sticker",
	alias: [
		"stick",
		"stik",
		"stiker",
		"take",
		"swm",
		"stickerwm",
		"wm",
		"stickergif",
		"stikergif",
		"gifstiker",
		"gifsticker",
	],
	category: "converter",
	desc: "Create a sticker from image or video",
	async run(msg, conn) {
		const { quoted, from, type } = msg;

		const content = JSON.stringify(quoted);
		const isMedia = type === "imageMessage" || type === "videoMessage";
		const isQImg = type === "extendedTextMessage" && content.includes("imageMessage");
		const isQVid = type === "extendedTextMessage" && content.includes("videoMessage");
		const isQDoc = type === "extendedTextMessage" && content.includes("documentMessage");
		const isQStic = type === "extendedTextMessage" && content.includes("stickerMessage");
		q = q.split("|");
		const packInfo = {
			packname: q[0] ? q[0] : config.packInfo.packname,
			author: q[1] ? q[1] : config.packInfo.author,
		};

		let buffer, stickerBuff;
		try {
			if (isQStic) {
				buffer = await quoted.download();
				stickerBuff = await sticker(buffer, { isSticker: true, withPackInfo: true, packInfo, cmdType: "1" });
				await conn.sendMessage(from, { sticker: stickerBuff }, { quoted: msg });
			} else if ((isMedia && !msg.message.videoMessage) || isQImg) {
				buffer = isQImg ? await quoted.download() : await msg.download();
				stickerBuff = await sticker(buffer, { isImage: true, withPackInfo: true, packInfo, cmdType: "1" });
				await conn.sendMessage(from, { sticker: stickerBuff }, { quoted: msg });
			} else if (
				(isMedia && msg.message.videoMessage.fileLength < 2 << 20) ||
				(isQVid && quoted.message.videoMessage.fileLength < 2 << 20)
			) {
				buffer = isQVid ? await quoted.download() : await msg.download();
				stickerBuff = await sticker(buffer, { isVideo: true, withPackInfo: true, packInfo, cmdType: "1" });
				await conn.sendMessage(from, { sticker: stickerBuff }, { quoted: msg });
			} else if (
				isQDoc &&
				(/image/.test(quoted.message.documentMessage.mimetype) ||
					(/video/.test(quoted.message.documentMessage.mimetype) &&
						quoted.message.documentMessage.fileLength < 2 << 20))
			) {
				let ext = /image/.test(quoted.message.documentMessage.mimetype)
					? { isImage: true }
					: /video/.test(quoted.message.documentMessage.mimetype)
					? { isVideo: true }
					: null;
				if (!ext) return await msg.reply("Document mimetype unknown");
				buffer = await quoted.download();
				stickerBuff = await sticker(buffer, { ...ext, withPackInfo: true, packInfo, cmdType: "1" });
				await conn.sendMessage(from, { sticker: stickerBuff }, { quoted: msg });
			} else {
				await msg.reply(`reply sticker`);
			}
			(buffer = null), (stickerBuff = null);
		} catch (e) {
			console.log(e);
			await msg.reply("Error while creating sticker");
		}
	},
};
