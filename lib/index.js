const chalk = require("chalk");
const moment = require("moment");
require("moment-duration-format")(moment);

exports.color = (text, color) => {
	return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

exports.getAdmin = async (conn, msg) => {
	var nganu = await conn.groupMetadata(msg.from);
	a = [];
	for (let i of nganu.participants) {
		if (i.admin == null) continue;
		a.push(i.id);
	}
	return a;
};

exports.convertTime = function (time) {
	return `${moment.duration(Date.now() - time).format("D [hari], H [jam], m [menit], s [detik]")}`;
};

exports.isUrl = (url) => {
	return url.match(
		new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
			"gi"
		)
	);
};
