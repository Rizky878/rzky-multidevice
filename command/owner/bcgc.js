module.exports = {
	name: "broadcastgroup",
	alias: ["bcgc"],
	desc: "Mengirim Chat Ke Group Yang bot punya",
	use: "<text>",
	category: "private",
	isOwner: true,
	query: "Masukan text yg ingin di bc",
	async run(msg, conn, q) {
		let getGroups = await conn.groupFetchAllParticipating();
		let groups = Object.entries(getGroups)
			.slice(0)
			.map((entry) => entry[1]);
		let anu = groups.map((v) => v.id);
		for (let i of anu) {
			await require("delay")(3000);
			await conn.sendMessage(i, { text: q + "\n\n*Broadcast Message*" });
		}
		await msg.reply("Sukses");
	},
};
