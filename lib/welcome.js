const fs = require("fs");

module.exports = async (conn, msg) => {
	require("moment").locale("id");
	let groupData = await conn.groupMetadata(msg.id);
	let participant = msg.participants;
	let dataLeft = db.cekDatabase("left", "id", msg.id) || { id: "" };
	let dataWelcome = db.cekDatabase("welcome", "id", msg.id) || { id: "" };
	if (msg.action == "add") global.statParticipant = true;
	for (let i of participant) {
		let ppimg;
		try {
			ppimg = await conn.profilePictureUrl(i, "image");
		} catch {
			ppimg = config.thumb;
		}
		if (msg.action == "add" && dataWelcome.id.includes(msg.id)) {
			await conn.sendMessage(msg.id, {
				image: { url: ppimg },
				withTag: true,
				caption:
					dataWelcome.teks
						.replace("@ownergc", `${groupData.owner ? groupData.owner.split("@")[0] : "Tidak Diketahui"}`)
						.replace(
							"@creation",
							require("moment")(new Date(parseInt(groupData.creation) * 1000)).format(
								"DD MMM YYYY HH:mm:ss"
							)
						)
						.replace("@user", `@${i.split("@")[0]}`)
						.replace("@desc", groupData.desc ? groupData.desc.toString() : "no description")
						.replace("@subject", groupData.subject) +
					`${
						dataWelcome.lastUpdate
							? `\n\n*Last Modified:* ${require("moment")(dataWelcome.lastUpdte).format(
									"dddd, DD/MM/YYYY"
							  )}`
							: ""
					}`,
			});
		} else if (msg.action == "remove" && dataLeft.id.includes(msg.id)) {
			await conn.sendMessage(msg.id, {
				image: { url: ppimg },
				withTag: true,
				caption:
					dataLeft.teks
						.replace("@ownergc", `${groupData.owner ? groupData.owner.split("@")[0] : "Tidak Diketahui"}`)
						.replace(
							"@creation",
							require("moment")(new Date(parseInt(groupData.creation) * 1000)).format(
								"DD MMM YYYY HH:mm:ss"
							)
						)
						.replace("@user", `@${i.split("@")[0]}`)
						.replace("@desc", groupData.desc ? groupData.desc.toString() : "no description")
						.replace("@subject", groupData.subject) +
					`${
						dataLeft.lastUpdate
							? `\n\n*Last Modified:* ${require("moment")(dataLeft.lastUpdte).format("dddd, DD/MM/YYYY")}`
							: ""
					}`,
			});
		}
	}
};
