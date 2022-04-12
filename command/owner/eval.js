module.exports = {
	name: "eval",
	alias: [">>", ">"],
	category: "private",
        noPrefix: true,
        isOwner: true,
	desc: "running javascript code via command can also test something code",
	use: `">" <code javascript> with await and ">>" <code> live return or immediately show the result`,
	async run(msg, conn, q, map, args, arg) {
		let kode = body.trim().split(/ +/);
		let teks;
		try {
			teks = await eval(`(async () => { ${q}})()`);
		} catch (e) {
			teks = e;
		} finally {
			await msg.reply(require("util").format(teks));
		}
	},
};
