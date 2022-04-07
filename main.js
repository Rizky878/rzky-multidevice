const {
	fetchLatestBaileysVersion,
	default: Baileys,
	useSingleFileAuthState,
	DisconnectReason,
} = require("@adiwajshing/baileys");
const log = require("pino");
const attribute = {};
const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");
const { color } = require("./lib");
const { session } = require("./config.json");
const handler = require("./handler");
const utils = require("./utils");
const { self } = require("./config.json");
const { state, saveState } = useSingleFileAuthState(path.join(__dirname, `./${session}`), log({ level: "silent" }));
attribute.prefix = "#";
attribute.command = new Map();
attribute.isSelf = self;

//Database game
attribute.tebakbendera = new Map();

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
				isQVideo: false,
				isQAudio: false,
				isQImage: false,
				isQSticker: false,
				isQDocument: false,
				isGroup: false,
				isBotAdmin: false,
				query: false,
				isPrivate: false,
                                isLimit: false,
				isLimitGame: false,
				isSpam: false,
				isPremium: false,
				isUrl: false,
				run: () => {},
			};
			let cmd = utils.parseOptions(cmdOptions, command);
			let options = {};
			for (var k in cmd) typeof cmd[k] == "boolean" ? (options[k] = cmd[k]) : k == "query" ? (options[k] = cmd[k]) : "";
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
		}
	});
	console.log(color("[INFO]", "yellow"), "command loaded!");
};
// cmd
ReadFitur();

const connect = async () => {
	let { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(`Menggunakan: ${version}, terbaru: ${isLatest}`);
	const conn = Baileys({
		printQRInTerminal: true,
		auth: state,
		logger: log({ level: "silent" }),
		version,
	});

	conn.ev.on("creds.update", saveState);
	conn.ev.on("connection.update", async (up) => {
		const { lastDisconnect, connection } = up;
		if (connection) {
			console.log("Status Koneksi: ", connection);
		}

		if (connection === "close") {
			let reason = new Boom(lastDisconnect.error).output.statusCode;
			if (reason === DisconnectReason.badSession) {
				console.log(`File Session Buruk, Hapus ${session} dan Scan Ulang`);
				conn.logout();
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Koneksi tertutup, menghubungkan ulang....");
				connect();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Koneksi hilang dari server, menghubungkan ulang...");
				connect();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Koneksi dirubah, Sesi baru lainnya masih terbuka, Tutup sesi saat ini dulu");
				conn.logout();
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Perangkat telah Log Out, Hapus ${session} dan Scan Lagi.`);
				conn.logout();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart diperlukan, Restarting...");
				connect();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Koneksi Time Out, Menghubungkan ulang...");
				connect();
			} else {
				conn.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
			}
		}
	});
	// messages.upsert
	conn.ev.on("messages.upsert", async (m) => {
		handler(m, conn, attribute);
	});
};
connect();
