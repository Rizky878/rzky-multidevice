const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const run = require("child_process").exec;
const Exif = require("./exif");
const ex = new Exif();

function convert(file, ext1, ext2, options = []) {
	return new Promise(async (resolve, reject) => {
		let temp = path.join(__dirname, "../temp", Date.now() + "." + ext1),
			out = temp + "." + ext2;
		await fs.promises.writeFile(temp, file);
		ffmpeg(temp)
			.on("start", (cmd) => {
				console.log(cmd);
			})
			.on("error", (e) => {
				fs.unlinkSync(temp);
				reject(e);
			})
			.on("end", () => {
				console.log("Finish");
				setTimeout(() => {
					fs.unlinkSync(temp);
					fs.unlinkSync(out);
				}, 2000);
				resolve(fs.readFileSync(out));
			})
			.addOutputOptions(options)
			.toFormat(ext2)
			.save(out);
	});
}

function convert2(file, ext1, ext2, options = []) {
	return new Promise(async (resolve, reject) => {
		let temp = path.join(__dirname, "../temp", Date.now() + "." + ext1),
			out = temp + "." + ext2;
		await fs.promises.writeFile(temp, file);
		ffmpeg(temp)
			.on("start", (cmd) => {
				console.log(cmd);
			})
			.on("error", (e) => {
				fs.unlinkSync(temp);
				reject(e);
			})
			.on("end", () => {
				console.log("Finish");
				setTimeout(() => {
					fs.unlinkSync(temp);
					fs.unlinkSync(out);
				}, 2000);
				resolve(fs.readFileSync(out));
			})
			.addOutputOptions(options)
			.seekInput("00:00")
			.setDuration("00:05")
			.toFormat(ext2)
			.save(out);
	});
}

async function WAVideo(file, ext1) {
	return convert(file, ext1, "mp4", [
		"-c:a aac",
		"-c:v libx264",
		"-b:a 128K",
		"-ar 44100",
		"-crf 28",
		"-preset slow",
	]);
}

async function WAAudio(file, ext1) {
	return convert(file, ext1, "mp3", ["-vn", "-b:a 192K", "-ar 44100", "-ac 2"]);
}

async function WAOpus(file, ext1) {
	return convert(file, ext1, "opus", ["-vn", "-c:a libopus", "-b:a 128K", "-vbr on", "-compression_level 10"]);
}

async function sticker(file, opts) {
	if (typeof opts.cmdType === "undefined") opts.cmdType = "1";
	const cmd = {
		1: [
			"-fs 1M",
			"-vcodec",
			"libwebp",
			"-vf",
			`scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`,
		],
		2: ["-fs 1M", "-vcodec", "libwebp"],
	};
	if (opts.withPackInfo) {
		if (!opts.packInfo) throw Error("'packInfo' must be filled when using 'withPackInfo'");
		let ext = opts.isImage !== undefined || false ? "jpg" : opts.isVideo !== undefined || false ? "mp4" : null;
		return stickerWithExif(file, ext, opts.packInfo, cmd[parseInt(opts.cmdType)]);
	}

	if (opts.isImage) {
		return convert(file, "jpg", "webp", cmd[parseInt(opts.cmdType)]);
	}
	if (opts.isSticker) {
		return convert(file, "webp", "webp", cmd[parseInt(opts.cmdType)]);
	}
	if (opts.isVideo) {
		return convert2(file, "mp4", "webp", cmd[parseInt(opts.cmdType)]);
	}
}

function stickerWithExif(file, ext, packInfo, cmd) {
	return new Promise(async (res, rej) => {
		let { packname, author } = packInfo;
		const filename = Date.now();
		const stickerBuffer =
			ext === "jpg" ? await convert(file, ext, "webp", cmd) : await convert2(file, ext, "webp", cmd);
		ex.create(
			packname !== undefined || "" ? packname : "Original",
			author !== undefined || "" ? author : "Rzky-Bot",
			filename
		);
		await fs.promises.writeFile(`./temp/${filename}.webp`, stickerBuffer);
		run(
			`webpmux -set exif ./temp/${filename}.exif ./temp/${filename}.webp -o ./temp/${filename}.webp`,
			async (err) => {
				if (err)
					rej(err) &&
						(await Promise.all([
							fs.unlink(`./temp/${filename}.webp`),
							fs.unlink(`./temp/${filename}.exif`),
						]));
				setTimeout(() => {
					fs.unlinkSync(`./temp/${filename}.exif`);
					fs.unlinkSync(`./temp/${filename}.webp`);
				}, 2000);
				res(fs.readFileSync(`./temp/${filename}.webp`));
			}
		);
	});
}

module.exports = {
	toVideo: WAVideo,
	toAudio: WAAudio,
	toOpus: WAOpus,
	sticker,
	convert,
	convert2,
};
