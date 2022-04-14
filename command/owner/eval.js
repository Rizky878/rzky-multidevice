module.exports = {
	name: "eval",
	alias: [">>", ">"],
	category: "private",
	noPrefix: true,
	isOwner: true,
	desc: "running javascript code via command can also test something code",
	use: `">" <code javascript> with await and ">>" <code> live return or immediately show the result`,
	query: `Masukan Parameter Code`,
	async run(msg, conn, q, map, args, arg) {
		let kode = msg.body.trim().split(/ +/)[0];
		let teks;
		try {
			teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`);
		} catch (e) {
			teks = e;
		} finally {
			await msg.reply(require("util").format(teks));
		}
	},
};
