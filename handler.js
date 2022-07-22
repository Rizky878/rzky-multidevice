require("./global.js");
require("./lib/Proto");
const { getBinaryNodeChild } = require("@adiwajshing/baileys");
const Baileys = require("@adiwajshing/baileys");
const { logger } = Baileys.DEFAULT_CONNECTION_CONFIG;
const { serialize } = require("./lib/serialize");
const fs = require("fs");
const { color, getAdmin, isUrl } = require("./lib");
const cooldown = new Map();
const prefix = "#";
const multi_pref = new RegExp("^[" + "!#%&?/;:,.~-+=".replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]");
const owner = config.owner;
function printSpam(conn, isGc, sender, groupName) {
	if (isGc) {
		return conn.logger.warn("Detect SPAM", color(sender.split("@")[0], "lime"), "in", color(groupName, "lime"));
	}
	if (!isGc) {
		return conn.logger.warn("Detect SPAM", color(sender.split("@")[0], "lime"));
	}
}

function printLog(isCmd, sender, msg, body, groupName, isGc) {
	addBalance(msg.sender, Math.floor(Math.random() * 20), balance);
	if (isCmd && isGc) {
		return console.log(
			color("[ COMMAND GC ]", "aqua"),
			color(sender.split("@")[0], "lime"),
			color(body, "aqua"),
			"in",
			color(groupName, "lime")
		);
	}
	if (isCmd && !isGc) {
		return console.log(color("[ COMMAND PC ]", "aqua"), color(sender.split("@")[0], "lime"), color(body, "aqua"));
	}
}
module.exports = handler = async (m, conn, map) => {
	try {
		if (m.type !== "notify") return;
		let ms = m.messages[0];
		ms.message =
			Object.keys(ms.message)[0] === "ephemeralMessage" ? ms.message.ephemeralMessage.message : ms.message;
		let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
		if (!msg.message) return;

		//self
		if (map.isSelf) {
			if (!msg.isSelf) return;
		}

		//detect msg type senderKey and delete in order to be able to respond
		if (Object.keys(msg.message)[0] == "senderKeyDistributionMessage")
			delete msg.message.senderKeyDistributionMessage;
		if (Object.keys(msg.message)[0] == "messageContextInfo") delete msg.message.messageContextInfo;
		if (msg.key && msg.key.remoteJid === "status@broadcast") return;
		if (
			msg.type === "protocolMessage" ||
			msg.type === "senderKeyDistributionMessage" ||
			!msg.type ||
			msg.type === ""
		)
			return;

		let { body, type } = msg;
		global.dashboard = JSON.parse(fs.readFileSync("./database/dashboard.json"));
		global.customLanguage = JSON.parse(fs.readFileSync("./database/language.json"));
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
		const args = body.trim().split(/ +/).slice(1);
		const comand = body.trim().split(/ +/)[0];
		let q = body.trim().split(/ +/).slice(1).join(" ");
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
		global.gcount = isPremium ? config.limit.gameLimitPremium : config.limit.gameLimitUser;
		global.limitCount = config.limit.limitUser;
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

		require("./res/EmitEvent.js")(msg, conn);

		// hayoloh dekk nyari adreply foto gede yahh ups:v
		conn.sendMessage = async (jid, content, options = { isTranslate: true }) => {
			await conn.presenceSubscribe(jid);
			const typeMes =
				content.image || content.text || content.video || content.document ? "composing" : "recording";
			await conn.sendPresenceUpdate(typeMes, jid);
			const cotent = content.caption || content.text || "";
			if (options.isTranslate) {
				const footer = content.footer || false;
				const customLang = customLanguage.find((x) => x.jid == msg.sender);
				const language = customLang ? customLang.country : false;
				if (customLang) {
					if (footer) footer = await rzky.tools.translate(footer, language);
					translate = await rzky.tools.translate(cotent, language);
					if (content.video || content.image) {
						content.caption = translate || cotent;
					} else {
						content.text = translate || cotent;
					}
				}
			}
			content.withTag
				? (content.mentions = [...cotent.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net"))
				: "";
			options.adReply
				? (content.contextInfo = {
						externalAdReply: {
							title: "© " + config.namebot,
							mediaType: 1,
							//renderLargerThumbnail: true,
							showAdAttribution: true,
							body:
								config.namebot +
								" multi-device whatsapp bot using JavaScript and made by " +
								config.ownername,
							thumbnail: await conn.getBuffer(config.thumb),
							sourceUrl: "https://github.com/Rizky878/rzky-multidevice/",
						},
				  })
				: "";
			if (
				typeof content === "object" &&
				"disappearingMessagesInChat" in content &&
				typeof content["disappearingMessagesInChat"] !== "undefined" &&
				Baileys.isJidGroup(jid)
			) {
				const { disappearingMessagesInChat } = content;
				const value =
					typeof disappearingMessagesInChat === "boolean"
						? disappearingMessagesInChat
							? Baileys.WA_DEFAULT_EPHEMERAL
							: 0
						: disappearingMessagesInChat;
				await conn.groupToggleEphemeral(jid, value);
			} else {
				const isDeleteMsg = "delete" in content && !!content.delete;
				const additionalAttributes = {};
				// required for delete
				if (isDeleteMsg) {
					additionalAttributes.edit = "7";
				}
				const contentMsg = await Baileys.generateWAMessageContent(content, {
					logger,
					userJid: conn.user.id,
					upload: conn.waUploadToServer,
					...options,
				});
				options.userJid = conn.user.id;
				const fromContent = await Baileys.generateWAMessageFromContent(jid, contentMsg, options);
				fromContent.key.id = "RZKY" + require("crypto").randomBytes(13).toString("hex").toUpperCase();
				await conn.relayMessage(jid, fromContent.message, {
					messageId: fromContent.key.id,
					additionalAttributes,
					userJid: conn.user.id,
				});
				process.nextTick(() => {
					conn.ev.emit("messages.upsert", {
						messages: [fromContent],
						type: "append",
					});
				});
				await conn.sendPresenceUpdate("paused", jid);
				return fromContent;
			}
		};

		// auto read
		await conn.readMessages([msg.key]);

		// topdf
		require("./lib/topdf")(msg, conn, map);

		// anti +212
		if (!isGroup && require("awesome-phonenumber")("+" + msg.sender.split("@")[0]).getCountryCode() == "212") {
			await conn.sendMessage(msg.from, { text: "Sorry i block you, Please read my whatsapp bio" });
			await require("delay")(3000);
			await conn.updateBlockStatus(msg.sender, "block");
			await conn.sendMessage(config.owner[0], {
				text: "*• Blocked Detected Number +212*\n\nwa.me/" + msg.sender.split("@")[0],
			});
		}
		if (require("awesome-phonenumber")("+" + msg.sender.split("@")[0]).getCountryCode() == "212") return;

		//Prem expired
		prem.expiredCheck(conn, msg, premium);

		// anti link
		if (isGroup) {
			await require("./lib/antilink")(msg, conn);
		}

		// Log
		printLog(isCmd, sender, msg, body, groupName, isGroup);

		//waktu
		require("./lib/optiongame").cekWaktu(conn, map, "tebakbendera");

		//game
		if (isGroup) {
			await require("./lib/game")(msg, conn, map);
		}

		const cmdName = body.slice(temp_pref.length).trim().split(/ +/).shift().toLowerCase();
		const cmd =
			map.command.get(msg.body.trim().split(/ +/).shift().toLowerCase()) ||
			[...map.command.values()].find((x) =>
				x.alias.find((x) => x.toLowerCase() == msg.body.trim().split(/ +/).shift().toLowerCase())
			) ||
			map.command.get(cmdName) ||
			[...map.command.values()].find((x) => x.alias.find((x) => x.toLowerCase() == cmdName));
		if (isCmd && !cmd) {
			var data = [...map.command.keys()];
			[...map.command.values()]
				.map((x) => x.alias)
				.join(" ")
				.replace(/ +/gi, ",")
				.split(",")
				.map((a) => data.push(a));
			var result = rzky.tools.detectTypo(cmdName, data);
			if (result.status != 200) return;
			teks = `Maybe this is what you mean?\n\n`;
			angka = 1;
			if (typeof result.result == "object" && typeof result.result != "undefined") {
				for (let i of result.result) {
					var alias =
						[...map.command.values()].find((x) => x.name == i.teks) ||
						[...map.command.values()].find((x) => x.alias.find((x) => x.toLowerCase() == i.teks));
					teks += `*${angka++}. ${map.prefix}${i.teks}*\n`;
					teks += `Alias: *${alias.alias.join(", ")}*\n`;
					teks += `Accuracy: *${i.keakuratan}*\n\n`;
				}
				teks += `If true, please re-command!`;
				await msg.reply(teks);
			}
		}

		if (
			!isCmd &&
			isUrl(msg.body) &&
			/tiktok.com|soundcloud.com|imgur.com|pin.it|pinterest.com|youtube.com|youtu.be/i.test(msg.body)
		) {
			try {
				var bod = isUrl(msg.body);
				var link = bod.find(
					(a) =>
						a.includes("tiktok.com") ||
						a.includes("pin.it") ||
						a.includes("youtube.com") ||
						a.includes("youtu.be") ||
						a.includes("pinterest.com") ||
						a.includes("imgur.com") ||
						a.includes("soundcloud.com")
				);
				let rz;
				await msg.reply("@" + sender.split("@")[0] + "\n" + response.wait, { withTag: true });
				if (link.includes("tiktok.com")) {
					rz = await rzky.downloader.tiktok(link);
				} else {
					rz = await rzky.downloader.downloaderAll(link);
				}
				if (rz.url) {
					var res = rz.mp4[rz.mp4.length - 1] || rz.mp3[rz.mp3.length - 1];
					delete rz.image;
					delete rz.status;
					delete rz.durasi;
					delete rz.mp4;
					delete rz.mp3;
					var parse = await rzky.tools.parseResult(rz, { title: "Auto Download" });
					await conn.sendFile(msg.from, res.url, Date.now() + "media.mp4", parse, msg);
				} else if (link.includes("tiktok.com")) {
					var resu = rz.result;
					rz.size = resu.video.nowm.size;
					rz.audio_name = resu.audio.audio_name;
					delete rz.result;
					await conn.sendMessage(
						msg.from,
						{
							video: { url: resu.video.nowm.video_url },
							caption: await rzky.tools.parseResult(rz, { title: "Auto Download" }),
							templateButtons: [
								{ urlButton: { displayText: "Source", url: link } },
								{ urlButton: { displayText: "Downloader", url: "https://down.rzkyfdlh.tech" } },
								{ quickReplyButton: { displayText: "Audio🎶", id: "#tiktokaudio " + link } },
							],
						},
						{ quoted: msg }
					);
				}
			} catch (e) {
				console.log(e);
			}
		}

		if (!cmd) return;
		if (!cooldown.has(from)) {
			cooldown.set(from, new Map());
		}
		const now = Date.now();
		const timestamps = cooldown.get(from);
		const cdAmount = (cmd.options.cooldown || 5) * 1000;
		if (timestamps.has(from)) {
			const expiration = timestamps.get(from) + cdAmount;
			if (now < expiration) {
				if (isGroup) {
					let timeLeft = (expiration - now) / 1000;
					printSpam(conn, isGroup, sender, groupName);
					return await conn.sendMessage(
						from,
						{
							text: `This group is on cooldown, please wait another _${timeLeft.toFixed(1)} second(s)_`,
						},
						{ quoted: msg }
					);
				} else if (!isGroup) {
					let timeLeft = (expiration - now) / 1000;
					printSpam(conn, isGroup, sender);
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
		let optionsCmd = cmd.options;
		if (optionsCmd.noPrefix) {
			if (isCmd) return;
			q = msg.body.split(" ").splice(1).join(" ");
		} else if (!optionsCmd.noPrefix) {
			if (!isCmd) return;
		}
		if (optionsCmd.isSpam) {
			timestamps.set(from, now);
		}
		if (cmd && cmd.category != "private") {
			let comand = dashboard.find((command) => command.name == cmd.name);
			if (comand) {
				comand.success += 1;
				comand.lastUpdate = Date.now();
				fs.writeFileSync("./database/dashboard.json", JSON.stringify(dashboard));
			} else {
				await db.modified("dashboard", { name: cmd.name, success: 1, failed: 0, lastUpdate: Date.now() });
			}
		}
		if (optionsCmd.isPremium && !isPremium) {
			await conn.sendMessage(msg.from, { text: response.OnlyPrem }, { quoted: msg });
			return true;
		}
		if (map.lockcmd.has(cmdName)) {
			let alasan = map.lockcmd.get(cmdName);
			return msg.reply(
				`Sorry bro "${conn.getName(sender)}"" command "${cmdName}" has been disabled by owner\nReason: *${
					alasan || "-"
				}*`
			);
		}
		if (optionsCmd.isLimit && !isPremium) {
			if (isLimit(msg.sender, isPremium, isOwner, limitCount, limit) && !msg.isSelf)
				return msg.reply(`Your limit has run out, please send ${prefix}limit to check the limit`);
			limitAdd(msg.sender, limit);
		}
		if (optionsCmd.isLimitGame) {
			if (isGame(msg.sender, isOwner, gcount, glimit) && !msg.iSelf)
				return msg.reply(`Your game limit has run out`);
			gameAdd(msg.sender, glimit);
		}
		if (optionsCmd.isAdmin && !isAdmin) {
			await conn.sendMessage(msg.from, { text: response.GrupAdmin }, { quoted: msg });
			return true;
		}
		if (optionsCmd.isQuoted && !msg.quoted) {
			await msg.reply(`Please reply message`);
			return true;
		}
		if (optionsCmd.isMedia) {
			let medianya = Media(optionsCmd.isMedia ? optionsCmd.isMedia : {});
			if (typeof medianya[0] != "undefined" && !medianya.includes(msg.quoted ? msg.quoted.mtype : []))
				return msg.reply(
					`Please reply *${medianya
						.map((a) => `${((aa = a.charAt(0).toUpperCase()), aa + a.slice(1).replace(/message/gi, ""))}`)
						.join("/")}*`
				);
		}
		if (optionsCmd.isOwner && !isOwner && !msg.isSelf) {
			await conn.sendMessage(msg.from, { text: response.OnlyOwner }, { quoted: msg });
			return true;
		}
		if (optionsCmd.isGroup && !isGroup) {
			await conn.sendMessage(msg.from, { text: response.OnlyGrup }, { quoted: msg });
			return true;
		}
		if (optionsCmd.isBotAdmin && !botAdmin) {
			await conn.sendMessage(msg.from, { text: response.BotAdmin }, { quoted: msg });
			return true;
		}
		if (optionsCmd.query && !q) {
			await msg.reply(
				typeof optionsCmd.query == "boolean" && optionsCmd.query ? `Masukan query` : optionsCmd.query
			);
			return true;
		}
		if (optionsCmd.isPrivate && !isPrivate) {
			await conn.sendMessage(msg.from, { text: response.OnlyPM }, { quoted: msg });
			return true;
		}
		if (optionsCmd.isUrl && !isUrl(q ? q : "p")) {
			await conn.sendMessage(msg.from, { text: response.error.Iv }, { quoted: msg });
			return true;
		}
		if (optionsCmd.wait) {
			await conn.sendMessage(
				msg.from,
				{ text: typeof optionsCmd.wait == "string" ? optionsCmd.wait : response.wait },
				{ quoted: msg }
			);
		}
		try {
			await cmd.run(
				{ msg, conn },
				{ owner: isOwner, q, map, args, arg, Baileys, prefix: temp_pref, response, chat: m, command: comand }
			);
		} catch (e) {
			if (cmd.category != "private") {
				let fail = dashboard.find((command) => command.name == cmd.name);
				fail.failed += 1;
				fail.success -= 1;
				fail.lastUpdate = Date.now();
				fs.writeFileSync("./database/dashboard.json", JSON.stringify(dashboard));
			}
			await msg.reply(require("util").format(e), { isTranslate: false });
		}
	} catch (e) {
		console.log(color("Error", "red"), e.stack);
	}
};
