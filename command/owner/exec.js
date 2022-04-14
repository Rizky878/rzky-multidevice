let cp = require("child_process");
let { promisify } = require("util");
let exec = promisify(cp.exec).bind(cp);

module.exports = {
	name: "$",
	alias: ["exec"],
	category: "private",
	noPrefix: true,
	isOwner: true,
	async run(msg, conn, q) {
		await msg.reply("Executing...");
		let o;
		try {
			o = await exec(q);
		} catch (e) {
			o = e;
		} finally {
			let { stdout, stderr } = o;
			if (stdout.trim()) msg.reply(stdout);
			if (stderr.trim()) msg.reply(stderr);
		}
	},
};
