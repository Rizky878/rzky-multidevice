module.exports = {
	name: "buylimit",
	category: "other",
	isSpam: true,
	use: "<angka>",
	query: "Send an order *#buylimit* the limit amount you want to buy\n\nPrice 1 limit = $150 balance",
	async run(msg, conn, q) {
		if (q.includes("-")) throw `Don't use -`;
		if (isNaN(q)) throw `Must be a number`;
		let ane = Number(Math.floor(q) * 150);
		if (getBalance(msg.sender, balance) < ane) throw `Balance kamu tidak mencukupi untuk pembelian ini`;
		kurangBalance(msg.sender, ane, balance);
		giveLimit(msg.sender, Math.floor(q), limit);
		await msg.reply(
			`The limit purchase of ${q} was successful\n\nRemaining Balance : $${getBalance(
				msg.sender,
				balance
			)}\nRemaining Limit : ${getLimit(msg.sender, limitCount, limit)}/${limitCount}`
		);
	},
};
