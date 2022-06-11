module.exports = async (msg, conn) => {
	const { from, isGroup, msgType, sender, key, body } = msg;

	if (msgType == "viewOnceMessage") {
		messagee = { ...msg };
		messagee.message[Object.keys(msg.message)[0]].viewOnce = false;
		const opt = {
			remoteJid: key.remoteJid,
			participant: sender,
			message: messagee,
		};
		ikyEvent.emit("viewOnceMessage", opt);
	}
};
