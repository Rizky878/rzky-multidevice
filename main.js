const {
	fetchLatestBaileysVersion,
	makeInMemoryStore,
	default: Baileys,
	useSingleFileAuthState,
	jidDecode,
	DisconnectReason,
	delay,
} = require("@adiwajshing/baileys");

const log = (pino = require("pino"));
const attribute = {};
const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");
const { color } = require("./lib");
const { session } = require("./config.json");
const handler = require("./handler");
const WelcomeHandler = require("./lib/welcome");
const utils = require("./utils");
const cron = require("node-cron");
const Spinnies = require("spinnies");
const spinnies = new Spinnies({
	spinner: {
		interval: 200,
		frames: ["∙∙∙", "●∙∙", "∙●∙", "∙∙●", "∙∙∙"],
	},
});
const moment = require("moment");
const { self } = require("./config.json");
const { state, saveState } = useSingleFileAuthState(path.join(__dirname, `./${session}`), log({ level: "silent" }));
attribute.prefix = "#";

// Set country code
moment.tz.setDefault(config.timezone).locale(config.locale);
global.moment = moment;

// page anime search
attribute.page = new Map();

// uptime
attribute.uptime = new Date();

// sesu pdf
attribute.pdf = new Map();

// command
attribute.command = new Map();

// database game
global.addMap = (x) => {
	attribute[x] = new Map();
};

// lock cmd
attribute.lockcmd = new Map();

// self
attribute.isSelf = self;

// store
global.store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

// Delete database chat
const chatsData = cron.schedule(
	"*/10 * * * *", // 10 minutes per delete
	() => {
		try {
			fs.rmSync(path.join(__dirname, "database", "mess.json"));
			db.addDatabase("mess", "[]");
			console.log(color("[ INFO ]", "aqua"), "Delete Database Chat, Cache Temp");
			file = fs.readdirSync("./temp").map((a) => "./temp/" + a);
			file.map((a) => fs.unlinkSync(a));
		} catch (e) {
			console.log(e);
		}
	},
	{ scheduled: true, timezone: config.timezone }
);
const limitData = cron.schedule(
	"0 0 * * *", // 00 hours per delete
	() => {
		try {
			limit.splice("reset");
			fs.writeFileSync("./database/limit.json", JSON.stringify(limit, null, 2));
			console.log(color("[ INFO ]", "aqua"), "Reset Limit all");
		} catch (e) {
			console.log(e);
		}
	},
	{ scheduled: true, timezone: config.timezone }
);

let data = fs.readFileSync(path.join(__dirname, "doom.flf"), "utf8");
require("figlet").parseFont("doom", data);
require("figlet").text(
	"RZKY MD",
	{
		font: "doom",
		horizontalLayout: "default",
		verticalLayout: "default",
		width: 80,
		whitespaceBreak: true,
	},
	function (err, data) {
		if (err) {
			console.log("Something went wrong...");
			console.dir(err);
			return;
		}
		console.clear();
		console.log(color(data, "cyan"));
	}
);
const ReadFitur = () => {
	let pathdir = path.join(__dirname, "./command");
	let fitur = fs.readdirSync(pathdir);
	spinnies.add("spinner-1", { text: "Loading commands..", color: "green" });
	fitur.forEach(async (res) => {
		const commands = fs.readdirSync(`${pathdir}/${res}`).filter((file) => file.endsWith(".js"));
		for (let file of commands) {
			const command = require(`${pathdir}/${res}/${file}`);
			if (typeof command.run != "function") continue;
			const cmdOptions = {
				name: "command",
				alias: [""],
				desc: "",
				use: "",
				cooldown: 5,
				type: "", // default: changelog
				category: typeof command.category == "undefined" ? "" : res.toLowerCase(),
				wait: false,
				isOwner: false,
				isAdmin: false,
				isQuoted: false,
				isGroup: false,
				isBotAdmin: false,
				query: false,
				isPrivate: false,
				isLimit: false,
				isLimitGame: false,
				isSpam: false,
				noPrefix: false,
				isMedia: {
					isQVideo: false,
					isQAudio: false,
					isQImage: false,
					isQSticker: false,
					isQDocument: false,
				},
				isPremium: false,
				disable: false,
				isUrl: false,
				run: () => {},
			};
			let cmd = utils.parseOptions(cmdOptions, command);
			let options = {};
			for (var k in cmd)
				typeof cmd[k] == "boolean"
					? (options[k] = cmd[k])
					: k == "query" || k == "isMedia"
					? (options[k] = cmd[k])
					: "";
			let cmdObject = {
				name: cmd.name,
				alias: cmd.alias,
				desc: cmd.desc,
				use: cmd.use,
				type: cmd.type,
				category: cmd.category,
				options: options,
				run: cmd.run,
			};
			attribute.command.set(cmd.name, cmdObject);
			require("delay")(100);
			global.reloadFile(`./command/${res}/${file}`);
		}
	});
	spinnies.succeed("spinner-1", { text: "Command loaded successfully", color: "yellow" });
};
// cmd
ReadFitur();

