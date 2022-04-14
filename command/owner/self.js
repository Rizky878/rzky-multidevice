module.exports = {
	name: "self",
	alias: ["public"],
	category: "private",
	desc: "Merubah self and public",
	isSpam: true,
	isOwner: true,
	async run(msg, conn, q, map) {
		var command = msg.body.split(/ +/)[0].slice(1);
		switch (command) {
			case "public":
				if (!map.isSelf) throw "Sudah berada dalam mode public";
				map.isSelf = false;
				await msg.reply("Sukses mengubah ke mode public");
				break;
			case "self":
				if (map.isSelf) throw "Sudah berada dalam mode self";
				map.isSelf = true;
				config.owner.push(conn.decodeJid(conn.user.id));
				await msg.reply("Sukses mengubah ke mode self");
		}
	},
};
