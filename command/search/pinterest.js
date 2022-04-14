module.exports = {
	name: "pinterest",
	alias: ["pint", "pin"],
	category: "search",
	isSpam: true,
	query: `Masukan teks yang ingin dicari`,
	use: "<teks>",
	wait: true,
	desc: "Searching Images From Pinterest",
	async run(msg, conn, q) {
		const buttons = [{ buttonId: "#pinterest " + q, buttonText: { displayText: "Get Again" }, type: 1 }];
		const pin = await rzky.image.pinterest(q);
		const pinran = pin.result[Math.floor(Math.random() * pin.result.length)];
		const buttonMessage = {
			image: { url: pinran },
			caption: "Result from: " + q,
			buttons: buttons,
			headerType: 4,
		};

		await conn.sendMessage(msg.from, buttonMessage);
	},
};
