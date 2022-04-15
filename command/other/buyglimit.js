module.exports = {
	name: "buyglimit",
	category: "other",
	isSpam: true,
	use: "<angka>",
	query: "Kirim perintah *#buyglimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit game = $150 balance",
	async run(msg, conn, q) {
		if (q.includes("-")) throw `Jangan menggunakan -`;
		if (isNaN(q)) throw `Harus berupa angka`;
		let ane = Number(Math.floor(q) * 150);
		if (getBalance(msg.sender, balance) < ane) throw `Balance kamu tidak mencukupi untuk pembelian ini`;
		kurangBalance(msg.sender, ane, balance);
		givegame(msg.sender, Math.floor(q), glimit);
		await msg.reply(
			`Pembeliaan game limit sebanyak ${q} berhasil\n\nSisa Balance : $${getBalance(
				msg.sender,
				balance
			)}\nSisa Game Limit : ${cekGLimit(msg.sender, gcount, glimit)}/${gcount}`
		);
	},
};
