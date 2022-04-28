let fs = require("fs");
let path = require("path");
let assert = require("assert");
let { spawn } = require("child_process");
let folders = [".", ...Object.keys(require("./package.json").directories)];
let files = [];

for (let i of fs.readdirSync(folders[3]))
	for (let is of fs.readdirSync(path.join(folders[3], i)))
		files.push(path.resolve(path.join(folders[3], i) + "/" + is));
for (let folder of folders)
	for (let file of fs.readdirSync(folder).filter((v) => v.endsWith(".js")))
		files.push(path.resolve(path.join(folder, file)));
for (let file of files) {
	if (file == path.join(__dirname, __filename)) continue;
	console.error("Checking", file);
	spawn(process.argv0, ["-c", file])
		.on("close", () => {
			assert.ok(file);
			console.log("Done", file);
		})
		.stderr.on("data", (chunk) => assert.ok(chunk.length < 1, file + "\n\n" + chunk));
}
