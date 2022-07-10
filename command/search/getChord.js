const axios = require("axios");
const clean = (data) => {
	let regex = /(<([^>]+)>)/gi;
	data = data.replace(/(<br?\s?\/>)/gi, " \n");
	return data.replace(regex, "");
};

module.exports = {
	name: "getchord",
	alias: ["getchordmusik", "getmusikchord", "getchordmusic", "getmusicchord"],
	use: "<number>",
	category: "search",
	desc: "Searching for music chords",
	wait: true,
	isQuoted: true,
	query: "Enter number!",
	isSpam: true,
	async run({ msg, conn }, { q }) {
		if (!msg.quoted.text.split("*").includes("• Chord Music Search"))
			return msg.reply("Pesan bukan dari chord music search!");
		if (isNaN(q)) throw "Enter the correct number";
		let ID = msg.quoted.text.split("*- ID:*")[q].split("*- Title")[0].trim();
		let data = await axios.get("http://app.chordindonesia.com/?json=get_post&id=" + ID);
		let result = data.data;
		text = "*• Chord Music Found*\n";
		text += `*- Title:* ${result.post.title.replace(/[0-9]|[#&;]/gi, "")}\n\n`;
		text += clean(result.post.content);
		await msg.reply(text);
	},
};
