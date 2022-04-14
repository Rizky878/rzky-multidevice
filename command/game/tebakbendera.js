const { cekStatus, addSesi } = require("../../lib/optiongame");

module.exports = {
	name: "tebakbendera",
	alias: ["gamebendera"],
	category: "game",
	desc: "Bermain game, menebak bendera negara",
	isSpam: true,
	isLimitGame: true,
	async run(msg, conn, q, map) {
		if (cekStatus(msg.from, map, "tebakbendera")) throw "Group Ini masih dalam sesi permainan";
		let waktugame = 60;
		let tebakbendera = await rzky.game.tebakbendera();
		if (tebakbendera) {
			addSesi(msg.from, tebakbendera.jawaban, waktugame, map, "tebakbendera");
			await msg.reply(
				`*Game Tebak Bendera*\n\nBendera: ${tebakbendera.bendera}\nHint: ${tebakbendera.pertanyaan}\n\nSegera Dijawab, Waktu hanya 1 menit!`
			);
		} else msg.reply("Error");
	},
};
