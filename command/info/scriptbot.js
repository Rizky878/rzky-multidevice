module.exports = {
	name: "scriptbot",
	alias: ["script", "sc", "scbot"],
	category: "info",
	isSpam: true,
	async run({ msg, conn }, { q, map, args }) {
		await conn.sendMessage(
			msg.from,
			{
				image: { url: config.thumb },
				footer: config.namebot,
				// Gausah di ubah kontol najis modal copas sana sini ubah source cih
				caption: `Script Bot Is here\ndon't forget fork + star XD`,
				templateButtons: [
					{ urlButton: { displayText: "Script Bot", url: "https://wibusoft.com/" } },
				],
			},
			{ quoted: msg }
		);
	},
};
