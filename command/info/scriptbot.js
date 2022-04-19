module.exports = {
	name: "scriptbot",
	alias: ["script", "sc", "scbot"],
	category: "info",
	isSpam: true,
	async run(msg, conn, q, map, args) {
		await conn.sendMessage(
			msg.from,
			{
				image: { url: config.thumb },
				footer: config.namebot,
				caption: `Script Bot Is here\ndon't forget fork + star XD`,
				templateButtons: [
					{ urlButton: { displayText: "Script Bot", url: "https://github.com/Rizky878/rzky-multidevice/" } },
				],
			},
			{ quoted: msg }
		);
	},
};
