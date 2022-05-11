let petpet = require("pet-pet-gif");
let { sticker, convert } = require("../../lib/convert");

module.exports = {
	name: "elus",
	alias: ["petcoax", "eluselus"],
	category: "fun",
	desc: "convert photo to animated gif coax",
	use: "<reply image>",
	wait: true,
	async run({ msg, conn }, { q, map, args, arg, prefix, response, chat }) {
		let $type = msg.quoted ? msg.quoted.mtype : msg.type;
		let $typenya = /imageMessage|stickerMessage/i.test($type);
		if (!$typenya) throw "Reply Image";
		let download = msg.quoted ? await msg.quoted.download() : await msg.download();
		if ($type.includes("stickerMessage"))
			download = await conn.getBuffer(await require("../../lib/webp2").webp2png(download));
		let pet = await petpet(download, { backgroundColor: "white", delay: typeof q == "string" ? 20 : q });
		await conn.sendMessage(
			msg.from,
			{
				sticker: await sticker(pet, {
					cmdType: 1,
					isVideo: true,
					withPackInfo: true,
					packInfo: config.packInfo,
				}),
			},
			{ quoted: msg }
		);
	},
};
