const { proto, jidDecode, downloadContentFromMessage, getContentType } = require("@adiwajshing/baileys");
const path = require("path"),
	fetch = require("node-fetch");
const fs = require("fs");
const { fromBuffer } = require("file-type");
const { toAudio } = require("./convert");

const downloadMedia = (message, pathFile) =>
	new Promise(async (resolve, reject) => {
		const type = Object.keys(message)[0];
		let mimeMap = {
			imageMessage: "image",
			videoMessage: "video",
			stickerMessage: "sticker",
			documentMessage: "document",
			audioMessage: "audio",
		};
		try {
			if (pathFile) {
				const stream = await downloadContentFromMessage(message[type], mimeMap[type]);
				let buffer = Buffer.from([]);
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk]);
				}
				await fs.promises.writeFile(pathFile, buffer);
				resolve(pathFile);
			} else {
				const stream = await downloadContentFromMessage(message[type], mimeMap[type]);
				let buffer = Buffer.from([]);
				for await (const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk]);
				}
				resolve(buffer);
			}
		} catch (e) {
			reject(e);
		}
	});
/**
 * Thanks to Faiz Bastomi
 * parse message for easy use
 * @param {proto.IWebMessageInfo} msg
 * @param {import("@adiwajshing/baileys/src").AnyWAconnet} conn
 */
