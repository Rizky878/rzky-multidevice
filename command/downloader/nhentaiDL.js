const { NhentaiDL } = require("../../lib/nhentaidl");

module.exports = {
	name: "nhentai",
	alias: ["nh"],
	category: "downloader",
	desc: "downloader nhentai",
	query: "enter nhentai code!",
	isPrivate: true,
	isSpam: true,
	async run({ msg, conn }, { args }) {
		await NhentaiDL(msg, args, conn);
	},
};
