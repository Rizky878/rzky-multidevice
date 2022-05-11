module.exports = {
	name: "setleft",
	desc: "Change Text On Left",
	category: "group",
	use: "<text>",
	query: "enter text\n@subject subject group\n@ownergc owner group\n@user tag participant is left\n@creation when was the group created\n@desc descripdescription",
	isAdmin: true,
	isSpam: true,
	async run({ msg, conn }, { q }) {
		let dataNeeded = db.cekDatabase("left", "id", msg.from);
		if (!dataNeeded) throw "Left This group is not activated yet,\nActived on command: *#left 1*";
		let data = JSON.parse(require("fs").readFileSync("./database/left.json"));
		let da = data.find((a) => a.id == msg.from);
		da.teks = q;
		da.lastUpdate = Date.now();
		require("fs").writeFileSync("./database/left.json", JSON.stringify(data, null, 2));
		await msg.reply(
			"Left successfully changed\n\nOptions:\n@subject subject group\n@ownergc owner group\n@user tag participant is left\n@creation when was the group created\n@desc descripdescription"
		);
	},
};
