let { webp2mp4 } = require('../../lib/webp2')

module.exports = {
	name: "toimg",
	alias: ["toimg"],
	category: "converter",
	desc: "Convert a sticker to image",
	wait: true,
	async run({ msg, conn }, { q }) {
		const { quoted, from, type } = msg;
		const content = JSON.stringify(quoted); 
		const isQStic = type === "extendedTextMessage" && content.includes("stickerMessage"); 
	
	try {
	  if (isQStic) { 
        let media = await quoted.download()
        out = await webp2mp4(media)
        await conn.sendFile(msg.from, out, "image.mp4", 'Success', msg);
	  } else {
	    await msg.reply(`Reply sticker`);
	  }
	  } catch (e) {
	    console.log(e);
			await msg.reply("Error while convert sticker");
	}
	},
};
