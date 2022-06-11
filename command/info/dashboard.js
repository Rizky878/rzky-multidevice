module.exports = {
	name: "dashboard",
	alias: ["db"],
	desc: "display " + config.namebot + " bot dashboard info",
	category: "info",
	isSpam: true,
	wait: true,
	async run({ msg, conn }, { q, prefix, map }) {
		if (q) {
			var data =
				[...map.command.values()].find((a) => a.name == q.toLowerCase()) ||
				[...map.command.values()].find((x) => x.alias.find((a) => a == q.toLowerCase()));
			if (!data) throw "Feature not found";
			let findData = dashboard.find((a) => a.name == data.name.toLowerCase());
			teks = `*• Dashboard ${config.namebot}*\n\n`;
			teks += `*➢ #${findData.name}* : ${findData.success + findData.failed}\n`;
			teks += `*⌘ Success:* ${findData.success}\n`;
			teks += `*⌘ Failed:* ${findData.failed}\n`;
			teks += `*⌘ Last Used:* ${require("moment")(findData.lastUpdate).fromNow()}\n\n`;
			await msg.reply(teks, { adReply: true });
		} else {
			dashboard = dashboard.sort(function (a, b) {
				return b.success - a.success;
			});
			let success = dashboard.map((a) => a.success);
			let failed = dashboard.map((a) => a.failed);
			let jumlah = require("mathjs").evaluate(success.join("+")) + require("mathjs").evaluate(failed.join("+"));
			let teks = `*• Dashboard ${config.namebot}*\n\n*➤ Global HIT*\n\n`;
			teks += `*➢ HIT*\n`;
			teks += `*⌘ Global:* ${jumlah}\n`;
			teks += `*⌘ Success:* ${require("mathjs").evaluate(success.join("+"))}\n`;
			teks += `*⌘ Failed:* ${require("mathjs").evaluate(failed.join("+"))}\n\n`;
			teks += `*➤ Most Command Global*\n\n`;
			let dbny = dashboard.length > 5 ? 5 : dashboard.length;
			for (let i = 0; i < dbny; i++) {
				teks += `*➢ #${dashboard[i].name}* : ${dashboard[i].success + dashboard[i].failed}\n`;
				teks += `*⌘ Success:* ${dashboard[i].success}\n`;
				teks += `*⌘ Failed:* ${dashboard[i].failed}\n`;
				teks += `*⌘ Last Used:* ${require("moment")(dashboard[i].lastUpdate).fromNow()}\n\n`;
			}
			teks += `Type *${prefix}dashboard <name command>* to find out the command data.\nUsage: *${prefix}dashboard help*`;
			await msg.reply(teks, { adReply: true });
		}
	},
};
