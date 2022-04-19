module.exports = async function (msg, conn, map) {
	const { sender, body, from } = msg;
	const { AmbilJawaban, cekStatus, cekWaktu, getPosition } = require("./optiongame");
	const { prefix } = map;

	if (cekStatus(from, map, "tebakbendera")) {
		if (body.toLowerCase().includes(AmbilJawaban(from, map, "tebakbendera"))) {
			var htgm = Math.floor(Math.random() * 300);
			addBalance(sender, htgm, balance);
			await msg.reply(
				`*Congratulations your answer is correct!*\n*Answer :* ${AmbilJawaban(
					from,
					map,
					"tebakbendera"
				)}\n*Present :* $${htgm}\n\nWant to play again? send *${prefix}tebakbendera*`
			);
			map.tebakbendera.delete(from);
		}
	}
};

// Auto Update
global.reloadFile(__dirname);
