const getPosition = (name, _dir) => {
	let position = null;
	Object.keys(_dir).forEach((i) => {
		if (_dir[i].id === name) {
			position = i;
		}
	});
	if (position !== null) {
		return position;
	}
};

module.exports = {
	name: "antidelete",
	desc: "activate anti delete messages in the group",
	use: "<1 / 0>",
	category: "group",
	query: "enter options\n1 = aktif\n0 = nonaktif",
	isAdmin: true,
	isSpam: true,
	async run({ msg, conn }, { args, prefix }) {
		let data = JSON.parse(require("fs").readFileSync("./database/antidelete.json"));
		let data2 = db.cekDatabase("antidelete", "id", msg.from);
		if (args[0] == 1) {
			if (data2) throw "been active before";
			db.modified("antidelete", { id: msg.from });
			await msg.reply(`Antidelete turned on successfully`);
		} else if (args[0] == 0) {
			if (!data2) throw "not active before";
			data.splice(getPosition(msg.from, data), 1);
			require("fs").writeFileSync("./database/antidelete.json", JSON.stringify(data, null, 2));
			await msg.reply("successfully delete session anti delete in this group");
		}
	},
};
