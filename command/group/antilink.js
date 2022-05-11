module.exports = {
	name: "antilink",
	desc: "activate the anti link group",
	use: "<1 / 0>",
	category: "group",
	query: "enter options\n1 = aktif\n0 = nonaktif",
	isGroup: true,
	isAdmin: true,
	isSpam: true,
	async run({ msg, conn }, { args, prefix }) {
		let data = JSON.parse(require("fs").readFileSync("./database/antilink.json"));
		let data2 = data.includes(msg.from);
		if (args[0] == 1) {
			if (data2) throw "been active before";
			db.modified("antilink", msg.from);
			await msg.reply(`Anti Link turned on successfully`);
		} else if (args[0] == 0) {
			if (!data2) throw "not active before";
			data.splice(data.indexOf(msg.from), 1);
			require("fs").writeFileSync("./database/antilink.json", JSON.stringify(data, null, 2));
			await msg.reply("successfully delete session Anti Link in this group");
		}
	},
};
