module.exports = async function (msg, conn, map) {
	const { toPDF } = require("./imgtopdf.js");
	const sizes = require("./pdfSize.json");
	const { sender, type, isGroup, body, from, quoted } = msg;
	const cekStat = map.pdf.has(sender);
	const sesi = map.pdf;
	const content = JSON.stringify(quoted);
	const isMedia = type === "imageMessage";
	const isQImg = msg.quoted ? /image/i.test(msg.quoted.mtype) : false;
	const size = Object.keys(sizes);

	// Only Private Chat
	if (isGroup) return;

	switch (body.toLowerCase()) {
		case "add":
			if (!cekStat) return;
			if (msg.quoted) {
				if (!isQImg) return msg.reply("reply photo");
			} else {
				if (!isMedia) return msg.reply("reply photo");
			}
			let media;
			if (isQImg) media = await quoted.download();
			if (isMedia) media = await msg.download();
			var ImageUrl = await rzky.tools.telegraph(media);
			sesi.get(sender).array.push(ImageUrl.url);
			await msg.reply(
				`Sukses Menambahkan Gambar,Kirim *Selesai* Jika Sudah\nJika ingin mencancel ketik *cancel*`
			);
			break;
		case "cancel":
			if (!cekStat) return;
			sesi.delete(sender);
			await msg.reply(`Sukses menghapus sesi Image To Pdf`);
			break;
		case "selesai":
			if (!cekStat) return;
			var result = sesi.get(sender);
			if (!result) return msg.reply(`Kamu belum menambahkan foto`);
			var angka = 1;
			var teks = "Size Lembaran PDF \n\n";
			for (let i of size) {
				teks += `*${angka++}*. ${i}\n`;
			}
			teks +=
				"\nSilahkan pilih size pdf yang kamu ingin kan, *Size Default _A4_*\n\nReply Pesan ini Dengan Size Yang kamu pilih";
			await msg.reply(teks);
			await conn.sendImage(from, "https://telegra.ph/file/2a3251d4089e573e02ebb.jpg", msg, {
				caption: "Contoh Penggunaan / Usage examples",
			});
			break;
		default:
			if (size.includes(body.toUpperCase()) && cekStat) {
				if (!quoted.text.includes("Size Lembaran PDF")) return;
				var result = sesi.get(sender);
				var buffer = await toPDF(result.array, body.toUpperCase());
				await msg.reply(`Mengirim PDF, Tunggu Sebentar`);
				await conn.sendFile(from, buffer, result.name + ".pdf", "", msg);
				await msg.reply(`Sukses mengirim`);
				return sesi.delete(sender);
			}
	}
};
