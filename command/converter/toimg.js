const fs = require("fs");
module.exports = {
	name: "toimg",
	alias: ["toimg"],
	category: "converter",
	desc: "Convert a sticker to image",
	async run({ msg, conn }, { q }) {
		const { quoted, from, type } = msg;
		const content = JSON.stringify(quoted); 
		const isQStic = type === "extendedTextMessage" && content.includes("stickerMessage"); 
		let buffer, stickerBuff;
		try {
			if (isQStic) {
				buffer = await quoted.download();
				await conn.sendFile(msg.from, buffer, "toimg.jpg", 'Success', msg);
			} else {
			  await msg.reply(`Reply sticker`);
			}
		 	 (buffer = null), (stickerBuff = null);
		} catch (e) {
			console.log(e);
			await msg.reply("Error convert sticker");
		}
	}
}
