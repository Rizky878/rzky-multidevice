const phoneNum = require("awesome-phonenumber");

module.exports = {
	name: "me",
	alias: ["profile"],
	desc: "gatau",
	wait: true,
	isSpam: true,
	category: "info",
	async run({ msg, conn }) {
		var tol = `${msg.sender.split("@")[0]}`;
		var bio;
		try {
			bio = await conn.fetchStatus(msg.sender);
		} catch {
			bio = "Bio Not found";
		}
		try {
			var pp = await conn.profilePictureUrl(msg.sender, "image");
		} catch {
			var pp = "https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png";
		}
		var gender = await require("axios").get(
			"https://api.genderize.io/?name=" + encodeURIComponent(conn.getName(msg.sender))
		);
		var from = await phoneNum("+" + msg.sender.split("@")[0]).getRegionCode();
		var Country = await require("country-language").getCountry(from);

		txt = `*Profile Ingfo*\n\n`;
		txt += `*• Name :* ${conn.getName(msg.sender)}\n`;
		txt += `*• Tag :* @${msg.sender.split("@")[0]}\n`;
		txt += `*• About :* ${bio.status || bio}\n`;
		txt += `*• Number :* ${phoneNum("+" + tol.replace("@s.whatsapp.net", "")).getNumber("international")}\n`;
		txt += `*• Jenis kelamin :* ${gender.data.gender || "male" == "male" ? "Laki-Laki" : "Perempuan"}\n`;
		txt += `*• From:* ${Country.name}\n`;
		txt += `*• Link :* https://wa.me/${msg.sender.split("@")[0]}`;
		//msg.reply(txt, {withTag: true})
		conn.sendMessage(msg.from, {
			image: { url: pp },
			caption: txt,
			mentions: [msg.sender],
		});
	},
};
