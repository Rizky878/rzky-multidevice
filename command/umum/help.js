const hari = moment.tz(config.timezone).format("a");
const ucapanWaktu = hari.charAt(0).toUpperCase() + hari.slice(1);
const processTime = (timestamp, now) => {
	return moment.duration(now - moment(timestamp * 1000)).asSeconds();
};

module.exports = {
	name: "help",
	alias: ["h", "cmd", "menu"],
	category: "umum",
	isLimit: true,
	async run({ msg, conn }, { q, owner, map, args }) {
		if (q) {
			const data = [];
			const name = q.toLowerCase();
			const { command, prefix } = map;
			const cmd = command.get(name) || [...command.values()].find((x) => x.alias.find((x) => x == args[0]));
			if (!cmd || (cmd.category === "hidden" && !config.owner.includes(msg.sender)))
				return await msg.reply("Command not found");
			else data.push(`*Name:* ` + cmd.name);
			if (cmd.alias) data.push(`*Alias:* ${cmd.alias.join(", ")}`);
			if (cmd.desc) data.push(`*Deskripsi:* ${cmd.desc}`);
			if (cmd.use)
				data.push(`*Use:* ${prefix}${cmd.name} ${cmd.use}\n\nNote: [] = optional, | = or, <> = must be filled`);

			return await msg.reply(data.join("\n"));
		} else {
			const { pushName, sender } = msg;
			const { prefix, command } = map;
			const cmds = command.keys();
			let category = [];
			const xes = require("parse-ms")(prem.getPremiumExpired(msg.sender, premium) - Date.now());
			dashboard = dashboard.sort(function (a, b) {
				return b.success - a.success;
			});

			for (let cmd of cmds) {
				let info = command.get(cmd);
				if (!cmd) continue;
				if (config.ignore.directory.includes(info.category.toLowerCase())) continue;
				cteg = info.category || "No Category";
				if (info.type == "changelog") continue;
				if (cteg == "hidden") continue;
				if (!cteg || cteg === "private") cteg = "owner command";
				if (Object.keys(category).includes(cteg)) category[cteg].push(info);
				else {
					category[cteg] = [];
					category[cteg].push(info);
				}
			}
			let str = `「 *${config.namebot}* 」
	
◪ *Time*
❏ ${moment.tz(config.timezone).format("HH:mm:ss")}

◪ *Speed*
❏ ${processTime(msg.messageTimestamp, moment())} _seconds_

◪ *Date*
❏ ${moment.tz(config.timezone).format("dddd, DD/MM/YYYY")}

◪ *INFO USER*
❏ Nomer: 「  ${msg.sender.split("@")[0]} 」
❏ Nama: 「  ${conn.getName(msg.sender)} 」
❏ Status: 「 ${isPremium ? "Premium" : owner ? "Owner" : "Standar"} 」
${isPremium ? `❏ Expired: 「 ${xes.days} D ${xes.hours} H ${xes.minutes} M 」\n` : ""}

◪ *Fitur terpopuler saat ini*
${
	dashboard[0]
		? `1. *${prefix}${dashboard[0].name}* dipakai sebanyak *${dashboard[0].success + dashboard[0].failed}* kali`
		: ``
}
${
	dashboard[1]
		? `2. *${prefix}${dashboard[1].name}* dipakai sebanyak *${dashboard[1].success + dashboard[1].failed}* kali`
		: ``
}
${
	dashboard[2]
		? `3. *${prefix}${dashboard[2].name}* dipakai sebanyak *${dashboard[2].success + dashboard[2].failed}* kali\n\n`
		: ``
}`;
			const keys = Object.keys(category);
			//var a = 1
			for (const key of keys) {
				str += `*❏ ${key.toUpperCase()}*\n${category[key]
					.map(
						(cmd, index) =>
							`*${index + 1}.* *${cmd.options.noPrefix ? "" : "#"}${cmd.name}* ${
								cmd.category == "private"
									? ""
									: cmd.use
									? cmd.use.replace(">", " 」").replace("<", "「 ")
									: ""
							}`
					)
					.join("\n")}\n\n`;
			}
			str += `typing *${prefix}help sticker* for get the details and example use`;
			await conn.sendMessage(
				msg.from,
				{
					video: { url: config.thumbvideo },
					caption: str,
					gifPlayback: true,
					footer: config.namebot + " • " + config.ownername,
					templateButtons: [
						{ urlButton: { displayText: "Shortlink", url: "https://sl.rzkyfdlh.tech" } },
						{ urlButton: { displayText: "Downloader", url: "https://down.rzkyfdlh.tech" } },
						{ quickReplyButton: { displayText: "Script Bot📑", id: "#script" } },
						{ quickReplyButton: { displayText: "Changelog📋", id: "#changelog" } },
						{ quickReplyButton: { displayText: "Dashboard📊", id: "#db" } },
					],
				},
				{ quoted: msg }
			);
		}
	},
};
