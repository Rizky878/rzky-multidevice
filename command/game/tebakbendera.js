const { cekStatus, addSesi } = require("../../lib/optiongame");

module.exports = {
	name: "tebakbendera",
	alias: ["gamebendera"],
	category: "game",
	desc: "Play games, guess the country flag",
	isSpam: true,
	isLimitGame: true,
	async run(msg, conn, q, map) {
		if (cekStatus(msg.from, map, "tebakbendera")) throw "Group Ini masih dalam sesi permainan";
		let waktugame = 60;
		let tebakbendera = await rzky.game.tebakbendera();
		if (tebakbendera) {
			addSesi(msg.from, tebakbendera.jawaban, waktugame, map, "tebakbendera");
			await msg.reply(
				`*Game Tebak Bendera*\n\nBendera: ${tebakbendera.bendera}\nHint: ${tebakbendera.pertanyaan}\n\nAnswered Immediately, Time only 1 minute!`
			);
		} else msg.reply("Error");
	},
};
