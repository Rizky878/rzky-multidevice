module.exports = {
	name: "help",
	alias: ["h", "cmd", "menu"],
	category: "umum",
	async run(msg, conn, q, isOwner, body, map, config, args) {
		if (q) {
			const data = [];
			const name = q.toLowerCase();
			const { command, prefix } = map;
			const cmd = command.get(name) || [...command.values()].find((x) => x.alias.find((x) => x == args[0]));
			if (!cmd || cmd.category === "private") return await msg.reply("No command found");
			else data.push(`*Name:* ` + cmd.name);
			if (cmd.alias) data.push(`*Alias:* ${cmd.alias.join(", ")}`);
			if (cmd.desc) data.push(`*Description:* ${cmd.desc}`);
			if (cmd.use)
				data.push(`*Usage:* ${prefix}${cmd.name} ${cmd.use}\n\nNote: [] = optional, | = or, <> = must filled`);

			return await msg.reply(data.join("\n"));
		} else {
			const { pushName, sender } = msg;
			const { prefix, command } = map;
			const cmds = command.keys();
			let category = [];

			for (let cmd of cmds) {
				let info = command.get(cmd);
				if (!cmd) continue;
				if (config.ignore.directory.includes(info.category.toLowerCase())) continue;
				cteg = info.category || "No Category";
				if (!cteg || cteg === "private") continue;
				if (Object.keys(category).includes(cteg)) category[cteg].push(info);
				else {
					category[cteg] = [];
					category[cteg].push(info);
				}
			}
			let str =
				"```" +
				config.namebot +
				"```\n\n" +
				`Hello, ${pushName === undefined ? sender.split("@")[0] : pushName}\n*Here My Command List*\n\n`;
			const keys = Object.keys(category);
			for (const key of keys) {
				str += `*${key.toUpperCase()}*\n${category[key].map((cmd) => `• *${cmd.name}*`).join("\n")}\nUsage : *#${
					category[key].map((cmd) => cmd.name)[0]
				}*\n\n`;
			}
			str += `typing *${prefix}help sticker* for get the details and example use`;
			await conn.sendMessage(
				msg.from,
				{
					text: str,
					footer: config.namebot + " • " + config.ownername,
					templateButtons: [
						{ urlButton: { displayText: "Report Bug", url: "https://chat.rzkyfdlh.tech" } },
						{ urlButton: { displayText: "Downloader Website", url: "https://downloader.rzkyfdlh.tech" } },
					],
				},
				{ quoted: msg }
			);
		}
	},
};
