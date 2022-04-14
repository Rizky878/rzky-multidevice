const { getBinaryNodeChild } = require("@adiwajshing/baileys");

module.exports = {
	name: "inspect",
	alias: ["check", "inspectlink"],
	category: "other",
	use: "<link>",
	query: "No invite url.",
	wait: true,
	isSpam: true,
	async run(msg, conn, q) {
		const rex1 = /chat.whatsapp.com\/([\w\d]*)/g;
		const queryInvite = async (code) => {
			const results = await conn.query({
				tag: "iq",
				attrs: {
					type: "get",
					xmlns: "w:g2",
					to: "@g.us",
				},
				content: [{ tag: "invite", attrs: { code } }],
			});
			return extractGroupInviteMetadata(results);
		};
		let code = q.match(rex1);
		if (code === null) return await msg.reply("No invite url detected.");
		code = code[0].replace("chat.whatsapp.com/", "");
		const check = await queryInvite(code).catch(async () => {
			return msg.reply("Invalid invite url.");
		});
		const text =
			`Subject: ${check.subject}\nGroupId: ${check.id}${
				check.creator ? `\nCreator: ${check.creator.split("@")[0]}` : ""
			}\nCreate At: ${new Date(check.creation * 1000).toLocaleString()}` +
			`${check.desc ? `\nDesc: ${check.desc}\nDescId: ${check.descId}` : ""}\n\nJSON\n\`\`\`${JSON.stringify(
				check,
				null,
				4
			)}\`\`\``;
		await msg.reply(text);
	},
};

const extractGroupInviteMetadata = (content) => {
	const group = getBinaryNodeChild(content, "group");
	const descChild = getBinaryNodeChild(group, "description");
	let desc, descId;
	if (descChild) {
		desc = getBinaryNodeChild(descChild, "body").content.toString();
		descId = descChild.attrs.id;
	}
	const groupId = group.attrs.id.includes("@") ? group.attrs.id : group.attrs.id + "@g.us";
	const metadata = {
		id: groupId,
		subject: group.attrs.subject || "Tidak ada",
		creator: group.attrs.creator || "Tidak terdeteksi",
		creation: group.attrs.creation || "Tidak terdeteksi",
		desc,
		descId,
	};
	return metadata;
};
