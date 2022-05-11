module.exports = {
	name: "changelog",
	category: "umum",
	isLimit: true,
	async run({ msg, conn }, { q, map, args }) {
		if (q) {
			const data = [];
			const name = q.toLowerCase();
			const { command, prefix } = map;
			const cmd = command.get(name) || [...command.values()].find((x) => x.alias.find((x) => x == args[0]));
			if (!cmd || cmd.type != "changelog") return await msg.reply("Recent command not found");
			else data.push(`*Name:* ` + cmd.name);
			if (cmd.alias) data.push(`*Alias:* ${cmd.alias.join(", ")}`);
			if (cmd.desc) data.push(`*Description:* ${cmd.desc}`);
			if (cmd.use)
				data.push(`*Use:* ${prefix}${cmd.name} ${cmd.use}\n\nNote: [] = optional, | = or, <> = must be filled`);

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
				cteg = info.category;
				if (info.type != "changelog") continue;
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
				`Hello, ${
					pushName === undefined ? sender.split("@")[0] : pushName
				}\n*Here is a list of the latest commands*\n\n===== [ *CHANGE LOG* ] =====\n\n`;
			const keys = Object.keys(category);
			//var a = 1
			for (const key of keys) {
				str += `*• ${key.toUpperCase()}*\n${category[key]
					.map(
						(cmd, index) =>
							`*${index + 1}.* *${cmd.options.noPrefix ? "" : "#"}${cmd.name}*${
								cmd.alias[0]
									? "\n" +
									  cmd.alias
											.map((a) => (a ? `*▸ ${cmd.options.noPrefix ? "" : "#"}${a}*` : ""))
											.join("\n")
									: ""
							}\n*Usage:* _${cmd.options.noPrefix ? "" : "#"}${cmd.name}${
								cmd.use ? " " + cmd.use : ""
							}_\n*Desc:* _${cmd.desc || "Nothing"}_`
					)
					.join("\n\n")}\n\n`;
			}
			str += `typing *${prefix}changelog runtime* for get the details and example use`;
			await conn.sendMessage(
				msg.from,
				{
					video: await conn.getBuffer(config.thumbvideo),
					gifPlayback: true,
					caption: str,
					footer: config.namebot + " • " + config.ownername,
					templateButtons: [
						{ urlButton: { displayText: "Shortlink", url: "https://sl.rzkyfdlh.tech" } },
						{ urlButton: { displayText: "Downloader", url: "https://downloader.rzkyfdlh.tech" } },
						{ quickReplyButton: { displayText: "Script Bot📑", id: "#script" } },
						{ quickReplyButton: { displayText: "Owner👥", id: "#owner" } },
						{ quickReplyButton: { displayText: "Dashboard📊", id: "#db" } },
					],
				},
				{ quoted: msg }
			);
		}
	},
};
