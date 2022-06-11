const similarity = require("similarity");
const threshold = 0.72;

module.exports = async function (msg, conn, map) {
	const { sender, body, from, quoted } = msg;
	const { AmbilJawaban, cekStatus, cekWaktu, getPosition } = require("./optiongame");
	const { prefix } = map;

	if (msg.quoted) {
		const id = quoted.key.id;
		const cek = conn.game[id] ? conn.game[id].status : false;
		if (!msg.quoted.key.fromMe && !/Happy\sAnswering/i.test(msg.quoted.text)) return !0;
		if (cek && id in conn.game) return msg.reply("Soal itu telah berakhir");
		if (cekStatus(from, map, "tebakbendera")) {
			const finds = map.tebakbendera.get(from);
			if (msg.quoted.key.id == finds.idChat) {
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
					conn.game[id] = { status: true };
				} else if (similarity(body.toLowerCase(), AmbilJawaban(from, map, "tebakbendera")) >= threshold)
					msg.reply(`*Dikit Lagi!*`);
				else msg.reply(`*Wrong!*`);
			}
		}
	}
};

// Auto Update
global.reloadFile(__dirname);
