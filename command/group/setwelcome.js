module.exports = {
	name: "setwelcome",
	desc: "Change Text On Welcome",
	use: "<text>",
	category: "group",
	query: "enter text\n@subject subject group\n@ownergc owner group\n@user tag participant is left\n@creation when was the group created\n@desc descripdescription",
	isAdmin: true,
	isSpam: true,
	async run({ msg, conn }, { q }) {
		let dataNeeded = db.cekDatabase("welcome", "id", msg.from);
		if (!dataNeeded) throw "Welcome This group is not activated yet,\nActived On Command: *#welcome 1*";
		let data = JSON.parse(require("fs").readFileSync("./database/welcome.json"));
		let da = data.find((a) => a.id == msg.from);
		da.teks = q;
		da.lastUpdate = Date.now();
		require("fs").writeFileSync("./database/welcome.json", JSON.stringify(data, null, 2));
		await msg.reply(
			"Welcome successfully changed\n\nOptions:\n@subject subject group\n@ownergc owner group\n@user tag participant is left\n@creation when was the group created\n@desc descripdescription"
		);
	},
};
