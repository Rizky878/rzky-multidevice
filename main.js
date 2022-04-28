const {
	fetchLatestBaileysVersion,
	makeInMemoryStore,
	default: Baileys,
	useSingleFileAuthState,
	jidDecode,
	DisconnectReason,
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
const { self } = require("./config.json");
const { state, saveState } = useSingleFileAuthState(path.join(__dirname, `./${session}`), log({ level: "silent" }));
attribute.prefix = "#";

// command
attribute.command = new Map();

// database game
attribute.tebakbendera = new Map();

// lock cmd (not released yet)
attribute.lockcmd = new Map();

// self
attribute.isSelf = self;

// store
global.store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

// Delete database chat
const chatsData = cron.schedule(
	"*/5 * * * *",
	() => {
		fs.rmSync(path.join(__dirname, "database", "mess.json"));
		console.log(color("[ INFO ]", "aqua"), "Delete Database Chat and writing again");
		db.addDatabase("mess", "[]");
	},
	{ scheduled: true, timezone: config.timezone }
);

const ReadFitur = () => {
	let pathdir = path.join(__dirname, "./command");
	let fitur = fs.readdirSync(pathdir);
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
				category: cmd.category,
				options: options,
				run: cmd.run,
			};
			attribute.command.set(cmd.name, cmdObject);
			require("delay")(100);
			global.reloadFile(`./command/${res}/${file}`);
		}
	});
	console.log(color("[INFO]", "yellow"), "command loaded!");
};
// cmd
ReadFitur();

const connect = async () => {
	let { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(`Using: ${version}, newer: ${isLatest}`);
	const conn = Baileys({
		printQRInTerminal: true,
		auth: state,
		logger: log({ level: "silent" }),
		version,
	});

	// start
	chatsData.start();

	const decodeJid = (jid) => {
		if (/:\d+@/gi.test(jid)) {
			const decode = jidDecode(jid) || {};
			return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
		} else return jid.trim();
	};

	store.bind(conn.ev);

	conn.ev.on("creds.update", saveState);
	conn.ev.on("connection.update", async (up) => {
		const { lastDisconnect, connection } = up;
		if (connection) {
			console.log("Connection Status: ", connection);
		}

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

	// Anti delete dek
	conn.ev.on("message.delete", async (m) => {
		let data2 = db.cekDatabase("antidelete", "id", m.remoteJid);
		if (!data2) return;
		const dataChat = JSON.parse(fs.readFileSync("./database/mess.json"));
		let mess = dataChat.find((a) => a.id == m.id);
		let mek = mess.msg;
		let participant = mek.key.remoteJid.endsWith("@g.us") ? mek.key.participant : mek.key.remoteJid;
		let froms = mek.key.remoteJid;
		await conn.sendMessage(
			froms,
			{ text: "Hayoloh ngapus apaan @" + participant.split("@")[0], mentions: [participant] },
			{ quoted: mek }
		);
		await conn.sendMessage(froms, { forward: mek }, { quoted: mek });
	});

	// welcome
	conn.ev.on("group-participants.update", async (msg) => {
		WelcomeHandler(conn, msg);
	});

	// messages.upsert
	conn.ev.on("messages.upsert", async (m) => {
		const msg = m.messages[0];
		const type = msg.message ? Object.keys(msg.message)[0] : "";
                let dataCek = db.cekDatabase("antidelete", "id", msg.key.remoteJid)
		if(dataCek) conn.addMessage(msg, type);
		if (msg && type == "protocolMessage") conn.ev.emit("message.delete", msg.message.protocolMessage.key);
		handler(m, conn, attribute);
	});
};
connect();

process.on("uncaughtException", function (err) {
	console.error(err);
});
