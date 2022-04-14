module.exports = {
	name: "buylimit",
	category: "other",
	isSpam: true,
	use: "<angka>",
	query: "Kirim perintah *#buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $150 balance",
	async run(msg, conn, q) {
		if (q.includes("-")) throw `Jangan menggunakan -`;
		if (isNaN(q)) throw `Harus berupa angka`;
		let ane = Number(Math.floor(q) * 150);
		if (getBalance(msg.sender, balance) < ane) throw `Balance kamu tidak mencukupi untuk pembelian ini`;
		kurangBalance(msg.sender, ane, balance);
		giveLimit(msg.sender, Math.floor(args[0]), limit);
		await msg.reply(
			`Pembeliaan limit sebanyak ${q} berhasil\n\nSisa Balance : $${getBalance(
				msg.sender,
				balance
			)}\nSisa Limit : ${getLimit(msg.sender, limitCount, limit)}/${limitCount}`
		);
	},
};