const connect = async () => {
	let { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(color(`Using: ${version}, newer: ${isLatest}`, "yellow"));
	const conn = Baileys({
		printQRInTerminal: true,
		auth: state,
		logger: log({ level: "silent" }),
		version,
	});

	// start
	chatsData.start();
	limitData.start();

	// game data
	conn.game = conn.game ? conn.game : {};

	const decodeJid = (jid) => {
		if (/:\d+@/gi.test(jid)) {
			const decode = jidDecode(jid) || {};
			return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
		} else return jid;
	};

	const getBuffer = async (url, options) => {
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

	store.bind(conn.ev);

	ikyEvent.on("viewOnceMessage", async (get) => {
		await conn.sendMessage(
			get.remoteJid,
			{ text: `@${get.participant.split("@")[0]} Terdeteksi Mengirim view once...`, withTag: true },
			{ quoted: get.message }
		);
		await conn.sendMessage(get.remoteJid, { forward: get.message }, { quoted: get.message });
	});

	conn.ev.on("creds.update", saveState);
	conn.ev.on("connection.update", async (up) => {
		const { lastDisconnect, connection } = up;
		if (connection) spinnies.add("spinner-2", { text: "Connecting to the WhatsApp bot...", color: "cyan" });
		if (connection == "connecting")
			spinnies.add("spinner-2", { text: "Connecting to the WhatsApp bot...", color: "cyan" });
		if (connection) {
			if (connection != "connecting")
				spinnies.update("spinner-2", { text: "Connection: " + connection, color: "yellow" });
		}
		if (connection == "open")
			spinnies.succeed("spinner-2", { text: "Successfully connected to whatsapp", color: "green" });

		if (connection === "close") {
			let reason = new Boom(lastDisconnect.error).output.statusCode;
			if (reason === DisconnectReason.badSession) {
				console.log(`Bad Session File, Please Delete ${session} and Scan Again`);
				conn.logout();
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				connect();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				connect();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
				conn.logout();
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Device Logged Out, Please Delete ${session} and Scan Again.`);
				conn.logout();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
				connect();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
				connect();
			} else {
				conn.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
			}
		}
	});

	//mager
	conn.addMessage = (msg, type) => {
		if (type == "protocolMessage") return;
		let from = msg.key.remoteJid;
		return db.modified("mess", { id: msg.key.id, msg });
	};

	//anticall
	conn.ws.on("CB:call", async (json) => {
		if (json.content[0].tag == "offer") {
			conn.sendMessage(json.content[0].attrs["call-creator"], {
				text: `Terdeteksi Menelpon BOT!\nSilahkan Hubungi Owner Untuk Membuka Block !\n\nNomor Owner: \n${config.owner
					.map(
						(a) =>
							`*wa.me/${a.split(`@`)[0]}* | ${
								conn.getName(a).includes("+62") ? "No Detect" : conn.getName(a)
							}`
					)
					.join("\n")}`,
			});
			await require("delay")(8000);
			await conn.updateBlockStatus(json.content[0].attrs["call-creator"], "block");
		}
	});

	//contact update
	conn.ev.on("contacts.update", (m) => {
		for (let kontak of m) {
			let jid = decodeJid(kontak.id);
			if (store && store.contacts) store.contacts[jid] = { jid, name: kontak.notify };
		}
	});

	// I don't know what's the point hehe
	if (!fs.existsSync("./src") || !fs.existsSync("./src/rzky-md.jpg")) {
		fs.mkdir("./src", async function (err) {
			if (err) {
				if (!fs.existsSync("./src/rzky-md.jpg")) {
					fs.writeFile("./src/rzky-md.jpg", (await require("axios")(config.thumb)).data, function (err) {
						if (err) {
							console.log(color("[INFO]", "yellow"), "error writing file", err);
						} else {
							console.log(color("[INFO]", "yellow"), "writing thumbnail succeeded");
						}
					});
				}
				fs.existsSync("./src/rzky-md.jpg")
					? console.log(color("[INFO]", "yellow"), "failed to create directory", err)
					: "";
			} else {
				console.log(color("[INFO]", "yellow"), `Succes create a "src" file`);
				fs.writeFile("./src/rzky-md.jpg", (await require("axios")(config.thumb)).data, function (err) {
					if (err) {
						console.log(color("[INFO]", "yellow"), "error writing file", err);
					} else {
						console.log(color("[INFO]", "yellow"), "writing thumbnail succeeded");
					}
				});
			}
		});
	}

	// detect Reaction message
	conn.ev.on("messages.reaction", async (m) => {
		if (m.reaction.key.id.startsWith("BAE5") && m.reaction.key.id.length === 16) return;
		let mesg = await store.loadMessage(m.reaction.key.remoteJid, m.key.id, conn);
		let frem = m.reaction.key.remoteJid.endsWith("@g.us") ? m.reaction.key.participant : m.reaction.key.remoteJid;
		let frum = m.key.remoteJid.endsWith("@g.us") ? m.key.participant : m.key.remoteJid;
		await conn.sendMessage(
			m.reaction.key.remoteJid,
			{
				text: `*【﻿ ${m.operation == "add" ? "ADD" : "DELETE"} REACTION 】*\n\n*_Tagged:_* @${
					(m.reaction.key.fromMe ? decodeJid(conn.user.id) : decodeJid(frem)).split("@")[0]
				}\n*_To:_* ${frum ? `@${frum.split("@")[0]}` : `-`}\n*_Emoji:_* ${
					m.operation == "add" ? m.reaction.text : "-"
				}`,
				withTag: true,
			},
			{ quoted: mesg }
		);
	});

	// detect group update
	conn.ev.on("groups.update", async (json) => {
		const res = json[0];
		if (res.announce == true) {
			conn.sendMessage(res.id, {
				text: `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`,
			});
		} else if (res.announce == false) {
			conn.sendMessage(res.id, {
				text: `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`,
			});
		} else if (res.restrict == true) {
			conn.sendMessage(res.id, {
				text: `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`,
			});
		} else if (res.restrict == false) {
			conn.sendMessage(res.id, {
				text: `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`,
			});
		} else {
			conn.sendMessage(res.id, {
				text: `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${res.subject}*`,
			});
		}
	});

	// Anti delete dek
	conn.ev.on("message.delete", async (m) => {
		if (!m) m = {};
		let data2 = db.cekDatabase("antidelete", "id", m.remoteJid || "");
		if (typeof data2 != "object") return;
		const dataChat = JSON.parse(fs.readFileSync("./database/mess.json"));
		let mess = dataChat.find((a) => a.id == m.id);
		let mek = mess.msg;
		if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;
		let participant = mek.key.remoteJid.endsWith("@g.us")
			? decodeJid(mek.key.participant)
			: decodeJid(mek.key.remoteJid);
		let froms = mek.key.remoteJid;
		await conn.sendMessage(
			froms,
			{
				text:
					"Hayoloh ngapus apaan @" +
					participant.split("@")[0] +
					`\n\n*➤ Info*\n*• Participant:* ${participant.split("@")[0]}\n*• Delete message:* ${moment(
						Date.now()
					).format("dddd, DD/MM/YYYY HH:mm:ss")}\n*• Message send:* ${moment(
						mek.messageTimestamp * 1000
					).format("dddd, DD/MM/YYYY HH:mm:ss")}\n*• Type:* ${Object.keys(mek.message)[0]}`,
				mentions: [participant],
			},
			{ quoted: mek }
		);
		await conn.relayMessage(froms, mek.message, { messageId: mek.key.id });
	});

	// welcome
	conn.ev.on("group-participants.update", async (msg) => {
		WelcomeHandler(conn, msg);
	});

	// messages.upsert
	conn.ev.on("messages.upsert", async (m) => {
		const msg = m.messages[0];
		if (msg.key.id.startsWith("BAE5") && msg.key.id.length === 16) return;
		const type = msg.message ? Object.keys(msg.message)[0] : "";
		let dataCek = db.cekDatabase("antidelete", "id", msg.key.remoteJid);
		if (dataCek) conn.addMessage(msg, type);
		if (msg && type == "protocolMessage") conn.ev.emit("message.delete", msg.message.protocolMessage.key);
		handler(m, conn, attribute);
	});
};
connect();

if (config.server)
	require("http")
		.createServer((__, res) => res.end("Server Running!"))
		.listen(8080);

process.on("uncaughtException", function (err) {
	console.error(err);
});
