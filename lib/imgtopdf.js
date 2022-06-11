const pdfkit = require("pdfkit");
const sizes = require("./pdfSize.json");
const fetch = require("node-fetch");

/**
 *
 * Thanks to Arya-Was
 * @param {Array} images array of image
 * @param {String} size default A4
 * @returns
 */

function toPDF(images = [], size = "A4") {
	return new Promise(async (resolve, reject) => {
		if (!Array.isArray(images)) throw new TypeError("images must be an array");
		let _size = sizes[size];
		if (!_size) throw new Error("Size is invalid!");
		let buffs = [];
		const doc = new pdfkit({ margin: 0, size: sizes[size] });
		for (let img of images) {
			const resp = await fetch(img);
			const data = await resp.buffer();
			doc.image(data, 0, 0, {
				fit: _size,
				align: "center",
				valign: "center",
			});
			doc.addPage();
		}
		doc.on("data", (chunk) => buffs.push(chunk));
		doc.on("end", () => resolve(Buffer.concat(buffs)));
		doc.on("error", (err) => reject(err));
		doc.end();
	});
}

module.exports = {
	toPDF,
};
