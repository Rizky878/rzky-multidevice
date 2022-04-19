const toMs = require("ms");

const addSesi = (chatId, jawaban, expired, map, game) => {
	map[game].set(chatId, { id: chatId, jawaban: jawaban, expired: Date.now() + toMs(`${expired}s`) });
};
const AmbilJawaban = (chatId, map, game) => {
	let jawab = map[game].get(chatId);
	if (jawab) return jawab.jawaban;
	return false;
};
const cekStatus = (chatId, map, game) => {
	let jawab = map[game].get(chatId);
	return jawab ? true : false;
};
const cekWaktu = (conn, map, game) => {
	setInterval(() => {
		let position = null;
		Object.keys([...map[game].values()]).forEach((i) => {
			if (Date.now() >= [...map[game].values()][i].expired) {
				position = i;
			}
		});
		if (position !== null) {
			conn.sendMessage([...map[game].values()][position].id, {
				text: `*Time has run out*\n\n*Answer :* ${[...map[game].values()][position].jawaban}`,
			});
			map[game].delete([...map[game].values()][position].id);
		}
	}, 1000);
};
const getPosition = (chatId, map, game) => {
	let position = null;
	Object.keys([...map[game].values()]).forEach((i) => {
		if ([...map[game].values()][i].id === chatId) {
			position = i;
		}
	});
	if (position !== null) {
		return position;
	}
};
module.exports = { addSesi, AmbilJawaban, cekStatus, cekWaktu, getPosition };
