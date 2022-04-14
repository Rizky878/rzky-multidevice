const { proto, jidDecode, downloadContentFromMessage, getContentType } = require("@adiwajshing/baileys"),
	path = require("path"),
	fetch = require("node-fetch"),
	fs = require("fs"),
	{ fromBuffer } = require("file-type"),
	{ isUrl } = require("./index"),
	{ toOpus, toAudio, convert, convert2 } = require("./convert"),
	{ toPTT, toAudio: toAudio2 } = require("./converter"),
	cmd = {
		1: [
			"-fs 1M",
			"-vcodec",
			"libwebp",
			"-vf",
			`scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`,
		],
		2: ["-fs 1M", "-vcodec", "libwebp"],
	};

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
async function serialize(msg, conn) {
	conn.decodeJid = (jid) => {
		if (/:\d+@/gi.test(jid)) {
			const decode = jidDecode(jid) || {};
			return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
		} else return jid.trim();
	};
	/**
	 * getBuffer hehe
	 * @param {String|Buffer} path
	 * @param {Boolean} returnFilename
	 */
	conn.getFile = async (PATH, returnAsFilename) => {
		let res, filename;
		let data = Buffer.isBuffer(PATH)
			? PATH
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
		let type = (await fromBuffer(data)) || {
			mime: "application/octet-stream",
			ext: ".bin",
		};
		if (data && returnAsFilename && !filename)
			(filename = path.join(__dirname, "../temp/" + new Date() * 1 + "." + type.ext)),
				await fs.promises.writeFile(filename, data);
		return {
			res,
			filename,
			...type,
			data,
		};
	};
	conn.getBuffer = async (url, options) => {
		try {
			options ? options : {};
			const res = await require("axios")({
				method: "get",
				url,
				headers: {
					DNT: 1,
					"Upgrade-Insecure-Request": 1,
				},
				...options,
				responseType: "arraybuffer",
			});
			return res.data;
		} catch (e) {
			console.log(`Error : ${e}`);
		}
	};
	conn.sendSticker = async (jid, url, quoted, option = {}) => {
		let ext;
		let buf = url;
		if (!Buffer.isBuffer(url)) buf = await conn.getBuffer(url);
		if (!Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		if (Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		url =
			ext == "mp4"
				? await convert2(buf, ext.ext, "webp", cmd[parseInt(option.cmdType ? option.cmdType : 1)])
				: await convert(buf, ext.ext, "webp", cmd[parseInt(option.cmdType ? option.cmdType : 1)]);
		let sticker = { url };
		console.log(url);
		return conn.sendMessage(jid, { sticker: url }, { quoted });
	};

	conn.sendImage = async (jid, url, quoted, option = {}) => {
		let ext;
		let buf = url;
		if (!Buffer.isBuffer(url)) buf = await conn.getBuffer(url);
		if (!Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		if (Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		let type = /jpg|png|webp/i.test(ext.ext);
		if (!type) return ReferenceError(`Format file invalid`);
		url =
			ext.ext !== "webp"
				? await convert(buf, ext.ext, "jpg", cmd[parseInt(option.cmdType ? option.cmdType : 1)])
				: buf;
		return conn.sendMessage(jid, { image: url }, { quoted });
	};

	conn.sendVideo = async (jid, url, quoted, option = {}) => {
		let ext;
		let buf = url;
		if (!Buffer.isBuffer(url)) buf = await conn.getBuffer(url);
		if (!Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		if (Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		let type = /gif|webm|mp4/i.test(ext.ext);
		if (!type) return ReferenceError(`Format file invalid`);
		url =
			ext.ext !== "mp4"
				? await convert(buf, ext.ext, "mp4", cmd[parseInt(option.cmdType ? option.cmdType : 1)])
				: buf;
		return conn.sendMessage(jid, { video: url, mimetype: ext.mimetype }, { quoted });
	};
	conn.sendAudio = async (jid, url, quoted, ptt = false, option = {}) => {
		let ext;
		let buf = url;
		if (!Buffer.isBuffer(url)) buf = await conn.getBuffer(url);
		if (!Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		if (Buffer.isBuffer(url)) ext = await fromBuffer(buf);
		let type = /mp3|wav|opus|m4a/i.test(ext.ext);
		if (!type) return ReferenceError(`Format file invalid`);
		url =
			ext.ext !== "mp3"
				? await convert(buf, ext.ext, "mp3", cmd[parseInt(option.cmdType ? option.cmdType : 1)])
				: buf;
		return conn.sendFile(msg.from, url, Date.now() / 1000 + ext.ext, "", quoted, ptt);
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
		let opt = { filename };
		if (quoted) opt.quoted = quoted;
		if (!type) if (options.asDocument) options.asDocument = true;
		let mtype = "",
			mimetype = type.mime;
		let naem = (a) => "./temp/" + filename + "." + a;
		if (/webp/.test(type.mime)) mtype = "sticker";
		else if (/image/.test(type.mime)) mtype = "image";
		else if (/video/.test(type.mime)) mtype = "video";
		else if (/audio/.test(type.mime))
			(ss = await (ptt ? toPTT : toAudio2)(file, type.ext)),
				(skk = await require("file-type").fromBuffer(ss.data)),
				require("fs").writeFileSync(naem(skk.ext), ss.data),
				(pathFile = naem(skk.ext)),
				(mtype = "audio"),
				(mimetype = "audio/mpeg");
		else mtype = "document";
		return await conn.sendMessage(
			jid,
			{
				...options,
				caption,
				ptt,
				[mtype]: { url: pathFile },
				mimetype,
			},
			{
				...opt,
				...options,
			}
		);
	};
	if (msg.key) {
		msg.id = msg.key.id;
		msg.isSelf = msg.key.fromMe;
		msg.from = msg.key.remoteJid;
		msg.isGroup = msg.from.endsWith("@g.us");
		msg.sender = msg.isGroup
			? conn.decodeJid(msg.key.participant)
			: msg.isSelf
			? conn.decodeJid(conn.user.id)
			: msg.from;
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
			? msg.message[msg.type].contextInfo.mentionedJid || []
			: [];
		try {
			const quoted = msg.message[msg.type].contextInfo;
			if (quoted.quotedMessage["ephemeralMessage"]) {
				const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
				if (tipe === "viewOnceMessage") {
					msg.quoted = {
						type: "view_once",
						stanzaId: quoted.stanzaId,
						sender: conn.decodeJid(quoted.participant),
						message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message,
					};
				} else {
					msg.quoted = {
						type: "ephemeral",
						stanzaId: quoted.stanzaId,
						sender: conn.decodeJid(quoted.participant),
						message: quoted.quotedMessage.ephemeralMessage.message,
					};
				}
			} else if (quoted.quotedMessage["viewOnceMessage"]) {
				msg.quoted = {
					type: "view_once",
					stanzaId: quoted.stanzaId,
					sender: conn.decodeJid(quoted.participant),
					message: quoted.quotedMessage.viewOnceMessage.message,
				};
			} else {
				msg.quoted = {
					type: "normal",
					stanzaId: quoted.stanzaId,
					sender: conn.decodeJid(quoted.participant),
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
