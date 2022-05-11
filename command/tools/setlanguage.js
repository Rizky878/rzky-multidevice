const translate = require("@vitalets/google-translate-api"),
	{ writeFileSync, readFileSync } = require("fs"),
	db = JSON.parse(readFileSync("./database/language.json"));

const getPosition = (userId, _dir) => {
	let position = null;
	Object.keys(_dir).forEach((i) => {
		if (_dir[i].id === userId) {
			position = i;
		}
	});
	return position;
};

module.exports = {
	name: "setlanguage",
	alias: ["setlang"],
	category: "tools",
	isSpam: true,
	use: "<language>",
	query: "Enter the Language you want to set",
	async run({ msg, conn }, { q }) {
		let language = Object.keys(translate.languages).splice(1);
		language.push("default");
		if (!language.includes(q))
			throw "Supported language:\n*Default Language:* default\n\n" + JSON.stringify(translate.languages, null, 2);
		let user = db.find((x) => x.jid == msg.sender);
		if (user) db.splice(getPosition(msg.sender, db), 1);
		if (q == "default") db.splice(getPosition(msg.sender, db));
		q == "default" ? "" : db.push({ jid: msg.sender, country: q });
		writeFileSync("./database/language.json", JSON.stringify(db));
		await msg.reply(`Success change language to "${q == "default" ? "default" : translate.languages[q]}"`);
	},
};
