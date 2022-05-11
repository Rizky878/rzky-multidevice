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
	name: "left",
	desc: "activate the new member left feature",
	use: "<1 / 0>",
	category: "group",
	query: "enter options\n1 = aktif\n0 = nonaktif",
	isAdmin: true,
	isSpam: true,
	async run({ msg, conn }, { args, prefix }) {
		let data = JSON.parse(require("fs").readFileSync("./database/left.json"));
		let data2 = db.cekDatabase("left", "id", msg.from);
		if (args[0] == 1) {
			if (data2) throw "been active before";
			db.modified("left", { id: msg.from, teks: "Sayonara @user", lastUpdate: false });
			await msg.reply(
				`Left turned on successfully\n Type\n1. *${prefix}setwelcome text*\n-desc: if you want to change the text on welcome\n2. *${prefix}setleft text*\n-desc: if you want to change the text on left`
			);
		} else if (args[0] == 0) {
			if (!data2) throw "not active before";
			data.splice(getPosition(msg.from, data), 1);
			require("fs").writeFileSync("./database/left.json", JSON.stringify(data, null, 2));
			await msg.reply("successfully delete session left in this group");
		}
	},
};
