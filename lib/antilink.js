const { getBinaryNodeChild } = require("@adiwajshing/baileys");
const { getAdmin } = require("./index");
const antilink = JSON.parse(require("fs").readFileSync("./database/antilink.json"));

const cekInvite = async (conn, code) => {
	try {
		const results = await conn.query({
			tag: "iq",
			attrs: {
				type: "get",
				xmlns: "w:g2",
				to: "@g.us",
			},
			content: [{ tag: "invite", attrs: { code } }],
		});
		return results;
	} catch {
		return false;
	}
};

const extractGroupInviteMetadata = (content) => {
	const group = getBinaryNodeChild(content, "group");
	const descChild = getBinaryNodeChild(group, "description");
	const Participant = group.content.filter((a) => a.tag == "participant").map((a) => a.attrs);
	let desc, descId;
	if (descChild) {
		try {
			desc = getBinaryNodeChild(descChild, "body").content.toString();
			descId = descChild.attrs.id;
		} catch {
			descId = "";
			desc = "tidak ada";
		}
	}
	const groupId = group.attrs.id.includes("@") ? group.attrs.id : group.attrs.id + "@g.us";
	const metadata = {
		id: groupId,
		subject: group.attrs.subject || "Tidak ada",
		creator: group.attrs.creator || "Tidak terdeteksi",
		creation: group.attrs.creation || "Tidak terdeteksi",
		desc,
		descId,
		participant: Participant,
	};
	return metadata;
};

module.exports = async function (msg, conn) {
	const { body, sender, isGroup, from, reply } = msg;
	const regex = /chat.whatsapp.com\/([\w\d]*)/gi;
	code = body.match(regex);
	const isAdmin = isGroup ? (await getAdmin(conn, msg)).includes(sender) : false;
	const antiLink = antilink.includes(from);
	const botAdmin = isGroup ? (await getAdmin(conn, msg)).includes(conn.decodeJid(conn.user.id)) : false;
	if (antiLink && code && !isAdmin) {
		code = code[0].replace("chat.whatsapp.com/", "");
		if (!botAdmin) return reply("Bot is not admin to run anti link group command");
		await reply("Checking Link Invite...");
		const cekInviteGc = await cekInvite(conn, code);
		if (!cekInviteGc) return reply("Invalid Link, You Saved from kick");
		const InfoGroup = await extractGroupInviteMetadata(cekInviteGc);
		const Cheking = await conn.groupInviteCode(from);
		if (code == Cheking) return reply("Oh shit, Remember don't send other group links other than this group");
		const participant = InfoGroup.participant;
		teks = `*• Link Group Detected*\n\n`;
		teks += `*_Sorry you will be kicked out of this group for breaking the rules!_*\n\n`;
		InfoGroup.user = "@" + sender.split("@")[0];
		InfoGroup.creator = "@" + InfoGroup.creator.split("@")[0];
		InfoGroup.creation = require("moment")(InfoGroup.creation * 1000).format("dddd, DD/MM/YYYY");
		delete InfoGroup.participant;
		teks += (await rzky.tools.parseResult(InfoGroup, { title: "Inspect Group" })) + "\n\n";
		teks += `=== [ *Members* ] ===\n`;
		for (let i of participant) {
			teks += `➤ @${i.jid.split("@")[0]} ${i.type ? `*${i.type}*` : ""}\n`;
		}
		await reply(teks, { withTag: true });
		conn.logger.info("Kicked User " + sender + " Reason: Link Group");
		await require("delay")(3000);
		await conn.groupParticipantsUpdate(from, [sender], "remove").then(() => msg.reply("bye"));
	}
};

global.reloadFile(__dirname);
