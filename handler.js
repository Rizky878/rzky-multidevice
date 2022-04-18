require("./global.js")
const { getBinaryNodeChild } = require("@adiwajshing/baileys");
const { serialize } = require("./lib/serialize");
const fs = require("fs");
const { color, getAdmin, isUrl } = require("./lib");
const cooldown = new Map();
const prefix = "#";
const multi_pref = new RegExp("^[" + "!#%&?/;:,.~-+=".replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]");
const owner = config.owner;
function printSpam(isGc, sender, groupName) {
	if (isGc) {
		return console.log(color("[SPAM]", "red"), color(sender.split("@")[0], "lime"), "in", color(groupName, "lime"));
	}
	if (!isGc) {
		return console.log(color("[SPAM]", "red"), color(sender.split("@")[0], "lime"));
	}
}

function printLog(isCmd, sender, msg, body, groupName, isGc) {
	addBalance(msg.sender, Math.floor(Math.random() * 20), balance);
	if (isCmd && isGc) {
		return console.log(color("[EXEC]", "aqua"), color(sender, "lime"), color(body, "aqua"), "in", color(groupName, "lime"));
	}
	if (isCmd && !isGc) {
		return console.log(color("[EXEC]", "aqua"), color(sender, "lime"), color(body, "aqua"));
	}
}
module.exports = handler = async (m, conn, map) => {
	try {
		if (m.type !== "notify") return;
		let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
		if (!msg.message) return;

		//self
		if (map.isSelf) {
			if (!msg.isSelf) return;
		}

		//detect msg type senderKey and delete in order to be able to respond
		if (Object.keys(msg.message)[0] == "senderKeyDistributionMessage") delete msg.message.senderKeyDistributionMessage;
		if (Object.keys(msg.message)[0] == "messageContextInfo") delete msg.message.messageContextInfo;
		if (msg.key && msg.key.remoteJid === "status@broadcast") return;
		if (msg.type === "protocolMessage" || msg.type === "senderKeyDistributionMessage" || !msg.type || msg.type === "") return;

		let { body, type } = msg;
		const { isGroup, sender, from } = msg;
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : "";
		const groupName = isGroup ? groupMetadata.subject : "";
		const isAdmin = isGroup ? (await getAdmin(conn, msg)).includes(sender) : false;
		const isPrivate = msg.from.endsWith("@s.whatsapp.net");
		const botAdmin = isGroup ? (await getAdmin(conn, msg)).includes(conn.decodeJid(conn.user.id)) : false;
		const isOwner = owner.includes(sender);

		let temp_pref = multi_pref.test(body) ? body.split("").shift() : "#";
		if (body) {
			body = body.startsWith(temp_pref) ? body : "";
		} else {
			body = "";
		}

		const arg = body.substring(body.indexOf(" ") + 1);
		const args = body
			.trim()
			.split(/ +/)
			.slice(1);
		const comand = body.trim().split(/ +/)[0];
		q = args.join(" ");
		const isCmd = body.startsWith(temp_pref);

		//type message
		const isVideo = type === "videoMessage";
		const isImage = type === "imageMessage";
		const isLocation = type === "locationMessage";
		const contentQ = msg.quoted ? JSON.stringify(msg.quoted) : [];
		const isQAudio = type === "extendedTextMessage" && contentQ.includes("audioMessage");
		const isQVideo = type === "extendedTextMessage" && contentQ.includes("videoMessage");
		const isQImage = type === "extendedTextMessage" && contentQ.includes("imageMessage");
		const isQDocument = type === "extendedTextMessage" && contentQ.includes("documentMessage");
		const isQSticker = type === "extendedTextMessage" && contentQ.includes("stickerMessage");
		const isQLocation = type === "extendedTextMessage" && contentQ.includes("locationMessage");
		global.isPremium = prem.checkPremiumUser(msg.sender, premium);
		global.gcount = isPremium ? 30 : 10;
		global.limitCount = 30;
		const Media = (media = {}) => {
			list = [];
			if (media.isQAudio) {
				list.push("audioMessage");
			}
			if (media.isQVideo) {
				list.push("videoMessage");
			}
			if (media.isQImage) {
				list.push("imageMessage");
			}
			if (media.isQDocument) {
				list.push("documentMessage");
			}
			if (media.isQSticker) {
				list.push("stickerMessage");
			}
			return list;
		};

		//Prem expired
		prem.expiredCheck(conn, msg, premium);
		// Log
		printLog(isCmd, sender, msg, body, groupName, isGroup);

		//waktu
		require("./lib/optiongame").cekWaktu(conn, map, "tebakbendera");
		//game
		if (isGroup) {
			await require("./lib/game")(msg, conn, map);
		}

		const cmdName = body
			.slice(temp_pref.length)
			.trim()
			.split(/ +/)
			.shift()
			.toLowerCase();
		const cmd =
			map.command.get(
				msg.body
					.trim()
					.split(/ +/)
					.shift()
					.toLowerCase()
			) ||
			[...map.command.values()].find(x =>
				x.alias.find(
					x =>
						x.toLowerCase() ==
						msg.body
							.trim()
							.split(/ +/)
							.shift()
							.toLowerCase()
				)
			) ||
			map.command.get(cmdName) ||
			[...map.command.values()].find(x => x.alias.find(x => x.toLowerCase() == cmdName));
		if (isCmd && !cmd) {
			var data = [...map.command.keys()];
			var result = rzky.tools.detectTypo(cmdName, data);
			if (result.status == 404) return;
			teks = "";
			angka = 1;
			for (let i of result.result) {
				var alias = [...map.command.values()].find(x => x.name == i.teks);
				teks += `Mungkin ini yang kamu maksud?\n\n`;
				teks += `*${angka++}. ${map.prefix}${i.teks}*\n`;
				teks += `Alias: *${alias.alias.join(", ")}*\n`;
				teks += `Keakuratan: *${i.keakuratan}*\n\n`;
			}
			teks += `Jika benar silahkan command ulang`;
			await msg.reply(teks);
		} else if (!cmd) return;
		if (!cooldown.has(from)) {
			cooldown.set(from, new Map());
		}
		const now = Date.now();
		const timestamps = cooldown.get(from);
		const cdAmount = (cmd.cooldown || 5) * 1000;
		if (timestamps.has(from)) {
			const expiration = timestamps.get(from) + cdAmount;
			if (now < expiration) {
				if (isGroup) {
					let timeLeft = (expiration - now) / 1000;
					printSpam(isGroup, sender, groupName);
					return await conn.sendMessage(
						from,
						{
							text: `This group is on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`,
						},
						{ quoted: msg }
					);
				} else if (!isGroup) {
					let timeLeft = (expiration - now) / 1000;
					printSpam(isGroup, sender);
					return await conn.sendMessage(
						from,
						{
							text: `You are on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`,
						},
						{ quoted: msg }
					);
				}
			}
		}
		setTimeout(() => timestamps.delete(from), cdAmount);
		const options = cmd.options;
		if (options.noPrefix) {
			if (isCmd) return;
			q = msg.body
				.split(" ")
				.splice(1)
				.join(" ");
		} else if (!options.noPrefix) {
			if (!isCmd) return;
		}
		if (options.isSpam) {
			timestamps.set(from, now);
		}
		if (options.isPremium && !isPremium) {
			await msg.reply(response.OnlyPrem);
			return true;
		}
		if (options.isLimit && !isPremium) {
			if (isLimit(msg.sender, isPremium, isOwner, limitCount, limit)) return msg.reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`);
			limitAdd(msg.sender, limit);
		}
		if (options.isLimitGame) {
			if (isGame(msg.sender, isOwner, gcount, glimit)) return msg.reply(`Limit game kamu sudah habis`);
			gameAdd(msg.sender, glimit);
		}
		if (options.isAdmin && !isAdmin) {
			await msg.reply(response.GroupAdmin);
			return true;
		}
		if (options.isQuoted && !msg.quoted) {
			await msg.reply(`Silahkan reply pesan`);
			return true;
		}
		if (options.isMedia) {
			let medianya = Media(options.isMedia ? options.isMedia : {});
			if (typeof medianya[0] != "undefined" && !medianya.includes(msg.quoted ? msg.quoted.mtype : []))
				return msg.reply(`Silahkan reply *${medianya.map(a => `${((aa = a.charAt(0).toUpperCase()), aa + a.slice(1).replace(/message/gi, ""))}`).join("/")}*`);
		}
		if (options.isOwner && !isOwner) {
			await msg.reply(response.OnlyOwner);
			return true;
		}
		if (options.isGroup && !isGroup) {
			await msg.reply(response.OnlyGrup);
			return true;
		}
		if (options.isBotAdmin && !botAdmin) {
			await msg.reply(response.BotAdmin);
			return true;
		}
		if (options.query && !q) {
			await msg.reply(typeof options.query == "boolean" && options.query ? `Masukan query` : options.query);
			return true;
		}
		if (options.isPrivate && !isPrivate) {
			await msg.reply(response.OnlyPM);
			return true;
		}
		if (options.isUrl && !isUrl(q ? q : "p")) {
			await msg.reply(response.error.Iv);
			return true;
		}
		if (options.wait) {
			await msg.reply(typeof options.wait == "string" ? options.wait : response.wait);
		}
		try {
			await cmd.run(msg, conn, q, map, args, arg);
		} catch (e) {
			await msg.reply(require("util").format(e));
		}
	} catch (e) {
		console.log(color("Error", "red"), e.stack);
	}
};
