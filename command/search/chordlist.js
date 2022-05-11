const axios = require("axios");
const clean = (data) => {
	let regex = /(<([^>]+)>)/gi;
	data = data.replace(/(<br?\s?\/>)/gi, " \n");
	return data.replace(regex, "");
};

module.exports = {
	name: "chord",
	alias: ["chordmusik", "musikchord", "chordmusic", "musicchord"],
	use: "<q>",
	category: "search",
	desc: "Searching for music chords",
	wait: true,
	query: "Enter song title!",
	isSpam: true,
	async run({ msg, conn }, { q, map, args }) {
		let data = await axios.get("http://app.chordindonesia.com/?json=get_search_results&search=" + q);
		let result = data.data;
		if (result.count < 0) throw "no chords for this song were found";
		await msg.reply("found " + result.count + " chords for this song");
		text = "*• Chord Music Search*\n\n";
		no = 1;
		for (let i of result.posts) {
			text += `*• Number:* ${no++}\n`;
			text += `*- ID:* ${i.id}\n`;
			text += `*- Title:* ${i.title.replace(/[0-9]|[#&;]/gi, "")}\n`;
			text += `*- Date:* ${i.date}\n`;
			text += `*- Author:* ${i.categories[0].title}\n\n`;
		}
		await msg.reply(text);
	},
};