async function serialize(msg, conn) {
	conn.decodeJid = (jid) => {
		if (/:\d+@/gi.test(jid)) {
			const decode = jidDecode(jid) || {};
			return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
		} else return jid.trim();
	};
	conn.getFile = async (PATH, saveToFile = false) => {
		let res, filename;
		const data = Buffer.isBuffer(PATH)
			? PATH
			: PATH instanceof ArrayBuffer
			? PATH.toBuffer()
			: /^data:.*?\/.*?;base64,/i.test(PATH)
			? Buffer.from(PATH.split`,`[1], "base64")
			: /^https?:\/\//.test(PATH)
			? await (res = await fetch(PATH)).buffer()
			: fs.existsSync(PATH)
			? ((filename = PATH), fs.readFileSync(PATH))
			: typeof PATH === "string"
			? PATH
			: Buffer.alloc(0);
		if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
		const type = (await fromBuffer(data)) || {
			mime: "application/octet-stream",
			ext: ".bin",
		};
		if (data && saveToFile && !filename)
			(filename = path.join(__dirname, "../temp/" + new Date() * 1 + "." + type.ext)),
				await fs.promises.writeFile(filename, data);
		return {
			res,
			filename,
			...type,
			data,
			deleteFile() {
				return filename && fs.promises.unlink(filename);
			},
		};
	};
	conn.sendFile = async (jid, path, filename = "", caption = "", quoted, ptt = false, options = {}) => {
		let type = await conn.getFile(path, true);
		let { res, data: file, filename: pathFile } = type;
		if ((res && res.status !== 200) || file.length <= 65536) {
			try {
				throw { json: JSON.parse(file.toString()) };
			} catch (e) {
				if (e.json) throw e.json;
			}
		}
		const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
		if (fileSize >= 100) throw new Error("File size is too big!");
		let opt = {};
		if (quoted) opt.quoted = quoted;
		if (!type) options.asDocument = true;
		let mtype = "",
			mimetype = options.mimetype || type.mime,
			convert;
		if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = "sticker";
		else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = "image";
		else if (/video/.test(type.mime)) mtype = "video";
		else if (/audio/.test(type.mime))
			(convert = await toAudio(file, type.ext)),
				(file = convert.data),
				(pathFile = convert.filename),
				(mtype = "audio"),
				(mimetype = options.mimetype || "audio/ogg; codecs=opus");
		else mtype = "document";
		if (options.asDocument) mtype = "document";

		delete options.asSticker;
		delete options.asLocation;
		delete options.asVideo;
		delete options.asDocument;
		delete options.asImage;

		let message = {
			...options,
			caption,
			ptt,
			[mtype]: { url: pathFile },
			mimetype,
			fileName: filename || pathFile.split("/").pop(),
		};
		/**
		 * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
		 */
		let m;
		try {
			m = await conn.sendMessage(jid, message, { ...opt, ...options });
		} catch (e) {
			console.error(e);
			m = null;
		} finally {
			if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
			file = null; // releasing the memory
			return m;
		}
	};
	if (msg.key) {
		msg.id = msg.key.id;
		msg.isSelf = msg.key.fromMe;
		msg.from = msg.key.remoteJid;
		msg.isGroup = msg.from.endsWith("@g.us");
		msg.sender = msg.isGroup ? conn.decodeJid(msg.key.participant) : msg.from;
	}
	if (msg.message) {
		msg.type = getContentType(msg.message);
		if (msg.type === "ephemeralMessage") {
			msg.message = msg.message[msg.type].message;
			const tipe = Object.keys(msg.message)[0];
			msg.type = tipe;
			if (tipe === "viewOnceMessage") {
				msg.message = msg.message[msg.type].message;
				msg.type = getContentType(msg.message);
			}
		}
		if (msg.type === "viewOnceMessage") {
			msg.message = msg.message[msg.type].message;
			msg.type = getContentType(msg.message);
		}

		msg.mentions = Object.keys(msg.message[msg.type]).includes("contextInfo")
			? msg.message[msg.type].contextInfo.mentionedJid
			: [];
		try {
			const quoted = msg.message[msg.type].contextInfo;
			if (quoted.quotedMessage["ephemeralMessage"]) {
				const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
				if (tipe === "viewOnceMessage") {
					msg.quoted = {
						type: "view_once",
						stanzaId: quoted.stanzaId,
						participant: conn.decodeJid(quoted.participant),
						message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
					};
				} else {
					msg.quoted = {
						type: "ephemeral",
						stanzaId: quoted.stanzaId,
						participant: conn.decodeJid(quoted.participant),
						message: quoted.quotedMessage.ephemeralMessage.message,
					};
				}
			} else if (quoted.quotedMessage["viewOnceMessage"]) {
				msg.quoted = {
					type: "view_once",
					stanzaId: quoted.stanzaId,
					participant: conn.decodeJid(quoted.participant),
					message: quoted.quotedMessage.viewOnceMessage.message,
				};
			} else {
				msg.quoted = {
					type: "normal",
					stanzaId: quoted.stanzaId,
					participant: conn.decodeJid(quoted.participant),
					message: quoted.quotedMessage,
				};
			}
			msg.quoted.isSelf = msg.quoted.participant === conn.decodeJid(conn.user.id);
			msg.quoted.mtype = Object.keys(msg.quoted.message).filter(
				(v) => v.includes("Message") || v.includes("conversation")
			)[0];
			msg.quoted.text =
				msg.quoted.message[msg.quoted.mtype].text ||
				msg.quoted.message[msg.quoted.mtype].description ||
				msg.quoted.message[msg.quoted.mtype].caption ||
				(msg.quoted.mtype == "templateButtonReplyMessage" &&
					msg.quoted.message[msg.quoted.mtype].hydratedTemplate["hydratedContentText"]) ||
				msg.quoted.message[msg.quoted.mtype] ||
				"";
			msg.quoted.key = {
				id: msg.quoted.stanzaId,
				fromMe: msg.quoted.isSelf,
				remoteJid: msg.from,
			};
			msg.quoted.delete = () => conn.sendMessage(msg.from, { delete: msg.quoted.key });
			msg.quoted.download = (pathFile) => downloadMedia(msg.quoted.message, pathFile);
		} catch (e) {
			msg.quoted = null;
		}
		msg.body =
			msg.message.conversation ||
			msg.message[msg.type].text ||
			msg.message[msg.type].caption ||
			(msg.type === "listResponseMessage" && msg.message[msg.type].singleSelectReply.selectedRowId) ||
			(msg.type === "buttonsResponseMessage" &&
				msg.message[msg.type].selectedButtonId &&
				msg.message[msg.type].selectedButtonId) ||
			(msg.type === "templateButtonReplyMessage" && msg.message[msg.type].selectedId) ||
			"";
		msg.reply = (text) => conn.sendMessage(msg.from, { text }, { quoted: msg });
		msg.download = (pathFile) => downloadMedia(msg.message, pathFile);
	}
	return msg;
}

module.exports = { serialize, downloadMedia };
