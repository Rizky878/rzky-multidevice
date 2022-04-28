module.exports = {
	name: "unlockcmd",
	alias: ["ulockcmd"],
	category: "private",
	isOwner: true,
	desc: "membuka fitur ",
	use: `<name command>`,
	query: `Masukan Parameter Nama Command`,
	async run({ msg, conn }, { q, map, args, arg }) {
		var data = [...map.command.keys()];
		[...map.command.values()]
			.map((x) => x.alias)
			.join(" ")
			.replace(/ +/gi, ",")
			.split(",")
			.map((a) => data.push(a));
		if (!data.includes(q)) throw "Command tidak ditemukan";
		if (!map.lockcmd.has(q)) throw "Command ini belum di lock sebelumnya";
		map.lockcmd.delete(q);
		await msg.reply(`Succes Membuka Lock Command "${q}"`);
	},
};
