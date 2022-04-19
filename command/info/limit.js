module.exports = {
	name: "limit",
	alias: ["cekglimit", "ceklimit", "glimit"],
	category: "info",
	desc: "check limit",
	isSpam: true,
	async run(msg, conn, q, map) {
		prefix = map.prefix;
		if (msg.mentions.length !== 0) {
			msg.reply(
				`Limit : ${
					prem.checkPremiumUser(msg.mentions[0], premium)
						? "Unlimited"
						: `${getLimit(msg.mentions[0], limitCount, limit)}/${limitCount}`
				}\nLimit Game : ${cekGLimit(msg.mentions[0], gcount, glimit)}/${gcount}\nBalance : $${getBalance(
					msg.mentions[0],
					balance
				)}\n\nYou can buy limit with ${prefix}buylimit and ${prefix}buyglimit to buy game limit`
			);
		} else {
			msg.reply(
				`Limit : ${
					isPremium ? "Unlimited" : `${getLimit(msg.sender, limitCount, limit)}/${limitCount}`
				}\nLimit Game : ${cekGLimit(msg.sender, gcount, glimit)}/${gcount}\nBalance : $${getBalance(
					msg.sender,
					balance
				)}\n\nYou can buy limit with ${prefix}buylimit dan ${prefix}buyglimit to buy game limit`
			);
		}
	},
};
