module.exports = {
	name: "buyglimit",
	category: "other",
	isSpam: true,
	use: "<angka>",
	query: "Send an order *#buyglimit* the limit amount you want to buy\n\nPrice for 1 game limit = $150 balance",
	async run(msg, conn, q) {
		if (q.includes("-")) throw `Don't use -`;
		if (isNaN(q)) throw `Must be a number`;
		let ane = Number(Math.floor(q) * 150);
		if (getBalance(msg.sender, balance) < ane) throw `Your balance is not sufficient for this purchase`;
		kurangBalance(msg.sender, ane, balance);
		givegame(msg.sender, Math.floor(q), glimit);
		await msg.reply(
			`Purchase of game limit of ${q} was successful\n\nRemaining balance : $${getBalance(
				msg.sender,
				balance
			)}\nRemaining Game Limit : ${cekGLimit(msg.sender, gcount, glimit)}/${gcount}`
		);
	},
};
